import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-box">
        <h1>Welcome to RenCar 🚗</h1>
        <p>Rent and host cars easily — anywhere in India.</p>

        <div className="home-buttons">
          <button
            className="role-btn host-btn"
            onClick={() => navigate("/host/login")}
          >
            Continue as Host
          </button>

          <button
            className="role-btn customer-btn"
            onClick={() => navigate("/customer/login")}
          >
            Continue as Customer
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
