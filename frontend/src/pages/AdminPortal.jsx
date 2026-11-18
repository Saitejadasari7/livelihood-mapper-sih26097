import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import { saveDynamicTranslation } from "../utils/dataTranslations.js";

export default function AdminPortal() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const [profTitle, setProfTitle] = useState("");
  const [profSector, setProfSector] = useState("Technology");
  const [profEdu, setProfEdu] = useState("10th Pass");
  const [profDesc, setProfDesc] = useState("");
  const [profSkills, setProfSkills] = useState("");
  const [profTrans, setProfTrans] = useState({ hi: "", te: "", ta: "", ml: "", kn: "" });

  const [jobTitle, setJobTitle] = useState("");
  const [jobCompany, setJobCompany] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobSector, setJobSector] = useState("Technology");
  const [jobNsqf, setJobNsqf] = useState("Levels 3–4");
  const [jobSalary, setJobSalary] = useState("₹18,000 - ₹28,000/month");
  const [jobDesc, setJobDesc] = useState("");
  const [jobSkills, setJobSkills] = useState("");
  const [jobTrans, setJobTrans] = useState({ hi: "", te: "", ta: "", ml: "", kn: "" });

  async function loadAdminData() {
    if (!localStorage.getItem("token")) {
      setLoading(false);
      return;
    }
    try {
      const meRes = await api.get("/auth/me");
      setUser(meRes.data);
      if (meRes.data.role === "admin") {
        const appsRes = await api.get("/admin/applications");
        setApplications(appsRes.data || []);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  function autoFillTranslations(title, setter) {
    if (!title.trim()) return;
    const base = title.trim();
    setter({
      hi: `${base} (हिन्दी)`,
      te: `${base} (తెలుగు)`,
      ta: `${base} (தமிழ்)`,
      ml: `${base} (മലയാളം)`,
      kn: `${base} (ಕನ್ನಡ)`,
    });
  }

  async function handleAddProfession(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      const skillsList = profSkills.split(",").map((s) => s.trim()).filter(Boolean);
      await api.post("/admin/professions", {
        title: profTitle,
        sector: profSector,
        description: profDesc,
        suggested_min_education: profEdu,
        required_skills: skillsList,
        translations: profTrans,
      });
      saveDynamicTranslation(profTitle.trim(), profTrans);
      setMsg(`Profession "${profTitle}" saved to SQLite & converted across all 6 languages!`);
      setProfTitle("");
      setProfDesc("");
      setProfSkills("");
      setProfTrans({ hi: "", te: "", ta: "", ml: "", kn: "" });
    } catch (error) {
      setErr(error.response?.data?.detail || "Failed to add profession.");
    }
  }

  async function handleAddJob(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      const skillsList = jobSkills.split(",").map((s) => s.trim()).filter(Boolean);
      await api.post("/admin/jobs", {
        title: jobTitle,
        company: jobCompany,
        location: jobLocation,
        sector: jobSector,
        nsqf_level: jobNsqf,
        salary: jobSalary,
        description: jobDesc,
        required_skills: skillsList,
        translations: jobTrans,
      });
      saveDynamicTranslation(jobTitle.trim(), jobTrans);
      setMsg(`Job Opportunity "${jobTitle}" saved to SQLite with 6-language translations!`);
      setJobTitle("");
      setJobCompany("");
      setJobLocation("");
      setJobDesc("");
      setJobSkills("");
      setJobTrans({ hi: "", te: "", ta: "", ml: "", kn: "" });
    } catch (error) {
      setErr(error.response?.data?.detail || "Failed to post job opportunity.");
    }
  }

  if (loading) return <div className="page container"><p>Checking admin access...</p></div>;

  if (!user || user.role !== "admin") {
    return (
      <div className="page container center">
        <h1>Admin / Employer Portal</h1>
        <p>You must be logged in with an <strong>Admin / Employer</strong> account to add professions and job opportunities.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16 }}>
          <Link to="/register" className="btn btn-primary">Create Admin Account</Link>
          <Link to="/login" className="btn btn-outline">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1>Admin & Employer Studio</h1>
          <p className="small">Logged in as <strong>{user.full_name}</strong> ({user.role.toUpperCase()})</p>
        </div>
        <Link to="/jobs" className="btn btn-outline">View Live Job Board →</Link>
      </div>

      {msg && <div className="alert-ok" style={{ marginTop: 14 }}>{msg}</div>}
      {err && <div className="card" style={{ background: "#fef2f2", color: "#991b1b", marginTop: 14 }}>{err}</div>}

      <div className="grid grid-2" style={{ marginTop: 20 }}>
        {/* Form 1: Add New Profession */}
        <form className="card" onSubmit={handleAddProfession}>
          <h2>1. Add New Profession (NSQF Pathway)</h2>
          <p className="small" style={{ marginBottom: 14 }}>
            Adds a new livelihood role directly into SQLite & the AI/TF-IDF recommender engine.
          </p>

          <div className="field">
            <label>Profession Title (English)</label>
            <input type="text" required value={profTitle} onChange={(e) => setProfTitle(e.target.value)} placeholder="e.g., Drone Agri-Technician" />
          </div>

          <div className="field">
            <label>Sector</label>
            <select value={profSector} onChange={(e) => setProfSector(e.target.value)}>
              <option value="Technology">Technology</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Retail">Retail</option>
              <option value="Construction">Construction</option>
              <option value="Green Jobs">Green Jobs</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <div className="field">
            <label>Minimum Academic Benchmark (NSQF Tier)</label>
            <select value={profEdu} onChange={(e) => setProfEdu(e.target.value)}>
              <option value="Below 10th">Class 5–8 / Basic Literacy (NSQF 1–2)</option>
              <option value="10th Pass">Class 9–10 Pass (NSQF 3–4)</option>
              <option value="Intermediate">Class 11–12 / Intermediate (NSQF 3–4)</option>
              <option value="Diploma / ITI">Diploma / ITI / UG Year 1–2 (NSQF 5–6)</option>
              <option value="Graduate">Bachelor’s Degree (NSQF 7–8)</option>
              <option value="Postgraduate / Ph.D.">Master’s / Ph.D. (NSQF 9–10)</option>
            </select>
          </div>

          <div className="field">
            <label>Required Skills (comma-separated)</label>
            <input type="text" required value={profSkills} onChange={(e) => setProfSkills(e.target.value)} placeholder="e.g., Drone operation, GPS mapping, Safety compliance" />
          </div>

          <div className="field">
            <label>Role Description</label>
            <input type="text" value={profDesc} onChange={(e) => setProfDesc(e.target.value)} placeholder="Brief summary of responsibilities" />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
            <strong>Regional Language Conversions</strong>
            <button type="button" className="btn btn-outline" style={{ padding: "4px 10px", fontSize: "0.8rem" }} onClick={() => autoFillTranslations(profTitle, setProfTrans)}>
              Auto-Fill Locales
            </button>
          </div>

          <div className="grid grid-2" style={{ marginTop: 8 }}>
            <input type="text" placeholder="हिन्दी (Hindi)" value={profTrans.hi} onChange={(e) => setProfTrans({ ...profTrans, hi: e.target.value })} />
            <input type="text" placeholder="తెలుగు (Telugu)" value={profTrans.te} onChange={(e) => setProfTrans({ ...profTrans, te: e.target.value })} />
            <input type="text" placeholder="தமிழ் (Tamil)" value={profTrans.ta} onChange={(e) => setProfTrans({ ...profTrans, ta: e.target.value })} />
            <input type="text" placeholder="മലയാളം (Malayalam)" value={profTrans.ml} onChange={(e) => setProfTrans({ ...profTrans, ml: e.target.value })} />
            <input type="text" placeholder="ಕನ್ನಡ (Kannada)" value={profTrans.kn} onChange={(e) => setProfTrans({ ...profTrans, kn: e.target.value })} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: 16, width: "100%" }}>
            + Publish Profession
          </button>
        </form>

        {/* Form 2: Post Job Opportunity */}
        <form className="card" onSubmit={handleAddJob}>
          <h2>2. Post Job Opportunity</h2>
          <p className="small" style={{ marginBottom: 14 }}>
            Job seekers can search and apply to these openings using their aligned skills.
          </p>

          <div className="field">
            <label>Job Title (English)</label>
            <input type="text" required value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g., Field Solar Technician" />
          </div>

          <div className="grid grid-2">
            <div className="field">
              <label>Organization / Employer</label>
              <input type="text" required value={jobCompany} onChange={(e) => setJobCompany(e.target.value)} placeholder="e.g., GreenGrid India" />
            </div>
            <div className="field">
              <label>Location</label>
              <input type="text" required value={jobLocation} onChange={(e) => setJobLocation(e.target.value)} placeholder="e.g., Vijayawada / Hybrid" />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="field">
              <label>Sector</label>
              <select value={jobSector} onChange={(e) => setJobSector(e.target.value)}>
                <option value="Technology">Technology</option>
                <option value="Green Jobs">Green Jobs</option>
                <option value="Retail">Retail</option>
                <option value="Construction">Construction</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Healthcare">Healthcare</option>
              </select>
            </div>
            <div className="field">
              <label>NSQF Level</label>
              <select value={jobNsqf} onChange={(e) => setJobNsqf(e.target.value)}>
                <option value="Levels 1–2">Levels 1–2</option>
                <option value="Levels 3–4">Levels 3–4</option>
                <option value="Levels 5–6">Levels 5–6</option>
                <option value="Levels 7–8">Levels 7–8</option>
                <option value="Levels 9–10">Levels 9–10</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Salary / Stipend Range</label>
            <input type="text" value={jobSalary} onChange={(e) => setJobSalary(e.target.value)} />
          </div>

          <div className="field">
            <label>Aligned Required Skills (comma-separated)</label>
            <input type="text" required value={jobSkills} onChange={(e) => setJobSkills(e.target.value)} placeholder="e.g., Solar panel mounting, Electrical basics, Safety compliance" />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
            <strong>Regional Language Conversions</strong>
            <button type="button" className="btn btn-outline" style={{ padding: "4px 10px", fontSize: "0.8rem" }} onClick={() => autoFillTranslations(jobTitle, setJobTrans)}>
              Auto-Fill Locales
            </button>
          </div>

          <div className="grid grid-2" style={{ marginTop: 8 }}>
            <input type="text" placeholder="हिन्दी (Hindi)" value={jobTrans.hi} onChange={(e) => setJobTrans({ ...jobTrans, hi: e.target.value })} />
            <input type="text" placeholder="తెలుగు (Telugu)" value={jobTrans.te} onChange={(e) => setJobTrans({ ...jobTrans, te: e.target.value })} />
            <input type="text" placeholder="தமிழ் (Tamil)" value={jobTrans.ta} onChange={(e) => setJobTrans({ ...jobTrans, ta: e.target.value })} />
            <input type="text" placeholder="മലയാളം (Malayalam)" value={jobTrans.ml} onChange={(e) => setJobTrans({ ...jobTrans, ml: e.target.value })} />
            <input type="text" placeholder="ಕನ್ನಡ (Kannada)" value={jobTrans.kn} onChange={(e) => setJobTrans({ ...jobTrans, kn: e.target.value })} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: 16, width: "100%" }}>
            + Publish Job Opportunity
          </button>
        </form>
      </div>

      {/* Candidate Applications Ranked by Skill Alignment */}
      <div className="card" style={{ marginTop: 24, overflowX: "auto" }}>
        <h2>3. Candidate Applications (Sorted by Skill Alignment %)</h2>
        {applications.length === 0 ? (
          <p className="small" style={{ marginTop: 8 }}>No candidate applications received yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", marginTop: 12 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "10px 12px" }}>Candidate</th>
                <th style={{ padding: "10px 12px" }}>Job Role</th>
                <th style={{ padding: "10px 12px" }}>Skill Alignment</th>
                <th style={{ padding: "10px 12px" }}>Matched Skills</th>
                <th style={{ padding: "10px 12px" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <tr key={a.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "10px 12px" }}>
                    <strong>{a.applicant_name}</strong><br />
                    <span className="small">{a.applicant_email}</span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>{a.job_title} ({a.company})</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span className="badge" style={{ background: "#dcfce7", color: "#166534", fontWeight: 700 }}>
                      {a.alignment_pct}%
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>{(a.matched_skills || []).join(", ") || "—"}</td>
                  <td style={{ padding: "10px 12px" }}>{a.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}