import { NavLink } from "react-router-dom";
import { LANGUAGES, useLanguage } from "../context/LanguageContext.jsx";

export default function Navbar() {
  const { lang, changeLang, t } = useLanguage();

  const links = [
    { to: "/", label: t.navHome, end: true },
    { to: "/voice", label: t.navVoice },
    { to: "/dashboard", label: t.navDashboard },
    { to: "/livelihood", label: t.navPathways },
    { to: "/jobs", label: "Jobs" },
    { to: "/training", label: t.navTraining },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <header
      className="navbar"
      style={{ height: "auto", minHeight: 60, padding: "8px 0" }}
    >
      <div
        className="container nav-inner"
        style={{
          height: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <NavLink
          to="/"
          className="brand"
          style={{
            fontWeight: 700,
            fontSize: "1.05rem",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Livelihood Mapper
        </NavLink>

        <nav
          className="nav-links"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              style={{
                whiteSpace: "nowrap",
                fontSize: "0.86rem",
                lineHeight: 1.5,
                padding: "4px 6px",
              }}
            >
              {l.label}
            </NavLink>
          ))}

          <select
            aria-label="Select Language"
            value={lang}
            onChange={(e) => changeLang(e.target.value)}
            style={{
              padding: "4px 8px",
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              background: "#f8fafc",
              fontWeight: 600,
              fontSize: "0.84rem",
              lineHeight: 1.4,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {LANGUAGES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.native}
              </option>
            ))}
          </select>
        </nav>
      </div>
    </header>
  );
}