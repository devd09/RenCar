import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

const HostDashboard = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }
        const res = await axios.get("http://localhost:5000/api/host/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch {
        navigate("/");
      }
    };
    fetchData();
  }, [navigate]);

  // Delete car handler
  const handleDelete = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/cars/${carId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update state locally after deletion
      setData((prev) => {
        const deletedCar = prev.cars.find((c) => c._id === carId);
        return {
          ...prev,
          cars: prev.cars.filter((c) => c._id !== carId),
          stats: {
            totalCars: prev.stats.totalCars - 1,
            bookedCars: deletedCar.available
              ? prev.stats.bookedCars
              : prev.stats.bookedCars - 1,
            availableCars: deletedCar.available
              ? prev.stats.availableCars - 1
              : prev.stats.availableCars,
          },
        };
      });
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Failed to delete car. Please try again.");
    }
  };

  if (!data) return <div>Loading...</div>;

  const { stats, cars } = data;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Host Dashboard</h1>
        <div>
          <button
            onClick={() => navigate("/host/add-car")}
            className="add-car-btn"
          >
            + Add Car
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Cars</h3>
          <p>{stats.totalCars}</p>
        </div>
        <div className="stat-card">
          <h3>Booked Cars</h3>
          <p>{stats.bookedCars}</p>
        </div>
        <div className="stat-card">
          <h3>Available Cars</h3>
          <p>{stats.availableCars}</p>
        </div>
      </div>

      <div className="cars-grid">
        {cars.length === 0 ? (
          <p style={{ textAlign: "center", gridColumn: "1 / -1" }}>
            No cars added yet. Click <b>“+ Add Car”</b> to add one.
          </p>
        ) : (
          cars.map((car) => (
            <div key={car._id} className="car-card">
              <img
                src={`http://localhost:5000/${car.image_path}`}
                alt={car.model}
              />

              <div className="car-card-content">
                <h4>
                  {car.brand} {car.model}
                </h4>
                <p>${car.price_per_day} / day</p>
                <p
                  className={`car-status ${
                    car.available ? "available" : "booked"
                  }`}
                >
                  {car.available ? "Available" : "Booked"}
                </p>
                {car.booked_by && (
                  <p className="text-sm text-gray-600 mt-1">
                    Booked by: {car.booked_by.username}
                  </p>
                )}
              </div>

              <button
                className="delete-btn"
                onClick={() => handleDelete(car._id)}
              >
                🗑 Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HostDashboard;
