import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UnregisteredUserProvider } from "./context/UnregisteredUserContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import EventPage from "./pages/EventPage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import RegisterUserPage from "./pages/RegisterUserPage";
import SearchPage from "./pages/SearchPage";
import CategoryEventPage from "./pages/CategoryEventPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import PaymentPage from "./pages/PaymentPage";
import CartPage from "./pages/CartPage";
import SecretMailPage from "./pages/SecretMailPage";
import EditProfilePage from "./pages/EditProfilePage";


function App() {
  return (
    <BrowserRouter>

      <UnregisteredUserProvider>
        <Routes>
          <Route element={<Layout />}>
            {/* redirect "/" to "/home" */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="home" element={<HomePage />} />
            {/* Add more routes below later */}
            <Route path="events/search" element={<SearchPage />} />
            <Route path="events/category/:categoryName" element={<CategoryEventPage />} />
            <Route path="event/:eventId" element={<EventPage />} />
            <Route path="register" element={<RegisterUserPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="user-page" element={<UserPage />} />
            <Route path="edit-account" element={<EditProfilePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="about-us" element={<AboutPage />} />
            <Route path="checkout" element={<PaymentPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="mail-easter-egg-picture-abdegh67bbbbbegh" element={<SecretMailPage />} />
          </Route>
        </Routes>
      </UnregisteredUserProvider>
    </BrowserRouter>
  );
}
export default App;
