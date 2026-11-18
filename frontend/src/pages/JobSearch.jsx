import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { translateTerm, translateWithDynamic } from "../utils/dataTranslations.js";

const JOB_LABELS = {
  en: { title: "Skill-Aligned Job Opportunities", sub: "Search jobs posted by verified employers & admins, automatically translated into your language.", searchPh: "Search by role, skill, or location...", onlyMySkills: "Match with my profile skills", matchScore: "Skill Alignment", applyBtn: "Express Interest", appliedBtn: "✓ Application Sent", listenBtn: "🔊 Listen" },
  hi: { title: "कौशल-आधारित नौकरी के अवसर", sub: "सत्यापित नियोक्ताओं और एडमिन द्वारा पोस्ट की गई नौकरियां खोजें।", searchPh: "पद, कौशल या स्थान से खोजें...", onlyMySkills: "मेरे कौशल से मेल खाने वाली नौकरियां", matchScore: "कौशल मिलान", applyBtn: "आवेदन करें", appliedBtn: "✓ आवेदन भेजा गया", listenBtn: "🔊 सुनें" },
  te: { title: "నైపుణ్యాలకు సరిపోయే ఉద్యోగ అవకాశాలు", sub: "ధృవీకరించబడిన సంస్థలు మరియు అడ్మిన్లు పోస్ట్ చేసిన ఉద్యోగాలను వెతకండి.", searchPh: "ఉద్యోగం, నైపుణ్యం లేదా ప్రాంతం ద్వారా వెతకండి...", onlyMySkills: "నా నైపుణ్యాలకు సరిపోయేవి మాత్రమే", matchScore: "నైపుణ్య సరిపోలిక", applyBtn: "ఆసక్తి చూపండి", appliedBtn: "✓ దరఖాస్తు పంపబడింది", listenBtn: "🔊 వినండి" },
  ta: { title: "திறன்களுக்கு ஏற்ற வேலை வாய்ப்புகள்", sub: "அங்கீகரிக்கப்பட்ட நிறுவனங்கள் வெளியிட்ட வேலைகளைத் தேடுங்கள்.", searchPh: "வேலை, திறன் அல்லது இடத்தைத் தேடுங்கள்...", onlyMySkills: "என் திறன்களுக்குப் பொருந்தியவை மட்டும்", matchScore: "திறன் பொருத்தம்", applyBtn: "விருப்பம் தெரிவி", appliedBtn: "✓ விண்ணப்பிக்கப்பட்டது", listenBtn: "🔊 கேளுங்கள்" },
  ml: { title: "നൈപുണ്യത്തിന് അനുയോജ്യമായ തൊഴിലവസരങ്ങൾ", sub: "അംഗീകൃത തൊഴിലുടമകൾ പ്രസിദ്ധീകരിച്ച ജോലികൾ തിരയുക.", searchPh: "ജോലി, നൈപുണ്യം അല്ലെങ്കിൽ സ്ഥലം തിരയുക...", onlyMySkills: "എന്റെ കഴിവുകൾക്ക് അനുയോജ്യമായവ മാത്രം", matchScore: "നൈപുണ്യ പൊരുത്തം", applyBtn: "താൽപ്പര്യം അറിയിക്കുക", appliedBtn: "✓ അപേക്ഷ അയച്ചു", listenBtn: "🔊 കേൾക്കുക" },
  kn: { title: "ಕೌಶಲ್ಯಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗುವ ಉದ್ಯೋಗಾವಕಾಶಗಳು", sub: "ದೃಢೀಕೃತ ಉದ್ಯೋಗದಾತರು ಪೋಸ್ಟ್ ಮಾಡಿದ ಉದ್ಯೋಗಗಳನ್ನು ಹುಡುಕಿ.", searchPh: "ಹುದ್ದೆ, ಕೌಶಲ್ಯ ಅಥವಾ ಸ್ಥಳದ ಮೂಲಕ ಹುಡುಕಿ...", onlyMySkills: "ನನ್ನ ಕೌಶಲ್ಯಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗುವವು ಮಾತ್ರ", matchScore: "ಕೌಶಲ್ಯ ಹೊಂದಾಣಿಕೆ", applyBtn: "ಆಸಕ್ತಿ ತೋರಿಸಿ", appliedBtn: "✓ ಅರ್ಜಿ ಸಲ್ಲಿಸಲಾಗಿದೆ", listenBtn: "🔊 ಕೇಳಿ" },
};

