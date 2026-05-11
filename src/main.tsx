import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import App from "./App.tsx";
import emailjs from "@emailjs/browser"

const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

if (!emailJsPublicKey) {
  console.warn("EmailJS public key is not defined. Email functionality may not work properly.");
} else {
  emailjs.init(emailJsPublicKey);
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
