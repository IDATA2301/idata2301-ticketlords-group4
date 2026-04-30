import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
import CheckoutPage from "./pages/CheckoutPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* redirect "/" to "/home" */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="home" element={<HomePage />} />
          {/* Add more routes below later */}
          <Route path="events/search" element={<SearchPage />} />
          <Route path="events/category/:categoryName" element={<CategoryEventPage />} />
          <Route path="event/:slug" element={<EventPage />} />
          <Route path="registerUser" element={<RegisterUserPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="user" element={<UserPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="about-us" element={<AboutPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
