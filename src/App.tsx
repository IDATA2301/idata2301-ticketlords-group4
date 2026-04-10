import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import EventPage from "./pages/EventPage";


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
          </Route>
        </Routes>
      </BrowserRouter>
  );
}
export default App;
