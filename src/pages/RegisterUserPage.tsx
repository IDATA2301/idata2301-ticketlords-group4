import {Link} from "react-router-dom";
import { useRef } from "react";import { useUnregisteredUser } from "../context/UnregisteredUserContext";
  
export default function RegisterUserPage() {
  const { unregisteredUserId } = useUnregisteredUser();
  const displayNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const formData = {
      UnregisteredUserId: unregisteredUserId,
      displayName: displayNameRef.current?.value || "",
      email: emailRef.current?.value || "",
      firstName: firstNameRef.current?.value || "",
      lastName: lastNameRef.current?.value || "",
      phoneNumber: phoneNumberRef.current?.value || "",
      password: passwordRef.current?.value || "",
      role: "USER", /* not secure, should be handled in backend */
    };

    fetch("http://10.212.25.185:8080/users/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error registering user:", error));
  };

  return (
    <>
      <p>registerUser page</p>
      <div>
        <input type="text" ref={displayNameRef} placeholder="Display name"/>
        <input type="email" ref={emailRef} placeholder="Email"/>
        <input type="text" ref={firstNameRef} placeholder="First name"/>
        <input type="text" ref={lastNameRef} placeholder="Last name"/>
        <input type="tel" ref={phoneNumberRef} placeholder="Phone number"/>
        <input type="password" ref={passwordRef} placeholder="Password"/>

        <button type="button" onClick={handleSubmit}>Register</button>
      </div>

      <Link to="/login">
        <p>Already have a user? Click here!</p>
      </Link>
    </>
  );
}