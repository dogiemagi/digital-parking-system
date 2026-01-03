import React from "react";
import Layout from "../components/Layout";
import "../styles/style.css";

function ParkingStatus({ slots }) {
  return (
    <Layout>
      <div className="container">
        <h1>Parking Slots Status</h1>
        <table border="1">
          <thead>
            <tr>
              <th>Slot Number</th>
              <th>Vehicle Type</th>
              <th>Vehicle Number</th>
              <th>Vehicle Owner</th>
              <th>In Time</th>
              <th>Out Time</th>
              <th>Payment Status</th>
              <th>Amount Paid</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, index) => (
              <tr key={index}>
                <td>{slot[0]}</td>
                <td>{slot[1]}</td>
                <td>{slot[2] || "N/A"}</td>
                <td>{slot[3] || "N/A"}</td>
                <td>{slot[4] || "N/A"}</td>
                <td>{slot[5] || "N/A"}</td>
                <td>{slot[6] || "Not Paid"}</td>
                <td>{slot[7] || "0"}</td>
                <td style={{ color: slot[8] === 0 ? "green" : "red" }}>
                  {slot[8] === 0 ? "Available" : "Occupied"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <a href="/" className="btn">Back to Home</a>
      </div>
    </Layout>
  );
}

export default ParkingStatus;
