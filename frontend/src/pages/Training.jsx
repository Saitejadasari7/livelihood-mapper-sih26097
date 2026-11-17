import { useEffect, useState } from "react";
import api from "../services/api.js";

export default function Training() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/training").then((res) => {
      setPrograms(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="page container"><p>Loading NSQF catalogue...</p></div>;

  return (
    <div className="page container">
      <h1>NSQF-Aligned Training Catalogue</h1>
      <p>Verified qualification packs and training programs mapped from official NQR & Skill India records.</p>
      <div className="grid grid-2" style={{ marginTop: 24 }}>
        {programs.map((p) => (
          <div className="card" key={p.id}>
            <span className="badge" style={{ background: "#dcfce7", color: "#166534" }}>
              {p.nsqf.verified ? `NSQF Level ${p.nsqf.level} • ${p.nsqf.code}` : "NSQF mapping not yet verified"}
            </span>
            <h3>{p.title}</h3>
            <p><strong>Provider:</strong> {p.provider} ({p.mode}, {p.duration})</p>
            <p style={{ marginTop: 8 }}><strong>Qualification:</strong> {p.nsqf.name || "Unverified"}</p>
            <p style={{ marginTop: 8 }}><strong>Skills covered:</strong> {p.skills.join(", ")}</p>
            <p className="small" style={{ marginTop: 10 }}>
              Verified on {p.last_verified} • Source: {p.source}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}