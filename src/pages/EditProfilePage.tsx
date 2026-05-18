import { useEffect, useState } from "react";
import "../css/EditProfilePage.css"
import { API_BASE_URL } from "../config";
import { clearAuthToken, getUserIdFromToken, isAuthenticated } from "../util/authUtils";
import { useNavigate } from "react-router-dom";


export default function UserPage() {
  const navigate = useNavigate();
  const userId = getUserIdFromToken();
  const [user, setUser] = useState({
    email: "",
    displayName: "",
    firstName: "",
    lastName: "",
    password: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }

    if (userId) {
      // Fetch user data from backend
      fetch(`${API_BASE_URL}/users/user/` + encodeURIComponent(userId))
        .then((response) => response.json())
        .then((data) => {
          setUser({
            email: data.email || "",
            displayName: data.displayName || "",
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            password: "",
            phoneNumber: data.phoneNumber || "",
          });
        })
        .catch((error) => console.error("Error fetching user:", error));
    }
  }, []);

  const goToUserPage = () => navigate("/user-page");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.currentTarget;
    setUser((prev) => ({ ...prev, [id]: value }));
  };

  const initials = (user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")
    || user.displayName?.[0]
    || "User";

  const handleUpdateUser = async (): Promise<boolean> => {
    if (userId) {
      try {
        const data = await fetch(`${API_BASE_URL}/users/user/` + encodeURIComponent(userId), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user),
        });

        if (!data.ok) {
          throw new Error("Failed to update user");
        }
        return true;
      } catch {
        console.error("Error updating user");
        return false;
      }
    }
    return false;
  }

  return (
    <div className="user-page">
      {/* Avatar + name hero */}
      <div className="user-hero">
        <div className="user-avatar">{initials.toUpperCase()}</div>
        <h1 className="user-hero__name">
          {user.displayName || `${user.firstName} ${user.lastName}`.trim() || "Your Profile"}
        </h1>
        <p className="user-hero__email">{user.email}</p>
      </div>

      <div className="user-card">
        {/* Account section */}
        <section className="user-section">
          <h2 className="user-section__title">Account</h2>

          <div className="user-field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={user.email} onChange={handleChange} placeholder="example@example.com" />
          </div>

          <div className="user-phone-number">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input type="tel" id="phoneNumber" value={user.phoneNumber} onChange={handleChange} placeholder="123 45 678" />
          </div>

          <div className="user-row">
            <div className="user-field">
              <label htmlFor="password">New Password</label>
              <input type="password" id="password" value="" onChange={handleChange} placeholder="••••••••" />
            </div>
            <div className="user-field">
              <label htmlFor="repeatPassword">Confirm Password</label>
              <input type="password" id="repeatPassword" value="" onChange={handleChange} placeholder="••••••••" />
            </div>
          </div>
        </section>

        <div className="user-divider" />

        {/* Profile section */}
        <section className="user-section">
          <h2 className="user-section__title">Profile</h2>

          <div className="user-field">
            <label htmlFor="displayName">Display Name</label>
            <input type="text" id="displayName" value={user.displayName} onChange={handleChange} placeholder="How others see you" />
          </div>

          <div className="user-row">
            <div className="user-field">
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" value={user.firstName} onChange={handleChange} placeholder="John" />
            </div>
            <div className="user-field">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" value={user.lastName} onChange={handleChange} placeholder="Doe" />
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="user-actions">
          <button className="btn-save" id="submitChanges" onClick={async () => {
            const success = await handleUpdateUser();
            if (success) {
              alert("Details updated successfully!");
              navigate("/user-page");
            } else {
              alert("Failed to update details. Please try again.");
              navigate("/user-page");
            }
          }
          }>Save Changes</button>
          <button className="btn-back" id="back" onClick={goToUserPage}>Back</button>
        </div>
      </div>
    </div >
  );
}
