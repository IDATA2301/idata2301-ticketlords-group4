import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import { API_BASE_URL } from "../config";
import { isAuthenticated, setAuthToken } from "../util/authUtils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/user-page");
    }
  }, []);

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const password = (document.getElementById("password") as HTMLInputElement).value;

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/users/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        setError("Invalid credentials");
        return;
      }

      const data = await response.json();
      // Store token using auth utility
      setAuthToken(data.token);
      // Navigate to protected page
      navigate("/user-page");
      
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <p>loginpage</p>
        <input
          type="email"
          value={email}
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
        <input
          type="password"
          id="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={email === "" || password === ""}>
          Login
        </button>
      </form>

      <Link to="/register">
        <p>Click here to register a new user!</p>
      </Link>
    </>
  );
}