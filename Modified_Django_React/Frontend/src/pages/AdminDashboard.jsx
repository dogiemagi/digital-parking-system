import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/admin.css";

function AdminDashboard() {
  const [slots, setSlots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch admin slots only
    fetch("http://127.0.0.1:5000/api/admin")
      .then((res) => res.json())
      .then((data) => {
        console.log("ADMIN DATA:", data); // Check what comes from backend
        setSlots(data.slots || []);
      })
      .catch((err) => console.error("ADMIN ERROR:", err));
  }, []);

  return (
    <Layout>
      <div className="container">
        <h1>Parking Slots Status</h1>
        <table>
          <thead>
            <tr>
              <th>Slot No</th>
              <th>Vehicle Type</th>
              <th>Vehicle Number</th>
              <th>Owner</th>
              <th>In Time</th>
              <th>Out Time</th>
              <th>Payment</th>
              <th>Amount</th>
              <th>Penalty</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {slots.length > 0 ? (
              slots.map((slot, index) => (
                <tr key={index}>
                  <td>{slot.slot_number}</td>
                  <td>{slot.vehicle_type}</td>
                  <td>{slot.vehicle_number || "N/A"}</td>
                  <td>{slot.vehicle_owner || "N/A"}</td>
                  <td>{slot.in_time || "N/A"}</td>
                  <td>{slot.out_time || "N/A"}</td>
                  <td>{slot.payment_status || "Not Paid"}</td>
                  <td>₹{slot.amount_paid || 0}</td>
                  <td>₹{slot.penalty_amount || 0}</td>
                  <td style={{ color: slot.is_occupied ? "red" : "green", fontWeight: "bold" }}>
                    {slot.is_occupied ? "Occupied" : "Available"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    </Layout>
  );
}

export default AdminDashboard;
