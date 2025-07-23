import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api";
import { setAuth } from "../utils/auth";
import { AuthContext } from "../App";
import { theme } from "../theme";

// PUBLIC_INTERFACE
function LoginPage() {
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
      const { token, user } = await login(email, password);
      setAuth(token, user);
      setContextLogin(token, user);
      navigate("/");
    } catch (err) {
      setError("Invalid credentials");
    }
    setSubmitting(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 style={{ color: theme.colors.primary, marginBottom: 8 }}>NotesApp</h1>
        <h2 style={{ fontWeight: 400, fontSize: 20, marginBottom: 28 }}>Sign in to your account</h2>
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
            autoComplete="current-password"
          />
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" disabled={submitting} style={{ background: theme.colors.primary }}>
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="switch-auth">
          Don't have an account?{" "}
          <Link to="/register" style={{ color: theme.colors.accent, textDecoration: "none" }}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
