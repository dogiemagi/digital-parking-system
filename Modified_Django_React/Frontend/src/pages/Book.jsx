import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getSlots, bookSlot } from "../services/api";
import BackToHome from "../components/BackToHome";

function Book({ vehicleType }) {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleOwner, setVehicleOwner] = useState("");
  const [slotNumber, setSlotNumber] = useState("");
  const [inTime, setInTime] = useState("");
  const [outTime, setOutTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("PhonePe");
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch available slots from backend
  useEffect(() => {
    const fetchSlots = async () => {
      const data = await getSlots(vehicleType); // Using api.js
      console.log("Slots fetched:", data);
      setSlots(data.slots || []);
    };
    fetchSlots();
  }, [vehicleType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      vehicle_number: vehicleNumber,
      vehicle_owner: vehicleOwner,
      slot_number: parseInt(slotNumber),
      in_time: inTime,
      out_time: outTime,
      payment_method: paymentMethod,
      rate_per_hour: vehicleType === "Car" ? 20 : 15,
    };

    const data = await bookSlot(payload);
    if (data.success) setMessage("Slot booked successfully!");
    else setMessage(data.message || "Booking failed.");
  };

  return (
    <Layout>
      <div className="container">
        <h2>Book a Parking Slot for {vehicleType}</h2>
        {message && <div style={{ color: "red" }}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="vehicle_number">Vehicle Number:</label>
          <input
            type="text"
            id="vehicle_number"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
            required
          />

          <label htmlFor="vehicle_owner">Owner Name:</label>
          <input
            type="text"
            id="vehicle_owner"
            value={vehicleOwner}
            onChange={(e) => setVehicleOwner(e.target.value)}
            required
          />

          <label htmlFor="slot_number">Select Slot:</label>
          <select
            id="slot_number"
            value={slotNumber}
            onChange={(e) => setSlotNumber(e.target.value)}
            required
          >
            <option value="">Select Slot</option>
            {slots.map((slot) => (
              <option key={slot} value={slot}>
                Slot {slot}
              </option>
            ))}
          </select>

          <label htmlFor="in_time">In Time:</label>
          <input
            type="datetime-local"
            id="in_time"
            value={inTime}
            onChange={(e) => setInTime(e.target.value)}
            required
          />

          <label htmlFor="out_time">Out Time:</label>
          <input
            type="datetime-local"
            id="out_time"
            value={outTime}
            onChange={(e) => setOutTime(e.target.value)}
            required
          />

          <label htmlFor="payment_method">Payment Method:</label>
          <select
            id="payment_method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value="PhonePe">PhonePe</option>
            <option value="GPay">GPay</option>
          </select>

          <button type="submit">Book Slot</button>
        </form>
        <BackToHome />
      </div>
      
    </Layout>
  );
}

export default Book;
