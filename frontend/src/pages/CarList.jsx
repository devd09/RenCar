import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    brand: "",
    category: "",
    transmission: "",
    location: "",
    maxPrice: "",
    seats: "",
    sortPrice: ""
  });

  const [allCategories, setAllCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cars");
        setCars(res.data);
        setFilteredCars(res.data);

        const categories = [...new Set(res.data.map((car) => car.category.toLowerCase()))];
        setAllCategories(categories);
      } catch (err) {
        console.error("Error fetching cars:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // Filtering logic
  useEffect(() => {
    let updated = [...cars];

    if (filters.brand) {
      updated = updated.filter((car) =>
        car.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    if (filters.category) {
      updated = updated.filter((car) => car.category === filters.category);
    }

    if (filters.transmission) {
      updated = updated.filter((car) => car.transmission === filters.transmission);
    }

    if (filters.location) {
      updated = updated.filter((car) =>
        car.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.maxPrice) {
      updated = updated.filter(
        (car) => car.price_per_day <= Number(filters.maxPrice)
      );
    }

    if (filters.seats) {
      updated = updated.filter((car) => {
        if (filters.seats === "8+") return car.seats >= 8;
        return car.seats === Number(filters.seats);
      });
    }

    // Sorting logic
    if (filters.sortPrice === "low") {
      updated.sort((a, b) => a.price_per_day - b.price_per_day);
    } else if (filters.sortPrice === "high") {
      updated.sort((a, b) => b.price_per_day - a.price_per_day);
    }

    setFilteredCars(updated);
  }, [filters, cars]);

  if (loading) return <p>Loading cars...</p>;

  return (
    <div className="dashboard">
      {/* NAVBAR */}
      <div className="navbar">
        <h2 className="nav-title">Available Cars</h2>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => navigate("/customer/dashboard")}>
            My Dashboard
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
      </div>

      {/* FILTER BOX */}
      <div className="filter-box">
        <input
          type="text"
          placeholder="Search Brand"
          onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
        />

        <select onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Types</option>
          {allCategories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat.toUpperCase()}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
        >
          <option value="">Transmission</option>
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
        </select>

        <input
          type="text"
          placeholder="Location"
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />

        <input
          type="number"
          placeholder="Max Price (₹)"
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />

        {/* Seats Filter */}
        <select onChange={(e) => setFilters({ ...filters, seats: e.target.value })}>
          <option value="">Seats</option>
          <option value="2">2 seats</option>
          <option value="4">4 seats</option>
          <option value="5">5 seats</option>
          <option value="7">7 seats</option>
          <option value="8+">8+ seats</option>
        </select>

        {/* Price Sorting */}
        <select onChange={(e) => setFilters({ ...filters, sortPrice: e.target.value })}>
          <option value="">Sort by Price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>
      </div>

      {/* CAR GRID */}
      <div className="cars-grid">
        {filteredCars.length === 0 ? (
          <p>No cars match the selected filters.</p>
        ) : (
          filteredCars.map((car) => (
            <div key={car._id} className="car-card">
              <img src={`http://localhost:5000/${car.image_path}`} alt={car.model} />

              <h4>
                {car.brand} {car.model}
              </h4>
              <p>₹{car.price_per_day} / day</p>
              <p>{car.location}</p>
              <p>{car.seats} seats</p>

              <p className={`car-status ${car.available ? "available" : "booked"}`}>
                {car.available ? "Available" : "Booked"}
              </p>

              {car.available && (
                <button
                  className="add-car-btn"
                  onClick={() => navigate(`/cars/book/${car._id}`)}
                >
                  Book Now
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CarList;
