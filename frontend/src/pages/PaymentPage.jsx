import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

const PaymentPage = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("upi");
  const [paymentData, setPaymentData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("pendingBooking");
    if (!data) {
      navigate("/cars");
      return;
    }
    setBooking(JSON.parse(data));
  }, [navigate]);

  const handleInputChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (method === "upi" && !paymentData.upiId) return "Please enter your UPI ID.";
    if (method === "debit" || method === "credit") {
      if (!paymentData.cardNumber || paymentData.cardNumber.length !== 16)
        return "Enter a valid 16-digit card number.";
      if (!paymentData.expiry) return "Enter card expiry date.";
      if (!paymentData.cvv || paymentData.cvv.length !== 3)
        return "Enter a valid 3-digit CVV.";
      if (!paymentData.name) return "Enter cardholder name.";
    }
    return null;
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first.");
        navigate("/");
        return;
      }

      // Mock payment process
      setTimeout(async () => {
        alert(`✅ Payment successful via ${method.toUpperCase()}!`);

        await axios.post(
          `http://localhost:5000/api/bookings/${booking.carId}`,
          {
            start_date: booking.start_date,
            end_date: booking.end_date,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        localStorage.removeItem("pendingBooking");
        navigate("/customer/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return <p>Loading...</p>;
  const { carInfo, start_date, end_date, totalPrice } = booking;

  return (
    <div className="payment-container">
      <h1>Complete Your Payment</h1>

      <div className="payment-summary">
        <img
          src={`http://localhost:5000/${carInfo.image_path}`}
          alt={carInfo.model}
          className="payment-car-img"
        />
        <h2>
          {carInfo.brand} {carInfo.model}
        </h2>
        <p>
          <b>Duration:</b> {start_date} → {end_date}
        </p>
        <p>
          <b>Total Amount:</b> ₹{totalPrice}
        </p>
      </div>

      <form className="payment-form" onSubmit={handlePayment}>
        <h3>Select Payment Method</h3>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="payment-method-select"
        >
          <option value="upi">UPI</option>
          <option value="debit">Debit Card</option>
          <option value="credit">Credit Card</option>
        </select>

        {method === "upi" && (
          <div className="payment-method-section">
            <label>UPI ID</label>
            <input
              type="text"
              name="upiId"
              placeholder="e.g. username@upi"
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        {(method === "debit" || method === "credit") && (
          <div className="payment-method-section">
            <label>Card Number</label>
            <input
              type="text"
              name="cardNumber"
              maxLength="16"
              placeholder="1234 5678 9012 3456"
              onChange={handleInputChange}
              required
            />
            <div className="card-details">
              <div>
                <label>Expiry Date</label>
                <input
                  type="month"
                  name="expiry"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>CVV</label>
                <input
                  type="password"
                  name="cvv"
                  maxLength="3"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <label>Cardholder Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name on Card"
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        <button type="submit" className="add-car-btn" disabled={loading}>
          {loading ? "Processing Payment..." : `Pay ₹${totalPrice}`}
        </button>
        <button
          type="button"
          className="delete-btn"
          style={{ marginTop: "10px" }}
          onClick={() => navigate("/cars")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
