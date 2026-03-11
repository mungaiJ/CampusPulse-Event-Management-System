import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import MyEventsPage from "./pages/MyEventsPage";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css"

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/my-events" element={<MyEventsPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;