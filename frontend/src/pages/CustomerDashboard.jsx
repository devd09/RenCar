import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch customer bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please log in first.");
          navigate("/");
          return;
        }
        const res = await axios.get("http://localhost:5000/api/bookings/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [navigate]);

  // Cancel booking handler
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/bookings/cancel/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );

      alert("Booking cancelled successfully!");
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Failed to cancel booking. Try again later.");
    }
  };

  if (loading) return <p>Loading your bookings...</p>;

  // Filter logic: show all active bookings + only latest 3 cancelled
  const visibleBookings = (() => {
    const cancelled = bookings
      .filter((b) => b.status === "cancelled")
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3);
    const active = bookings.filter((b) => b.status !== "cancelled");
    return [...active, ...cancelled];
  })();

  return (
    <div className="dashboard">

      {/* 🌐 Top Navbar */}
      <nav className="navbar">
        <h2 className="nav-title">RenCar</h2>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => navigate("/cars")}>
            Cars
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

      <div className="dashboard-content">
        <h1>My Bookings</h1>

        <div className="cars-grid">
          {visibleBookings.length === 0 ? (
            <p>No bookings yet. Click <b>“Cars”</b> to book one!</p>
          ) : (
            visibleBookings.map((booking) => {
              const car = booking.car_id;
              return (
                <div key={booking._id} className="car-card">
                  {car?.image_path && (
                    <img
                      src={`http://localhost:5000/${car.image_path}`}
                      alt={car.model}
                    />
                  )}

                  <h4>
                    {car?.brand} {car?.model}
                  </h4>
                  <p>{car?.location}</p>
                  <p>
                    <strong>From:</strong>{" "}
                    {new Date(booking.start_date).toLocaleDateString()}
                    <br />
                    <strong>To:</strong>{" "}
                    {new Date(booking.end_date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Total Price:</strong> ₹{booking.total_price}
                  </p>

                  <p className="car-status">
                    Status:{" "}
                    <span
                      className={
                        booking.status === "booked" ? "available" : "booked"
                      }
                    >
                      {booking.status}
                    </span>
                  </p>

                  {booking.status === "booked" && (
                    <button
                      className="delete-btn"
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
