import React from "react";
import Layout from "../components/Layout";
import "../styles/style.css";

function BookingSuccess({ slotNumber, amountPaid }) {
  return (
    <Layout>
      <div className="container">
        <h1 style={{ color: "white" }}>Booking Successful!</h1>
        <p style={{ color: "white" }}>
          Your parking slot has been successfully booked.
        </p>
        <div className="details">
          <p>
            <strong>Slot Number:</strong> {slotNumber}
          </p>
          <p>
            <strong>Total Amount Paid:</strong> Rs. {amountPaid}
          </p>
        </div>
        <a href="/" className="btn">
          Back to Home
        </a>
      </div>
    </Layout>
  );
}

export default BookingSuccess;
