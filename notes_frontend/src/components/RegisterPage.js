import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api";
import { setAuth } from "../utils/auth";
import { AuthContext } from "../App";
import { theme } from "../theme";

// PUBLIC_INTERFACE
function RegisterPage() {
  const navigate = useNavigate();
  const { login: setContextLogin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { token, user } = await register(email, password);
      setAuth(token, user);
      setContextLogin(token, user);
      navigate("/");
    } catch (err) {
      setError("Registration failed (" + (err?.message || "Unknown") + ")");
    }
    setSubmitting(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 style={{ color: theme.colors.primary, marginBottom: 8 }}>NotesApp</h1>
        <h2 style={{ fontWeight: 400, fontSize: 20, marginBottom: 28 }}>Create an account</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            autoFocus
            type="email"
            value={email} onChange={e => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
          <label>Password</label>
          <input
            type="password"
            value={password} onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={6}
          />
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" disabled={submitting} style={{ background: theme.colors.accent }}>
            {submitting ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="switch-auth">
          Already have an account?{" "}
          <Link to="/login" style={{ color: theme.colors.primary, textDecoration: "none" }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
