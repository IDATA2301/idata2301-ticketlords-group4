import { useEffect, useRef, useState } from "react";
import {Link} from "react-router-dom";
import { useUnregisteredUser } from "../context/UnregisteredUserContext";
  
export default function RegisterUserPage() {
  const { unregisteredUserId } = useUnregisteredUser() ?? { unregisteredUserId: -1 };
  const [isLoading, setIsLoading] = useState(false);
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
    if (isLoading) return; // Prevent multiple submissions
    
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
    fetch("http://10.212.25.185:8080/users/user/register?uregId=" + encodeURIComponent(unregisteredUserId), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((newUserId) => {
        localStorage.setItem("unregisteredUserId", newUserId.toString());
        console.log(localStorage.getItem("unregisteredUserId"));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error registering user:", error);
        setIsLoading(false);
      });
  };

  return (
    <>
      <div>
        <input type="text" ref={displayNameRef} placeholder="Display name"/>
        <input type="email" ref={emailRef} placeholder="Email"/>
        <input type="text" ref={firstNameRef} placeholder="First name"/>
        <input type="text" ref={lastNameRef} placeholder="Last name"/>
        <input type="tel" ref={phoneNumberRef} placeholder="Phone number"/>
        <input type="password" ref={passwordRef} placeholder="Password"/>

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