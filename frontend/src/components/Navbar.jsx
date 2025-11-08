import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/global.css";

const Navbar = () => {
const navigate = useNavigate();
const [role, setRole] = useState(null);
const [menuOpen, setMenuOpen] = useState(false);

useEffect(() => {
    // Detect role from stored token payload or localStorage
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
}, []);

const handleLogout = () => {
    localStorage.clear();
    navigate("/");
};

const toggleMenu = () => setMenuOpen(!menuOpen);

return (
    <nav className="navbar">
    <div className="nav-left" onClick={() => navigate("/")}>
        <h2 className="nav-logo">RenCar</h2>
    </div>

    <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        {role === "host" ? (
        <>
            <Link to="/host/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/host/add-car" onClick={() => setMenuOpen(false)}>Add Car</Link>
            <Link to="/host/bookings" onClick={() => setMenuOpen(false)}>Bookings</Link>
        </>
        ) : role === "user" ? (
        <>
            <Link to="/cars" onClick={() => setMenuOpen(false)}>Cars</Link>
            <Link to="/customer/dashboard" onClick={() => setMenuOpen(false)}>My Bookings</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link>
        </>
        ) : (
        <>
            <Link to="/" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
        </>
        )}
    </div>

    <div className="nav-right">
        {role && (
        <button className="logout-btn" onClick={handleLogout}>
            Logout
        </button>
        )}

        <div className="menu-toggle" onClick={toggleMenu}>
        ☰
        </div>
    </div>
    </nav>
);
};

export default Navbar;
