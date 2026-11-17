import { NavLink } from "react-router-dom";
import { LANGUAGES, useLanguage } from "../context/LanguageContext.jsx";

export default function Navbar() {
  const { lang, changeLang, t } = useLanguage();

  const links = [
    { to: "/", label: t.navHome, end: true },
    { to: "/voice", label: t.navVoice },
    { to: "/dashboard", label: t.navDashboard },
    { to: "/livelihood", label: t.navPathways },
    { to: "/training", label: t.navTraining },
    { to: "/about", label: t.navAbout },
  ];

  return (
    <header className="navbar">
      <div className="container nav-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <NavLink to="/" className="brand" style={{ fontWeight: 700, fontSize: "1.15rem" }}>
          {t.appName}
        </NavLink>

        <nav className="nav-links" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>
              {l.label}
            </NavLink>
          ))}

          <select
            aria-label="Select Language"
            value={lang}
            onChange={(e) => changeLang(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              background: "#f8fafc",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {LANGUAGES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.native} ({item.label})
              </option>
            ))}
          </select>
        </nav>
      </div>
    </header>
  );
}