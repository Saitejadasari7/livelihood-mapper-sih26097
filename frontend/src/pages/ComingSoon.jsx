import { Link } from "react-router-dom";

export default function ComingSoon({ title, phase, description }) {
  return (
    <div className="page container center">
      <span className="badge badge-soon">Coming soon ({phase})</span>
      <h1>{title}</h1>
      <p>{description}</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}