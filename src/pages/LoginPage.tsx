import type React from "react";
import { useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import { API_BASE_URL } from "../config";
import { setAuthToken } from "../util/authUtils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [ error, setError] = useState("");
  const navigate = useNavigate();

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
      navigate("/userPage");
      
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
          onChange={(e) => setEmail(e.target.value)}
        />
        <input type="password" id="password"></input><br></br>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={email === ""}>
          Login
        </button>
      </form>

      <Link to="/registerUser">
        <p>Click here to register a new user!</p>
      </Link>
    </>
  );
}