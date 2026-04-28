import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import EventPage from "./pages/EventPage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import RegisterUserPage from "./pages/RegisterUserPage";


function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* redirect "/" to "/home" */}
            <Route path="/" element={<Navigate to ="/home" replace />} />
            <Route path="/home" element={<HomePage />} />

            {/* Add more routes here later */}
              <Route path="/events/:slug" element={<EventPage />} />
              <Route path="/registerUser" element={<RegisterUserPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/user" element={<UserPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}
export default App;
