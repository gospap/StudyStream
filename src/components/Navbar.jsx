// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h1>StudyStream</h1>
      <div className="pages">
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/meetings">Meetings</Link>
        <Link to="/auth">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
