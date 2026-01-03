import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function Home() {
  const [message, setMessage] = useState(""); // For alert messages
  const navigate = useNavigate();

  // Navigate to booking page dynamically based on vehicle type
  const handleVehicleSelect = (type) => {
    navigate(`/book/${type.toLowerCase()}`); // Redirect to /book/car or /book/bike
  };

  // Navigate to checkout page
  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <Layout>
      <div className="container">
        <h1 style={{ color: "rgb(243, 236, 236)" }}>
          Welcome to Vehicle Parking System
        </h1>

        {/* Alert message */}
        {message && (
          <div className="alert alert-warning">
            <strong>{message}</strong>
          </div>
        )}

        {/* Box for selecting vehicle type */}
        <div className="box">
          <h2 style={{ color: "rgb(243, 233, 233)" }}>
            Select Vehicle Type
          </h2>
          <div className="form-group">
            <div>
              <button
                onClick={() => handleVehicleSelect("Car")}
                style={{ marginRight: "10px" }}
              >
                Car
              </button>
              <button onClick={() => handleVehicleSelect("Bike")}>Bike</button>
            </div>
          </div>
        </div>

        {/* Box for checkout */}
        <div className="box1">
          <h2 style={{ color: "rgb(240, 228, 228)" }}>
            Checkout Vehicle
          </h2>
          <button onClick={handleCheckout}>Checkout Details</button>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
