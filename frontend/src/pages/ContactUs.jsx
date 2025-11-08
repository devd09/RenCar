import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Normally, you'd send data to backend (e.g., /api/contact)
      // await axios.post("http://localhost:5000/api/contact", form);
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Error submitting contact form:", err);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="dashboard">

      {/* 🌐 Top Navbar */}
      <nav className="navbar">
        <h2 className="nav-title">RenCar</h2>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => navigate("/customer/dashboard")}>
            Dashboard
          </button>
          <button className="nav-btn" onClick={() => navigate("/cars")}>
            Cars
          </button>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* 📨 Contact Form */}
      <div className="add-car-container">
        <h1>Contact Us</h1>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="add-car-form">
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <textarea
              rows="4"
              placeholder="Your Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
            <button type="submit" className="add-car-btn">
              Send Message
            </button>
          </form>
        ) : (
          <p className="add-car-message success">
            ✅ Thank you for contacting us! We'll get back to you soon.
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
