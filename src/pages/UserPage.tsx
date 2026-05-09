import { useEffect, useState } from "react";
import "../css/UserPage.css"
import { API_BASE_URL } from "../config";
import { getEmailFromToken, isAuthenticated } from "../util/authUtils";
import { useNavigate } from "react-router-dom";

export default function UserPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    displayName: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
    // Fetch user data from backend
    fetch(`${API_BASE_URL}/users/user/1`) //TODO: change 0 to {id} when users have their own page
      .then((response) => response.json())
      .then((data) => {
        setUser({
          email: data.email || "",
          displayName: data.displayName || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          password: "",
        });
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.currentTarget;
    setUser((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <>
      <p>Edit the user</p>
      <label htmlFor="email">Email: </label>
      <input
        type="email"
        id="email"
        value={user.email}
        onChange={handleChange}
      /><br />

      <label htmlFor="password">Password: </label>
      <input
        type="password"
        id="password"
        value=""
        onChange={handleChange}
      /><br />

      <label htmlFor="repeatPassword">Repeat password: </label>
      <input
        type="password"
        id="repeatPassword"
        value=""
        onChange={handleChange}
      /><br />

      <br />

      <label htmlFor="displayName">Display Name: </label>
      <input
        type="text"
        id="displayName"
        value={user.displayName}
        onChange={handleChange}
      /><br />

      <label htmlFor="firstName">First Name: </label>
      <input
        type="text"
        id="firstName"
        value={user.firstName}
        onChange={handleChange}
      /><br />

      <label htmlFor="lastName">Last Name: </label>
      <input
        type="text"
        id="lastName"
        value={user.lastName}
        onChange={handleChange}
      /><br />

      <br />

      <button id="submitChanges">Submit changes</button>

    </>
  );
}

/*
Vitest
testcontainer (docker)
*/
