import { useEffect, useState } from "react";
import api from "../services/api.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { translateDuration, translateMeta, translateTerm } from "../utils/dataTranslations.js";

export default function Training() {
  const { lang, t } = useLanguage();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/training")
      .then((res) => {
        setPrograms(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page container">
        <p>Loading NSQF catalogue...</p>
      </div>
    );
  }

  return (
    <div className="page container">
      <h1>{t.trainingTitle}</h1>
      <p>{t.trainingSub}</p>

      <div className="grid grid-2" style={{ marginTop: 24 }}>
        {programs.map((p) => (
          <div className="card" key={p.id}>
            <span
              className="badge"
              style={{ background: "#dcfce7", color: "#166534", fontWeight: 600 }}
            >
              {p.nsqf.verified
                ? `${translateMeta("NSQF Level", lang)} ${p.nsqf.level} • ${p.nsqf.code}`
                : "NSQF mapping not yet verified"}
            </span>

            <h3 style={{ marginTop: 10 }}>{translateTerm(p.title, lang)}</h3>

            <p style={{ marginTop: 6 }}>
              <strong>{t.providerLabel}:</strong> {p.provider} (
              {translateTerm(p.mode, lang)}, {translateDuration(p.duration, lang)})
            </p>

            <p style={{ marginTop: 8 }}>
              <strong>{t.qualificationLabel}:</strong>{" "}
              {p.nsqf.name ? translateTerm(p.nsqf.name, lang) : "Unverified"}
            </p>

            <p style={{ marginTop: 8 }}>
              <strong>{t.skillsCoveredLabel}:</strong>{" "}
              {p.skills.map((s) => translateTerm(s, lang)).join(", ")}
            </p>

            <p className="small" style={{ marginTop: 10 }}>
              {translateMeta("Verified on", lang)} {p.last_verified} •{" "}
              {translateMeta("Source", lang)}: {p.source}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}