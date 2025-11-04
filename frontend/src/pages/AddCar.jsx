import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

const AddCar = () => {
  const navigate = useNavigate();
  const [carData, setCarData] = useState({
    brand: "",
    model: "",
    year: "",
    color: "",
    license_plate: "",
    price_per_day: "",
    category: "",
    seats: "",
    transmission: "",
    fuel_type: "",
    location: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setCarData({ ...carData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized. Please log in again.");
        navigate("/");
        return;
      }

      const formData = new FormData();
      Object.entries(carData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (image) formData.append("image", image);

      await axios.post("http://localhost:5000/api/cars", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Car added successfully!");
      setTimeout(() => navigate("/host/dashboard"), 1500);
    } catch (error) {
      console.error("Error adding car:", error);
      setMessage("Failed to add car.");
    }
  };

  return (
    <div className="add-car-container">
      <button onClick={() => navigate("/host/dashboard")} className="back-btn">
        ← Back to Dashboard
      </button>

      <h1>Add New Car</h1>

      <form className="add-car-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={carData.brand}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={carData.model}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={carData.year}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="color"
          placeholder="Color"
          value={carData.color}
          onChange={handleChange}
        />
        <input
          type="text"
          name="license_plate"
          placeholder="License Plate"
          value={carData.license_plate}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price_per_day"
          placeholder="Price Per Day ($)"
          value={carData.price_per_day}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={carData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="sedan">Sedan</option>
          <option value="suv">SUV</option>
          <option value="hatchback">Hatchback</option>
          <option value="coupe">Coupe</option>
          <option value="convertible">Convertible</option>
          <option value="pickup">Pickup Truck</option>
          <option value="van">Van</option>
          <option value="luxury">Luxury</option>
          <option value="sports">Sports</option>
          <option value="electric">Electric</option>
        </select>

        <input
          type="number"
          name="seats"
          placeholder="Seats"
          value={carData.seats}
          onChange={handleChange}
        />
        <select
          name="transmission"
          value={carData.transmission}
          onChange={handleChange}
        >
          <option value="">Select Transmission</option>
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
        </select>
        <select
          name="fuel_type"
          value={carData.fuel_type}
          onChange={handleChange}
        >
          <option value="">Select Fuel Type</option>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="electric">Electric</option>
        </select>
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={carData.location}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Car Description"
          value={carData.description}
          onChange={handleChange}
          rows="3"
        />
        <input type="file" onChange={handleFileChange} accept="image/*" />

        <button type="submit">Add Car</button>

        {message && (
          <p
            className={`add-car-message ${
              message.includes("success") ? "success" : "error"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddCar;
