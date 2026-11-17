import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import RecommendationCard from "../components/RecommendationCard.jsx";
import SkillCard from "../components/SkillCard.jsx";
import { NSQF_MATRIX, useLanguage } from "../context/LanguageContext.jsx";

export default function Livelihoods() {
  const { t } = useLanguage();
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

  const filteredRecs =
    selectedTier === "ALL"
      ? recs
      : recs.filter((r) => r.nsqf_levels === selectedTier);

  return (
    <div className="page container">
      <h1>{t.matrixTitle}</h1>
      <p>{t.matrixSubtitle}</p>

      {/* Full NSQF Levels 1-10 Reference Matrix */}
      <div className="card" style={{ marginTop: 20, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
              <th style={{ padding: "10px 12px" }}>NSQF Level</th>
              <th style={{ padding: "10px 12px" }}>Competency Tier</th>
              <th style={{ padding: "10px 12px" }}>Equivalent Academic / Entry Benchmark</th>
              <th style={{ padding: "10px 12px" }}>Typical Livelihood & Job Roles</th>
            </tr>
          </thead>
          <tbody>
            {NSQF_MATRIX.map((row) => (
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
                  <span
                    className="badge"
                    style={{ background: row.badgeColor, color: row.textColor }}
                  >
                    {row.levels}
                  </span>
                </td>
                <td style={{ padding: "10px 12px", fontWeight: 600 }}>{row.tier}</td>
                <td style={{ padding: "10px 12px" }}>{row.benchmark}</td>
                <td style={{ padding: "10px 12px" }}>{row.roles}</td>
              </tr>
            ))}
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
          <h3>Personalized NSQF Ranking</h3>
          <p>Log in to see your personalized match scores across all 10 NSQF levels.</p>
          <Link to="/login" className="btn btn-primary" style={{ marginTop: 12 }}>
            Login
          </Link>
        </div>
      ) : (
        <div className="stack" style={{ marginTop: 24 }}>
          {filteredRecs.map((r) => (
            <div className="grid grid-2" key={r.livelihood_id}>
              <RecommendationCard
                rec={{
                  title: `${r.title} [${r.nsqf_levels} • ${r.competency_tier}] — Score: ${r.score}/100`,
                  why: r.why,
                  training: r.training,
                  nsqf: r.nsqf,
                  next: r.next,
                }}
              />
              <div>
                <SkillCard have={r.have_skills} missing={r.missing_skills} />
                {r.missing_skills.length > 0 && (
                  <div className="card" style={{ marginTop: 14 }}>
                    <p><strong>Track your missing skills:</strong></p>
                    {r.missing_skills.map((s) => (
                      <div className="row" key={s} style={{ alignItems: "center" }}>
                        <span>{s}</span>
                        <select
                          value={progress[s] || "planned"}
                          onChange={(e) => setSkillStatus(s, e.target.value)}
                          style={{ padding: "4px 10px", borderRadius: 8 }}
                        >
                          <option value="planned">Planned</option>
                          <option value="learning">Learning</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}