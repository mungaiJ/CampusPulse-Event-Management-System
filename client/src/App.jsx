import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventsPage from "./pages/EventsPage";
import MyEventsPage from "./pages/MyEventsPage";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import EventDetailsPage from "./pages/EventDetailsPage";   // ✅ import details page
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      {/* ✅ Navbar always visible */}
      <Navbar />

      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/my-events" element={<MyEventsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* ✅ Event details route */}
        <Route path="/events/:id" element={<EventDetailsPage />} />

        {/* ✅ Admin route protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
