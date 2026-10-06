import React, { useState } from "react";
import axios from "axios";
import { API_URL, redirectToDashboard } from "../../auth";
import "./Signup.css";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      await axios.post(`${API_URL}/auth/signup`, form, { withCredentials: true });
      redirectToDashboard();
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "Could not create your account. Check that the backend is running and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="signup-page">
      <div className="signup-layout">
        <section className="signup-intro" aria-labelledby="signup-heading">
          <span className="signup-eyebrow">A simpler way to invest</span>
          <h1 id="signup-heading">
            Start your investing
            <br />
            journey today.
          </h1>
          <p className="signup-description">
            Create an account to explore the markets and manage your investments
            from one place.
          </p>
          <div className="signup-highlights">
            <div className="signup-highlight">
              <span className="signup-highlight-icon" aria-hidden="true">&#8377;</span>
              <div>
                <h2>Invest on your terms</h2>
                <p>Simple, transparent pricing with no account opening fee.</p>
              </div>
            </div>
            <div className="signup-highlight">
              <span className="signup-highlight-icon" aria-hidden="true">&#8599;</span>
              <div>
                <h2>Everything in one place</h2>
                <p>Stocks, mutual funds, and more, all in one account.</p>
              </div>
            </div>
            <div className="signup-highlight">
              <span className="signup-highlight-icon" aria-hidden="true">&#10003;</span>
              <div>
                <h2>Built for peace of mind</h2>
                <p>Your account is protected by secure sign-in.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="signup-card" aria-labelledby="signup-form-heading">
          <div className="signup-card-mark" aria-hidden="true">Z</div>
          <h2 id="signup-form-heading">Create your account</h2>
          <p className="signup-card-description">
            Add your details to open your dashboard.
          </p>
          <form className="signup-form" onSubmit={handleSubmit}>
            <label className="signup-label" htmlFor="signup-name">
              Name <span>(optional)</span>
            </label>
            <input
              className="signup-field"
              id="signup-name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
            />

            <label className="signup-label" htmlFor="signup-email">Email address</label>
            <input
              className="signup-field"
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label className="signup-label" htmlFor="signup-password">Password</label>
            <input
              className="signup-field"
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength="8"
              maxLength="128"
              value={form.password}
              onChange={handleChange}
              required
            />
            <p className="signup-input-help">Use at least 8 characters.</p>

            <button className="signup-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
              <span aria-hidden="true">&rarr;</span>
            </button>
            {error && <p className="signup-message signup-error" role="alert">{error}</p>}
          </form>

          <p className="signup-terms">
            By continuing, you agree to our{" "}
            <a href="https://zerodha.com/terms-and-conditions/">Terms &amp; Conditions</a>{" "}
            and <a href="https://zerodha.com/privacy-policy/">Privacy Policy</a>.
          </p>
          <p className="signup-login">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </section>
      </div>
    </main>
  );
}

export default Signup;
