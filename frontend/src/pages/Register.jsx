import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", {
        full_name: fullName,
        email,
        password,
        role,
      });
      const loginRes = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", loginRes.data.access_token);
      navigate(role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Check details and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page container" style={{ maxWidth: 480 }}>
      <form className="card" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <p className="small" style={{ marginBottom: 16 }}>
          Register as a Job Seeker or as an Admin / Employer to add professions and job opportunities.
        </p>

        {error && (
          <div className="card" style={{ background: "#fef2f2", color: "#991b1b", marginBottom: 12 }}>
            {error}
          </div>
        )}

        <div className="field">
          <label>Account Type</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">Job Seeker / Learner</option>
            <option value="admin">Admin / Employer (Add Professions & Jobs)</option>
          </select>
        </div>

        <div className="field">
          <label>Full Name / Organization Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g., Sai Teja or Skill India Partner"
          />
        </div>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="field">
          <label>Password (min 8 characters)</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Creating account..." : role === "admin" ? "Register as Admin / Employer" : "Register"}
        </button>

        <p className="small center" style={{ marginTop: 14 }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}