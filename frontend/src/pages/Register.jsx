import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", { full_name: fullName, email, password });
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Check all fields.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page container">
      <div className="card form-card">
        <h1 style={{ marginBottom: 8 }}>Create an account</h1>
        <p className="small" style={{ marginBottom: 20 }}>
          Save your profile and track your NSQF skilling roadmap.
        </p>
        {error && <div className="alert-err">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full Name</label>
            <input type="text" required minLength={2} value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>Password (minimum 8 characters)</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="small" style={{ marginTop: 16, textAlign: "center" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}