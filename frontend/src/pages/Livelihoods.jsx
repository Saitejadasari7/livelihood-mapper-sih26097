import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import RecommendationCard from "../components/RecommendationCard.jsx";
import SkillCard from "../components/SkillCard.jsx";

export default function Livelihoods() {
  const [recs, setRecs] = useState([]);
  const [progress, setProgress] = useState({});
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

  if (!loggedIn) {
    return (
      <div className="page container center">
        <h1>Livelihood Pathways</h1>
        <p>Please log in to view your ranked livelihood matches and skill gap roadmap.</p>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    );
  }

  return (
    <div className="page container">
      <h1>All Ranked Livelihood Pathways</h1>
      <p>Sorted by skill overlap, sector alignment, education fit, and TF-IDF similarity.</p>

      <div className="stack" style={{ marginTop: 24 }}>
        {recs.map((r) => (
          <div className="grid grid-2" key={r.livelihood_id}>
            <RecommendationCard
              rec={{
                title: `${r.title} — Score: ${r.score}/100`,
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
    </div>
  );
}