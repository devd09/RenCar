import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [formData, setFormData] = useState({ start_date: "", end_date: "" });
  const [showForm, setShowForm] = useState(false);
  const [showTnc, setShowTnc] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  // Fetch cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cars");
        setCars(res.data);
      } catch (err) {
        console.error("Error fetching cars:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // When user clicks "Book Now"
  const handleBookClick = (car) => {
    setSelectedCar(car);
    setShowForm(true);
    setFormData({ start_date: "", end_date: "" });
    setTotalPrice(0);
  };

  // Auto calculate total price
  useEffect(() => {
    if (formData.start_date && formData.end_date && selectedCar) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setTotalPrice(days > 0 ? days * selectedCar.price_per_day : 0);
    }
  }, [formData, selectedCar]);

  // Step 1: Show T&C popup first
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.start_date || !formData.end_date) {
      alert("Please select both start and end dates.");
      return;
    }
    setShowTnc(true);
  };

  // Step 2: Confirm booking after agreeing to T&C
  const handleConfirmBooking = () => {
    setShowTnc(false);

    // Save booking details temporarily in localStorage
    localStorage.setItem(
      "pendingBooking",
      JSON.stringify({
        carId: selectedCar._id,
        carInfo: selectedCar,
        start_date: formData.start_date,
        end_date: formData.end_date,
        totalPrice,
      })
    );

    navigate("/payment");
  };

  if (loading) return <p>Loading cars...</p>;

  return (
    <div className="dashboard">

      {/* 🌐 Top Navbar */}
      <nav className="navbar">
        <h2 className="nav-title">RenCar</h2>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => navigate("/customer/dashboard")}>
            Dashboard
          </button>
          <button className="nav-btn" onClick={() => navigate("/contact")}>
            Contact Us
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

      {/* Main Car List */}
      <div className="dashboard-content">
        <h1>Available Cars</h1>

        <div className="cars-grid">
          {cars.length === 0 ? (
            <p>No cars available.</p>
          ) : (
            cars.map((car) => (
              <div key={car._id} className="car-card">
                <img src={`http://localhost:5000/${car.image_path}`} alt={car.model} />
                <h4>
                  {car.brand} {car.model}
                </h4>
                <p>₹{car.price_per_day} / day</p>
                <p>{car.location}</p>
                <p
                  className={`car-status ${car.available ? "available" : "booked"}`}
                >
                  {car.available ? "Available" : "Booked"}
                </p>
                {car.available && (
                  <button
                    className="add-car-btn"
                    onClick={() => handleBookClick(car)}
                  >
                    Book Now
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Booking Form Modal */}
      {showForm && selectedCar && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>
              Book {selectedCar.brand} {selectedCar.model}
            </h2>
            <form onSubmit={handleFormSubmit} className="booking-form">
              <label>Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                required
              />
              <label>End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                required
              />
              {totalPrice > 0 && (
                <p className="total-price">
                  Total Price: <strong>₹{totalPrice}</strong>
                </p>
              )}
              <div className="form-actions">
                <button type="submit" className="add-car-btn">
                  Confirm Booking
                </button>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Terms & Conditions Popup */}
      {showTnc && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Terms & Conditions</h2>
            <div
              style={{
                maxHeight: "250px",
                overflowY: "auto",
                textAlign: "left",
                marginBottom: "1rem",
                fontSize: "0.95rem",
                color: "#555",
              }}
            >
              <p>1. The renter must provide a valid driving license at pickup.</p>
              <p>2. Fuel costs, tolls, and fines are not included in the rental price.</p>
              <p>3. The car must be returned in the same condition as delivered.</p>
              <p>4. Late returns will incur additional charges per hour.</p>
              <p>5. Any damage to the car will be charged to the renter.</p>
              <p>6. The host reserves the right to cancel the booking in unforeseen situations.</p>
            </div>
            <div className="form-actions">
              <button className="add-car-btn" onClick={handleConfirmBooking}>
                I Agree & Proceed to Payment
              </button>
              <button
                className="delete-btn"
                onClick={() => setShowTnc(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarList;
