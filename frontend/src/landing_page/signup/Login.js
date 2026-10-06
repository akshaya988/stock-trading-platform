import React, { useState } from "react";
import axios from "axios";
import { API_URL, redirectToDashboard } from "../../auth";
import "./Signup.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await axios.post(`${API_URL}/auth/login`, form, { withCredentials: true });
      redirectToDashboard();
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "Could not sign in. Check that the backend is running and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="signup-page">
      <div className="signup-layout">
        <section className="signup-intro" aria-labelledby="login-heading">
          <span className="signup-eyebrow">Your portfolio, in one place</span>
          <h1 id="login-heading">Welcome back.</h1>
          <p className="signup-description">
            Sign in with your email and password to open your trading dashboard.
          </p>
          <div className="signup-highlights">
            <div className="signup-highlight">
              <span className="signup-highlight-icon" aria-hidden="true">&#10003;</span>
              <div>
                <h2>Private sign-in</h2>
                <p>Your password is securely hashed and never stored as plain text.</p>
              </div>
            </div>
            <div className="signup-highlight">
              <span className="signup-highlight-icon" aria-hidden="true">&#8599;</span>
              <div>
                <h2>Back to your dashboard</h2>
                <p>Review your holdings, watchlist, and orders after signing in.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="signup-card" aria-labelledby="login-form-heading">
          <div className="signup-card-mark" aria-hidden="true">Z</div>
          <h2 id="login-form-heading">Log in</h2>
          <p className="signup-card-description">Enter your account details.</p>
          <form className="signup-form" onSubmit={handleSubmit}>
            <label className="signup-label" htmlFor="login-email">Email address</label>
            <input
              className="signup-field"
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label className="signup-label" htmlFor="login-password">Password</label>
            <input
              className="signup-field"
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button className="signup-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Log in"}
              <span aria-hidden="true">&rarr;</span>
            </button>
            {error && <p className="signup-message signup-error" role="alert">{error}</p>}
          </form>
          <p className="signup-login">
            New here? <a href="/signup">Create an account</a>
          </p>
        </section>
      </div>
    </main>
  );
}

export default Login;
