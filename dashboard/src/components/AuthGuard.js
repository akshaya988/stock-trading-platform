import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";
const LOGIN_URL =
  process.env.REACT_APP_LOGIN_URL || "http://localhost:3000/login";

function AuthGuard({ children }) {
  const [status, setStatus] = useState("checking");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    axios
      .get(`${API_URL}/auth/me`, { withCredentials: true })
      .then(() => {
        if (isCurrent) {
          setStatus("authorized");
        }
      })
      .catch((requestError) => {
        if (!isCurrent) {
          return;
        }
        if (requestError.response?.status === 401) {
          window.location.assign(LOGIN_URL);
          return;
        }
        setError(
          "Could not verify your sign-in. Check that the backend is running."
        );
        setStatus("error");
      });

    return () => {
      isCurrent = false;
    };
  }, [attempt]);

  if (status === "authorized") {
    return children;
  }

  if (status === "error") {
    return (
      <main className="auth-guard-message">
        <p role="alert">{error}</p>
        <button type="button" onClick={() => {
          setError("");
          setStatus("checking");
          setAttempt((currentAttempt) => currentAttempt + 1);
        }}>
          Try again
        </button>
      </main>
    );
  }

  return (
    <main className="auth-guard-message" role="status">
      Verifying your sign-in...
    </main>
  );
}

export default AuthGuard;
