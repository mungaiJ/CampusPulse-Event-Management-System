import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>

      <h2>CampusPulse</h2>

      <Link to="/">Events</Link>
      <Link to="/my-events">My Events</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/admin">Admin</Link>

    </nav>
  );
}

export default Navbar;