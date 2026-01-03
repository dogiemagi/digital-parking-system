import React, { useState } from "react";
import Layout from "../components/Layout";
import "../styles/style.css";
import BackToHome from "../components/BackToHome";

function Checkout() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleOwner, setVehicleOwner] = useState("");
  const [message, setMessage] = useState("");
  const [penaltyAmount, setPenaltyAmount] = useState(null); // store penalty amount

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      vehicle_number: vehicleNumber,
      vehicle_owner: vehicleOwner,
    };

    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage("Checkout successful!");
          setVehicleNumber("");
          setVehicleOwner("");
          setPenaltyAmount(null);
        } else if (data.penalty) {
          setPenaltyAmount(data.penalty_amount);
          setMessage(
            `Vehicle overstayed! Penalty: ₹${data.penalty_amount.toFixed(
              2
            )} for ${data.penalty_time.toFixed(2)} hours. Please pay penalty.`
          );
        } else {
          setMessage(data.message || "Checkout failed.");
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("Server error. Please try again.");
      });
  };

  const handlePayPenalty = () => {
    fetch("/api/pay_penalty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicle_number: vehicleNumber,
        penalty_amount: penaltyAmount,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage("Penalty paid successfully! Checkout complete.");
          setVehicleNumber("");
          setVehicleOwner("");
          setPenaltyAmount(null);
        } else {
          setMessage(data.message || "Penalty payment failed.");
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("Server error. Please try again.");
      });
  };

  return (
    <Layout>
      <div className="container">
        <h1>Checkout Vehicle</h1>
        {message && (
          <div style={{ color: "red", marginBottom: "10px" }}>{message}</div>
        )}
        <div className="box">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="vehicle_number">Vehicle Number:</label>
              <input
                type="text"
                id="vehicle_number"
                className="input-field"
                value={vehicleNumber}
                onChange={(e) =>
                  setVehicleNumber(e.target.value.toUpperCase())
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="vehicle_owner">Owner Name:</label>
              <input
                type="text"
                id="vehicle_owner"
                className="input-field"
                value={vehicleOwner}
                onChange={(e) => setVehicleOwner(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <button type="submit">Check Out</button>
            </div>
          </form>

          {/* Render Pay Penalty button only if there is a penalty */}
          {penaltyAmount && (
            <div className="form-group">
              <button onClick={handlePayPenalty}>Pay Penalty ₹{penaltyAmount.toFixed(2)}</button>
            </div>
          )}
        </div>
        <BackToHome />
      </div>
    </Layout>
  );
}

export default Checkout;