export default function JobSearch() {
  const { lang, currentLangObj } = useLanguage();
  const lbl = JOB_LABELS[lang] || JOB_LABELS.en;
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [query, setQuery] = useState("");
  const [nsqfFilter, setNsqfFilter] = useState("ALL");
  const [alignedOnly, setAlignedOnly] = useState(false);
  const [appliedIds, setAppliedIds] = useState([]);

  async function loadJobs() {
    const res = await api.get("/jobs", {
      params: { q: query, nsqf_level: nsqfFilter },
    });
    setJobs(res.data || []);
  }

  useEffect(() => {
    loadJobs();
  }, [query, nsqfFilter]);

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    api
      .get("/recommendations")
      .then((res) => setUserSkills(res.data.user_skills || []))
      .catch(() => {});
  }, []);

  function getSkillAlignment(reqSkills = []) {
    if (!reqSkills.length) return 100;
    if (!userSkills.length) return 0;
    const userSet = new Set(userSkills.map((s) => s.toLowerCase()));
    const matched = reqSkills.filter((s) => userSet.has(s.toLowerCase()));
    return Math.round((matched.length / reqSkills.length) * 100);
  }

  async function handleApply(jobId) {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    try {
      await api.post(`/jobs/${jobId}/apply`);
      setAppliedIds((prev) => [...prev, jobId]);
    } catch {
      alert("Please log in to express interest in this job.");
    }
  }

  function speakJob(job) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const localTitle = translateWithDynamic(job.title, lang, job.translations);
    const utter = new SpeechSynthesisUtterance(
      `${localTitle}. ${job.company}. ${job.location}. ${job.salary}.`
    );
    utter.lang = currentLangObj.speechCode;
    window.speechSynthesis.speak(utter);
  }

  const displayedJobs = alignedOnly
    ? jobs.filter((j) => getSkillAlignment(j.required_skills) > 0)
    : jobs;

  return (
    <div className="page container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1>{lbl.title}</h1>
          <p>{lbl.sub}</p>
        </div>
        <Link to="/admin" className="btn btn-outline">+ Admin / Employer Portal</Link>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lbl.searchPh}
            style={{ flex: 1, minWidth: 220 }}
          />
          <select value={nsqfFilter} onChange={(e) => setNsqfFilter(e.target.value)}>
            <option value="ALL">All NSQF Levels (1–10)</option>
            <option value="Levels 1–2">Levels 1–2</option>
            <option value="Levels 3–4">Levels 3–4</option>
            <option value="Levels 5–6">Levels 5–6</option>
            <option value="Levels 7–8">Levels 7–8</option>
            <option value="Levels 9–10">Levels 9–10</option>
          </select>
          <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={alignedOnly}
              onChange={(e) => setAlignedOnly(e.target.checked)}
            />
            {lbl.onlyMySkills}
          </label>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: 20 }}>
        {displayedJobs.map((job) => {
          const alignPct = getSkillAlignment(job.required_skills);
          const applied = appliedIds.includes(job.id);
          return (
            <div className="card" key={job.id}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                <span className="badge" style={{ background: "#e0f2fe", color: "#0369a1", fontWeight: 700 }}>
                  {job.nsqf_level} • {job.sector}
                </span>
                {userSkills.length > 0 && (
                  <span className="badge" style={{ background: "#dcfce7", color: "#166534", fontWeight: 700 }}>
                    {lbl.matchScore}: {alignPct}%
                  </span>
                )}
              </div>

              <h3 style={{ marginTop: 10 }}>
                {translateWithDynamic(job.title, lang, job.translations)}
              </h3>
              <p className="small">
                <strong>{job.company}</strong> • {job.location} • <strong>{job.salary}</strong>
              </p>

              {job.description && <p style={{ marginTop: 8 }}>{job.description}</p>}

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
                {(job.required_skills || []).map((skill) => (
                  <span
                    key={skill}
                    className="badge"
                    style={{ background: "#f1f5f9", color: "#0f172a" }}
                  >
                    {translateTerm(skill, lang)}
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                <button
                  type="button"
                  className={applied ? "btn btn-outline" : "btn btn-primary"}
                  onClick={() => handleApply(job.id)}
                  disabled={applied}
                >
                  {applied ? lbl.appliedBtn : lbl.applyBtn}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => speakJob(job)}
                >
                  {lbl.listenBtn}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}