import { useEffect, useRef, useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import { useUnregisteredUser } from "../context/UnregisteredUserContext";
import { API_BASE_URL } from "../config";

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default function RegisterUserPage() {
  const { unregisteredUserId } = useUnregisteredUser() ?? { unregisteredUserId: -1 };
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [registrationError, setRegistrationError] = useState("");
  const navigate = useNavigate();
  const displayNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => { // TODO: remove on release: prints in log unreg userid
    console.log("Current unreg user ID:", unregisteredUserId);
  }, [unregisteredUserId]);


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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Registration failed: ${response.statusText}`);
        }
        return response.json();
      })
      .then((newUserId) => {
        localStorage.setItem("unregisteredUserId", newUserId.toString());
        console.log(localStorage.getItem("unregisteredUserId"));
        setIsLoading(false);
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error registering user:", error);
        setRegistrationError("Registration failed. Please try again.");
        setIsLoading(false);
      });
  };

  return (
    <>
      <div>
        <input type="text" ref={displayNameRef} placeholder="Display name"/>

        <input type="email" ref={emailRef} placeholder="Email"/>
        {fieldErrors.email && <p style={{ color: "red", fontSize: "12px" }}>{fieldErrors.email}</p>}

        <input type="text" ref={firstNameRef} placeholder="First name"/>

        <input type="text" ref={lastNameRef} placeholder="Last name"/>

        <input type="tel" ref={phoneNumberRef} placeholder="Phone number"/>

        <input type="password" ref={passwordRef} placeholder="Password"/>
        {fieldErrors.password && <p style={{ color: "red", fontSize: "12px" }}>{fieldErrors.password}</p>}

        {registrationError && <p style={{ color: "red", fontSize: "12px" }}>{registrationError}</p>}
        <button type="button" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
      </div>

      <Link to="/login">
        <p>Already have a user? Click here!</p>
      </Link>
    </>
  );
}