export default function RecommendationCard({ rec }) {
  return (
    <div className="card">
      <h3>{rec.title}</h3>
      <p><strong>Why suggested:</strong> {rec.why}</p>
      <p style={{ marginTop: 10 }}><strong>Suggested training:</strong> {rec.training}</p>
      <p style={{ marginTop: 10 }}><strong>NSQF:</strong> {rec.nsqf}</p>
      <p style={{ marginTop: 10 }}><strong>Possible next step:</strong> {rec.next}</p>
      <p className="small" style={{ marginTop: 12 }}>
        This is a suggestion, not a verified job vacancy.
      </p>
    </div>
  );
}