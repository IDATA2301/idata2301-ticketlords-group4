import {useEffect, useRef, useState} from "react";
import "../css/RegisterUserPage.css";
import {useNavigate, Link} from "react-router-dom";
import {useUnregisteredUser} from "../context/UnregisteredUserContext";
import {API_BASE_URL} from "../config";
import isValidEmail from "../functions/EmailRegex";
import {isAuthenticated} from "../util/authUtils";


export default function RegisterUserPage() {
  const {unregisteredUserId} = useUnregisteredUser() ?? {unregisteredUserId: -1};
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [registrationError, setRegistrationError] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const navigate = useNavigate();
  const displayNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/user-page");
    }
  }, []);

  const handleSubmit = () => {
    const errors: { [key: string]: string } = {};

    if (isLoading) return; // Prevent multiple submissions

    // Validate required fields
    if (!emailRef.current?.value) errors.email = "Email is required";
    if (!passwordRef.current?.value) errors.password = "Password is required";

    // Validate email format if provided
    const email = emailRef.current?.value || "";
    if (email && !isValidEmail(email)) {
      errors.email = "Please enter a valid email address";
    }

    // If there are errors, show them and return
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setRegistrationError("");
    setEmailError(null);

    const formData = {
      email: emailRef.current?.value || "",
      displayName: displayNameRef.current?.value || "",
      firstName: firstNameRef.current?.value || "",
      lastName: lastNameRef.current?.value || "",
      hashedPassword: passwordRef.current?.value || "",
      phoneNumber: phoneNumberRef.current?.value || "",
      UnregisteredUserId: unregisteredUserId,
    };

    setIsLoading(true);
    fetch(`${API_BASE_URL}/users/user/register?uregId=${encodeURIComponent(unregisteredUserId)}`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.status === 409) {
          setEmailError("Email already in use");
          throw new Error("EMAIL_IN_USE");
        }
        if (!response.ok) {
          throw new Error(`Registration failed: ${response.statusText}`);
        }
        return response.json();
      })
      .then((newUserId) => {
        localStorage.setItem("unregisteredUserId", newUserId.toString());
        navigate("/login");
      })
      .catch((error) => {
        if ((error as Error).message === "EMAIL_IN_USE") return;
        console.error("Error registering user:", error);
        setRegistrationError("Registration failed. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Create account</h2>

        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}>
          <div className="register-field">
            <label>Display name</label>
            <input type="text" ref={displayNameRef} placeholder="Display name" autoFocus/>
          </div>

          <div className="register-field">
            <label>Email</label>
            <input
              type="email"
              ref={emailRef}
              onChange={() => setEmailError(null)}
              placeholder="Email"
              aria-invalid={Boolean(fieldErrors.email || emailError)}
            />
            {fieldErrors.email && <p className="register-error">{fieldErrors.email}</p>}
            {emailError && <p className="register-error">{emailError}</p>}
          </div>

          <div className="register-field">
            <label>First Name</label>
            <input type="text" ref={firstNameRef} placeholder="First name"/>
          </div>

          <div className="register-field">
            <label>Last name</label>
            <input type="text" ref={lastNameRef} placeholder="Last name"/>
          </div>

          <div className="register-field">
            <label>Phone number</label>
            <input type="tel" ref={phoneNumberRef} placeholder="Phone number"/>
          </div>

          <div className="register-field">
            <label>Password</label>
            <input type="password" ref={passwordRef} placeholder="Password"/>
            {fieldErrors.password && <p className="register-error">{fieldErrors.password}</p>}
          </div>

          {registrationError && <p className="register-general-error">{registrationError}</p>}

          <button type="submit" className="register-submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="register-login">
          <Link to="/login">
            <p>Already have a user? Click here!</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
