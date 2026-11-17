export default function ProfileCard({ profile }) {
  const rows = [
    ["Age range", profile.ageRange],
    ["Location", `${profile.district}, ${profile.state} (${profile.area})`],
    ["Education", profile.education],
    ["Experience", profile.experience],
    ["Interest", profile.interest],
    ["Preference", profile.preference],
  ];

  return (
    <div className="card">
      <h3>Your profile</h3>
      {rows.map(([label, value]) => (
        <div className="row" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}