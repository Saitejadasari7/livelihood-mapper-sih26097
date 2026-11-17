import { Link } from "react-router-dom";
import ProfileCard from "../components/ProfileCard.jsx";
import SkillCard from "../components/SkillCard.jsx";
import RecommendationCard from "../components/RecommendationCard.jsx";

// SAMPLE DATA for layout preview only. Replaced by real data in Phase 4 and later.
const sample = {
  profile: {
    ageRange: "18-25",
    state: "Andhra Pradesh",
    district: "Sample district",
    area: "Rural",
    education: "Intermediate",
    experience: "Fresher",
    interest: "Computer-related work",
    preference: "Employment",
  },
  have: ["Computer fundamentals", "Typing"],
  missing: ["Spreadsheet operations", "Data handling"],
  rec: {
    title: "Data Entry Operator (illustrative example)",
    why: "Your computer and typing skills overlap with this role's skills.",
    training: "Not yet linked to a verified training program.",
    nsqf: "NSQF mapping not yet verified.",
    next: "To be added from a verified career path.",
  },
};

export default function Dashboard() {
  return (
    <div className="page container">
      <div className="dash-head">
        <h1>Your dashboard</h1>
        <div className="notice" style={{ marginTop: 12 }}>
          <strong>Sample preview.</strong> This is example data to show the
          layout. Login and your real profile arrive in Phase 4, and
          recommendations in Phase 6.
        </div>
      </div>

      <div className="grid grid-2">
        <div className="stack">
          <ProfileCard profile={sample.profile} />
          <div className="card">
            <h3>Next step</h3>
            <p>Talk to the assistant to build your profile.</p>
            <Link to="/voice" className="btn btn-primary" style={{ marginTop: 12 }}>
              Open Voice Assistant
            </Link>
          </div>
        </div>
        <div className="stack">
          <RecommendationCard rec={sample.rec} />
          <SkillCard have={sample.have} missing={sample.missing} />
        </div>
      </div>
    </div>
  );
}