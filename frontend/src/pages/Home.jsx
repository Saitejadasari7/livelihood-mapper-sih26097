import { Link } from "react-router-dom";
import { LANGUAGES, NSQF_MATRIX, useLanguage } from "../context/LanguageContext.jsx";

export default function Home() {
  const { lang, changeLang, t } = useLanguage();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const featureRoutes = [
    "/voice",
    "/livelihood",
    "/skill-gap",
    "/training",
    isLoggedIn ? "/dashboard" : "/register",
    "/livelihood",
  ];

  const stepRoutes = ["/voice", "/dashboard", "/skill-gap", "/training"];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero" style={{ padding: "56px 0" }}>
        <div className="container">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {LANGUAGES.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => changeLang(item.code)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.4)",
                  background: lang === item.code ? "#ffffff" : "rgba(255,255,255,0.12)",
                  color: lang === item.code ? "#0f5132" : "#ffffff",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                {item.native}
              </button>
            ))}
          </div>

          <h1 style={{ maxWidth: 720 }}>{t.heroTitle}</h1>
          <p style={{ maxWidth: 660, marginTop: 12 }}>{t.heroDesc}</p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
            <Link
              to={isLoggedIn ? "/dashboard" : "/register"}
              className="btn btn-primary"
              style={{ background: "#ffffff", color: "#0f5132" }}
            >
              {isLoggedIn ? t.goToDashboard : t.startNow}
            </Link>
            <Link to="/voice" className="btn btn-outline" style={{ borderColor: "#ffffff", color: "#ffffff" }}>
              🎙️ {t.navVoice}
            </Link>
            <Link to="/livelihood" className="btn btn-outline" style={{ borderColor: "#ffffff", color: "#ffffff" }}>
              {t.exploreNsqfBtn}
            </Link>
          </div>
        </div>
      </section>

      {/* Live Interactive Key Features */}
      <section className="page container">
        <div className="center" style={{ marginBottom: 28 }}>
          <h2>{t.exploreFeaturesTitle}</h2>
          <p>{t.exploreFeaturesSub}</p>
        </div>

        <div className="grid grid-3">
          {t.features.map((f, idx) => (
            <Link
              key={idx}
              to={featureRoutes[idx]}
              className="card"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span
                  className="badge"
                  style={{
                    background: "#dcfce7",
                    color: "#166534",
                    fontWeight: 600,
                  }}
                >
                  {f.badge}
                </span>
                <h3 style={{ marginTop: 10 }}>{f.title}</h3>
                <p style={{ marginTop: 6 }}>{f.desc}</p>
              </div>
              <p style={{ marginTop: 16, fontWeight: 700, color: "#0f766e", fontSize: "0.92rem" }}>
                {f.cta}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive NSQF Levels 1-10 Quick Overview */}
      <section className="page container" style={{ paddingTop: 0 }}>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
            <div>
              <h2>{t.matrixTitle}</h2>
              <p className="small">{t.matrixSubtitle}</p>
            </div>
            <Link to="/livelihood" className="btn btn-primary">
              {t.openFullMatrix}
            </Link>
          </div>

          <div style={{ overflowX: "auto" }}>
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
                    <tr key={row.levels} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "10px 12px" }}>
                        <span className="badge" style={{ background: row.badgeColor, color: row.textColor, fontWeight: 700 }}>
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
          </div>
        </div>
      </section>

      {/* How It Works - Clickable Steps */}
      <section className="page container" style={{ paddingTop: 0 }}>
        <div className="center" style={{ marginBottom: 24 }}>
          <h2>{t.howItWorksTitle}</h2>
          <p>{t.howItWorksSub}</p>
        </div>

        <div className="grid grid-2">
          {t.steps.map((s, idx) => (
            <Link
              key={idx}
              to={stepRoutes[idx]}
              className="card"
              style={{ textDecoration: "none", color: "inherit", display: "flex", gap: 16, alignItems: "flex-start" }}
            >
              <span
                style={{
                  minWidth: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#0f766e",
                  color: "#ffffff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                }}
              >
                {idx + 1}
              </span>
              <div>
                <h3>{s.title}</h3>
                <p style={{ marginTop: 4 }}>{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Use It */}
      <section className="page container" style={{ paddingTop: 0 }}>
        <div className="center" style={{ marginBottom: 20 }}>
          <h2>{t.whyUseTitle}</h2>
        </div>

        <div className="grid grid-2">
          {t.whyCards.map((w, idx) => (
            <div className="card" key={idx}>
              <h4>{w.title}</h4>
              <p className="small">{w.desc}</p>
            </div>
          ))}
        </div>

        <div
          className="card"
          style={{
            marginTop: 20,
            background: "#fefce8",
            borderColor: "#fde047",
            color: "#854d0e",
            textAlign: "center",
          }}
        >
          {t.disclaimer}
        </div>
      </section>
    </div>
  );
}