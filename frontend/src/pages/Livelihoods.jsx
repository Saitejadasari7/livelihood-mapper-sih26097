import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import RecommendationCard from "../components/RecommendationCard.jsx";
import SkillCard from "../components/SkillCard.jsx";
import { NSQF_MATRIX, useLanguage } from "../context/LanguageContext.jsx";
import { translateTerm, translateWithDynamic } from "../utils/dataTranslations.js";

const STATUS_LABELS = {
  en: { planned: "Planned", learning: "Learning", completed: "Completed", listen: "🔊 Listen", ladder: "Next NSQF Upgrade" },
  hi: { planned: "योजनाबद्ध (Planned)", learning: "सीख रहे हैं (Learning)", completed: "पूर्ण (Completed)", listen: "🔊 सुनें", ladder: "अगला NSQF स्तर" },
  te: { planned: "ప్రణాళిక (Planned)", learning: "నేర్చుకుంటున్నాను (Learning)", completed: "పూర్తయింది (Completed)", listen: "🔊 వినండి", ladder: "తదుపరి NSQF స్థాయి" },
  ta: { planned: "திட்டமிடப்பட்டது (Planned)", learning: "கற்றுக்கொள்கிறேன் (Learning)", completed: "முடிந்தது (Completed)", listen: "🔊 கேளுங்கள்", ladder: "அடுத்த NSQF நிலை" },
  ml: { planned: "ആസൂത്രണം ചെയ്തത് (Planned)", learning: "പഠിക്കുന്നു (Learning)", completed: "പൂർത്തിയായി (Completed)", listen: "🔊 കേൾക്കുക", ladder: "അടുത്ത NSQF തലം" },
  kn: { planned: "ಯೋಜಿಸಲಾಗಿದೆ (Planned)", learning: "ಕಲಿಯುತ್ತಿದ್ದೇನೆ (Learning)", completed: "ಪೂರ್ಣಗೊಂಡಿದೆ (Completed)", listen: "🔊 ಕೇಳಿ", ladder: "ಮುಂದಿನ NSQF ಹಂತ" },
};

export default function Livelihoods() {
  const { lang, currentLangObj, t } = useLanguage();
  const stLbl = STATUS_LABELS[lang] || STATUS_LABELS.en;

  const [recs, setRecs] = useState([]);
  const [progress, setProgress] = useState({});
  const [selectedTier, setSelectedTier] = useState("ALL");
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("token")));

  async function load() {
    if (!localStorage.getItem("token")) {
      setLoggedIn(false);
      return;
    }
    const [recRes, progRes] = await Promise.all([
      api.get("/recommendations"),
      api.get("/progress"),
    ]);
    setRecs(recRes.data.recommendations || []);
    const map = {};
    for (const item of progRes.data) map[item.skill] = item.status;
    setProgress(map);
  }

  useEffect(() => {
    load();
  }, []);

  async function setSkillStatus(skillName, status) {
    await api.put("/progress", { skill_name: skillName, status });
    setProgress((prev) => ({ ...prev, [skillName]: status }));
  }

  function speakCard(r) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const localTitle = translateWithDynamic(r.title, lang, r.translations);
    const utter = new SpeechSynthesisUtterance(
      `${localTitle}. ${r.nsqf_levels}. Score ${r.score} out of 100. ${r.next}`
    );
    utter.lang = currentLangObj.speechCode;
    window.speechSynthesis.speak(utter);
  }

  const filteredRecs =
    selectedTier === "ALL"
      ? recs
      : recs.filter((r) => r.nsqf_levels === selectedTier);

  return (
    <div className="page container">
      <h1>{t.matrixTitle}</h1>
      <p>{t.matrixSubtitle}</p>

      <div className="card" style={{ marginTop: 20, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
              <th style={{ padding: "10px 12px" }}>{t.colLevel}</th>
              <th style={{ padding: "10px 12px" }}>{t.colTier}</th>
              <th style={{ padding: "10px 12px" }}>{t.colBenchmark}</th>
              <th style={{ padding: "10px 12px" }}>{t.colRoles}</th>
            </tr>
          </thead>
          <tbody>
            {NSQF_MATRIX.map((row, idx) => {
              const localRow = t.nsqfRows[idx];
              return (
                <tr
                  key={row.levels}
                  onClick={() => setSelectedTier(selectedTier === row.levels ? "ALL" : row.levels)}
                  style={{
                    borderBottom: "1px solid #f1f5f9",
                    cursor: "pointer",
                    background: selectedTier === row.levels ? "#f0fdf4" : "transparent",
                  }}
                >
                  <td style={{ padding: "10px 12px", fontWeight: 700 }}>
                    <span className="badge" style={{ background: row.badgeColor, color: row.textColor }}>
                      {row.levels}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{localRow.tier}</td>
                  <td style={{ padding: "10px 12px" }}>{localRow.benchmark}</td>
                  <td style={{ padding: "10px 12px" }}>{localRow.roles}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
          <button
            className={selectedTier === "ALL" ? "btn btn-primary" : "btn btn-outline"}
            onClick={() => setSelectedTier("ALL")}
          >
            {t.allLevels}
          </button>
          {NSQF_MATRIX.map((row) => (
            <button
              key={row.levels}
              className={selectedTier === row.levels ? "btn btn-primary" : "btn btn-outline"}
              onClick={() => setSelectedTier(row.levels)}
            >
              {row.levels}
            </button>
          ))}
        </div>
      </div>

      {!loggedIn ? (
        <div className="card center" style={{ marginTop: 24 }}>
          <h3>{t.loginPromptTitle}</h3>
          <p>{t.loginPromptDesc}</p>
          <Link to="/login" className="btn btn-primary" style={{ marginTop: 12 }}>
            {t.loginBtn}
          </Link>
        </div>
      ) : (
        <div className="stack" style={{ marginTop: 24 }}>
          {filteredRecs.map((r) => {
            const localTitle = translateWithDynamic(r.title, lang, r.translations);
            return (
              <div className="grid grid-2" key={r.livelihood_id}>
                <div>
                  <RecommendationCard
                    rec={{
                      title: `${localTitle} [${r.nsqf_levels} • ${r.competency_tier}] — ${r.score}/100`,
                      why: r.why,
                      training: r.training,
                      nsqf: r.nsqf,
                      next: r.next,
                    }}
                  />
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
                    <button type="button" className="btn btn-outline" onClick={() => speakCard(r)}>
                      {stLbl.listen}
                    </button>
                    {r.upgrade_pathway && (
                      <span className="small">
                        <strong>⬆️ {stLbl.ladder}:</strong> {r.upgrade_pathway.next_levels} ({r.upgrade_pathway.next_tier})
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <SkillCard
                    have={r.have_skills.map((s) => translateTerm(s, lang))}
                    missing={r.missing_skills.map((s) => translateTerm(s, lang))}
                  />
                  {r.missing_skills.length > 0 && (
                    <div className="card" style={{ marginTop: 14 }}>
                      <p><strong>{t.skillsCoveredLabel}:</strong></p>
                      {r.missing_skills.map((s) => (
                        <div className="row" key={s} style={{ alignItems: "center" }}>
                          <span>{translateTerm(s, lang)}</span>
                          <select
                            value={progress[s] || "planned"}
                            onChange={(e) => setSkillStatus(s, e.target.value)}
                            style={{ padding: "4px 10px", borderRadius: 8 }}
                          >
                            <option value="planned">{stLbl.planned}</option>
                            <option value="learning">{stLbl.learning}</option>
                            <option value="completed">{stLbl.completed}</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}