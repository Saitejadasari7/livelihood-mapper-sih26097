export default function SkillCard({ have, missing }) {
  const total = have.length + missing.length;
  const width = total === 0 ? 0 : (have.length / total) * 100;

  return (
    <div className="card">
      <h3>Skills for this pathway</h3>
      <p className="small">
        {have.length} of {total} required skills identified from your profile.
        This is a count, not a measure of how well you know them.
      </p>
      <div className="progress" role="progressbar" aria-valuenow={have.length} aria-valuemin={0} aria-valuemax={total}>
        <div className="progress-bar" style={{ width: `${width}%` }} />
      </div>

      <p style={{ marginTop: 14 }}><strong>You already have</strong></p>
      <div>
        {have.map((s) => <span className="tag tag-have" key={s}>{s}</span>)}
      </div>

      <p><strong>Still to learn</strong></p>
      <div>
        {missing.map((s) => <span className="tag tag-missing" key={s}>{s}</span>)}
      </div>
    </div>
  );
}