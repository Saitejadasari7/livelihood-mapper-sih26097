import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import ProfileCard from "../components/ProfileCard.jsx";
import SkillCard from "../components/SkillCard.jsx";
import RecommendationCard from "../components/RecommendationCard.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { translateTerm, translateWithDynamic } from "../utils/dataTranslations.js";

const emptyProfile = {
  age_range: "18-25",
  state: "",
  district: "",
  area_type: "Rural",
  education_level: "Intermediate",
  experience_level: "Fresher",
  interest_sector: "Technology",
  career_preference: "Employment",
  skills: [],
};

export default function Dashboard() {
  const { lang, currentLangObj, t } = useLanguage();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(emptyProfile);
  const [skillsInput, setSkillsInput] = useState("");
  const [recs, setRecs] = useState([]);
  const [editing, setEditing] = useState(false);
  const [showPassbook, setShowPassbook] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function loadDashboard() {
    if (!localStorage.getItem("token")) {
      setLoading(false);
      return;
    }
    try {
      const [meRes, profRes, recRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/profile"),
        api.get("/recommendations"),
      ]);
      setUser(meRes.data);
      const merged = { ...emptyProfile, ...profRes.data };
      setForm(merged);
      setSkillsInput((merged.skills || []).join(", "));
      setRecs(recRes.data.recommendations || []);
    } catch {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function saveProfile(e) {
    e.preventDefault();
    setMsg("");
    const parsedSkills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    await api.put("/profile", { ...form, skills: parsedSkills });
    await loadDashboard();
    setEditing(false);
    setMsg("Profile & skills saved — recommendations updated.");
  }

  function speakTopMatch() {
    if (!recs.length || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const top = recs[0];
    const titleLocal = translateWithDynamic(top.title, lang, top.translations);
    const summary = `${titleLocal}. ${top.nsqf_levels}. Match Score ${top.score} out of 100. ${top.next}`;
    const utter = new SpeechSynthesisUtterance(summary);
    utter.lang = currentLangObj.speechCode;
    window.speechSynthesis.speak(utter);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  }

  if (loading) {
    return (
      <div className="page container">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page container center">
        <h1>{t.navDashboard}</h1>
        <p>{t.loginPromptDesc}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16 }}>
          <Link to="/login" className="btn btn-primary">
            {t.loginBtn}
          </Link>
          <Link to="/register" className="btn btn-outline">
            {t.registerBtn}
          </Link>
        </div>
      </div>
    );
  }

  const contactDisplay = [
    user.email,
    user.phone ? `+91 ${user.phone}` : null,
  ]
    .filter(Boolean)
    .join(" • ");

  const cardProfile = {
    ageRange: form.age_range || "Not set",
    state: form.state || "State not set",
    district: form.district || "District not set",
    area: form.area_type || "Rural",
    education: form.education_level || "Not set",
    experience: form.experience_level || "Not set",
    interest: form.interest_sector || "Not set",
    preference: form.career_preference || "Not set",
  };

  const topRec = recs[0];

  return (
    <div className="page container">
      <div
        className="dash-head"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1>
            {t.welcomeLabel}, {user.full_name}
          </h1>
          <p className="small">
            {contactDisplay} • Role: <strong>{user.role.toUpperCase()}</strong>
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => setShowPassbook(!showPassbook)}
            className="btn btn-primary"
          >
            📄 {showPassbook ? "Hide Passbook" : "Kaushal Readiness Passbook"}
          </button>
          <button onClick={logout} className="btn btn-outline">
            {t.logoutLabel}
          </button>
        </div>
      </div>

      {msg && (
        <div className="alert-ok" style={{ marginTop: 12 }}>
          {msg}
        </div>
      )}

      {/* Kaushal Readiness Passbook Card (Printable / PDF Export) */}
      {showPassbook && (
        <div
          className="card"
          style={{
            marginTop: 18,
            border: "2px solid #0f766e",
            background: "#f8fafc",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div>
              <span
                className="badge"
                style={{ background: "#0f766e", color: "#ffffff" }}
              >
                SIH26097 • OFFICIAL SKILL & NSQF SUMMARY
              </span>
              <h2 style={{ marginTop: 8 }}>Kaushal Readiness Passbook</h2>
            </div>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => window.print()}
            >
              🖨️ Print / Save as PDF
            </button>
          </div>

          <div className="grid grid-2" style={{ marginTop: 14 }}>
            <div>
              <p>
                <strong>Learner Name:</strong> {user.full_name}
              </p>
              <p>
                <strong>Contact:</strong> {contactDisplay || "—"}
              </p>
              <p>
                <strong>Location:</strong> {form.district || "—"},{" "}
                {form.state || "—"} ({form.area_type})
              </p>
              <p>
                <strong>Education Benchmark:</strong> {form.education_level}
              </p>
              <p>
                <strong>Target Sector:</strong> {form.interest_sector} (
                {form.career_preference})
              </p>
            </div>
            <div>
              <p>
                <strong>Verified Skills:</strong>{" "}
                {(form.skills || [])
                  .map((s) => translateTerm(s, lang))
                  .join(", ") || "None added yet"}
              </p>
              {topRec && (
                <>
                  <p>
                    <strong>Top Matched Pathway:</strong>{" "}
                    {translateWithDynamic(
                      topRec.title,
                      lang,
                      topRec.translations
                    )}{" "}
                    ({topRec.score}/100)
                  </p>
                  <p>
                    <strong>NSQF Tier:</strong> {topRec.nsqf_levels} —{" "}
                    {topRec.competency_tier}
                  </p>
                  <p>
                    <strong>Recommended Qualification:</strong> {topRec.nsqf}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-2" style={{ marginTop: 20 }}>
        <div className="stack">
          {!editing ? (
            <>
              <ProfileCard profile={cardProfile} />
              <div className="card">
                <p>
                  <strong>Saved Skills ({(form.skills || []).length}):</strong>
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    marginTop: 8,
                  }}
                >
                  {(form.skills || []).length > 0 ? (
                    form.skills.map((s) => (
                      <span
                        key={s}
                        className="badge"
                        style={{ background: "#dcfce7", color: "#166534" }}
                      >
                        {translateTerm(s, lang)}
                      </span>
                    ))
                  ) : (
                    <span className="small">
                      No skills added yet. Click Edit Profile or use Voice
                      Assistant.
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="btn btn-outline"
              >
                {t.editProfileLabel}
              </button>
            </>
          ) : (
            <form className="card" onSubmit={saveProfile}>
              <h3 style={{ marginBottom: 14 }}>{t.editProfileLabel}</h3>
              <div className="field">
                <label>Age Range</label>
                <select
                  value={form.age_range || ""}
                  onChange={(e) =>
                    setForm({ ...form, age_range: e.target.value })
                  }
                >
                  <option value="18-25">18-25</option>
                  <option value="26-35">26-35</option>
                  <option value="36-45">36-45</option>
                  <option value="46+">46+</option>
                </select>
              </div>
              <div className="field">
                <label>State</label>
                <input
                  type="text"
                  placeholder="e.g. Andhra Pradesh"
                  value={form.state || ""}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
              </div>
              <div className="field">
                <label>District</label>
                <input
                  type="text"
                  placeholder="e.g. Krishna"
                  value={form.district || ""}
                  onChange={(e) =>
                    setForm({ ...form, district: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label>Area Type</label>
                <select
                  value={form.area_type || "Rural"}
                  onChange={(e) =>
                    setForm({ ...form, area_type: e.target.value })
                  }
                >
                  <option value="Rural">Rural</option>
                  <option value="Urban">Urban</option>
                </select>
              </div>
              <div className="field">
                <label>Education Level</label>
                <select
                  value={form.education_level || ""}
                  onChange={(e) =>
                    setForm({ ...form, education_level: e.target.value })
                  }
                >
                  <option value="Class 5-8">
                    Class 5–8 / Basic Literacy (NSQF 1–2)
                  </option>
                  <option value="10th Pass">
                    Class 9–10 Pass (NSQF 3–4)
                  </option>
                  <option value="Intermediate">
                    Class 11–12 / Intermediate (NSQF 3–4)
                  </option>
                  <option value="Diploma / ITI">
                    Diploma / ITI / UG Year 1–2 (NSQF 5–6)
                  </option>
                  <option value="Graduate">
                    Bachelor’s Degree (NSQF 7–8)
                  </option>
                  <option value="Postgraduate / Ph.D.">
                    Master’s / Ph.D. (NSQF 9–10)
                  </option>
                </select>
              </div>
              <div className="field">
                <label>Experience Level</label>
                <select
                  value={form.experience_level || ""}
                  onChange={(e) =>
                    setForm({ ...form, experience_level: e.target.value })
                  }
                >
                  <option value="Fresher">Fresher</option>
                  <option value="1-2 Years">1-2 Years</option>
                  <option value="3+ Years">3+ Years</option>
                </select>
              </div>
              <div className="field">
                <label>Interest Sector</label>
                <select
                  value={form.interest_sector || ""}
                  onChange={(e) =>
                    setForm({ ...form, interest_sector: e.target.value })
                  }
                >
                  <option value="Technology">Technology</option>
                  <option value="Retail">Retail</option>
                  <option value="Construction">Construction</option>
                  <option value="Green Jobs">Green Jobs</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Business">Business & Office</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Healthcare">Healthcare</option>
                </select>
              </div>
              <div className="field">
                <label>Career Preference</label>
                <select
                  value={form.career_preference || ""}
                  onChange={(e) =>
                    setForm({ ...form, career_preference: e.target.value })
                  }
                >
                  <option value="Employment">Wage Employment</option>
                  <option value="Self-Employment">
                    Self-Employment / Entrepreneurship
                  </option>
                  <option value="Apprenticeship">
                    Apprenticeship / Training
                  </option>
                </select>
              </div>
              <div className="field">
                <label>Skills (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Computer fundamentals, Typing, Python programming"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" className="btn btn-primary">
                  {t.saveProfileBtn}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditing(false)}
                >
                  {t.cancelLabel}
                </button>
              </div>
            </form>
          )}

          <div className="card">
            <h3>{t.navVoice}</h3>
            <p className="small">
              Use Voice or Traditional Form in 6 Indian languages to update your
              skills.
            </p>
            <Link
              to="/voice"
              className="btn btn-primary"
              style={{ marginTop: 12 }}
            >
              🎙️ {t.navVoice}
            </Link>
          </div>
        </div>

        <div className="stack">
          {topRec ? (
            <>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={speakTopMatch}
                >
                  🔊 Listen to Top Match ({currentLangObj.native})
                </button>
              </div>
              <RecommendationCard
                rec={{
                  title: `${translateWithDynamic(
                    topRec.title,
                    lang,
                    topRec.translations
                  )} [${topRec.nsqf_levels}] — ${topRec.score}/100`,
                  why: topRec.why,
                  training: topRec.training,
                  nsqf: topRec.nsqf,
                  next: topRec.next,
                }}
              />
              <SkillCard
                have={topRec.have_skills.map((s) => translateTerm(s, lang))}
                missing={topRec.missing_skills.map((s) =>
                  translateTerm(s, lang)
                )}
              />
              {topRec.upgrade_pathway && (
                <div
                  className="card"
                  style={{ background: "#f0fdf4", borderColor: "#86efac" }}
                >
                  <strong>
                    ⬆️ Vertical NSQF Career Ladder →{" "}
                    {topRec.upgrade_pathway.next_levels} (
                    {topRec.upgrade_pathway.next_tier})
                  </strong>
                  <p className="small" style={{ marginTop: 6 }}>
                    {topRec.upgrade_pathway.advice}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="card">
              <h3>No recommendations yet</h3>
              <p>
                Use the Voice Assistant or Edit Profile to set your skills and
                sector.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}