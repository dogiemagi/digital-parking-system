import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getSlots, bookSlot } from "../services/api"; // make sure api.js path is correct
import "../styles/bookBike.css"; // reuse the same CSS
import BackToHome from "../components/BackToHome";

function BookCar() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleOwner, setVehicleOwner] = useState("");
  const [slotNumber, setSlotNumber] = useState("");
  const [inTime, setInTime] = useState("");
  const [outTime, setOutTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("PhonePe");
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const data = await getSlots("Car"); // POST /api/slots
        console.log("Car slots fetched:", data);
        setSlots(data.slots || []);
      } catch (err) {
        console.error("Error fetching car slots:", err);
      }
    };
    fetchSlots();
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!/^[A-Za-z\s]+$/.test(vehicleOwner)) {
      newErrors.vehicleOwner = "Please enter a valid owner name (alphabets only).";
    }

    if (!/^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/.test(vehicleNumber)) {
      newErrors.vehicleNumber = "This vehicle number is invalid.";
    }

    const inDate = new Date(inTime);
    const outDate = new Date(outTime);
    const minimumBookingTime = 60 * 60 * 1000;

    if (isNaN(inDate.getTime()) || isNaN(outDate.getTime())) {
      newErrors.time = "Please enter valid in and out times.";
    } else if (outDate <= inDate) {
      newErrors.time = "Out time must be greater than In time.";
    } else if (outDate - inDate < minimumBookingTime) {
      newErrors.time = "Booking should be at least 1 hour.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      vehicle_number: vehicleNumber,   // match backend keys
      vehicle_owner: vehicleOwner,
      slot_number: parseInt(slotNumber),
      in_time: inTime,
      out_time: outTime,
      payment_method: paymentMethod,
      rate_per_hour: 5, // Car rate
    };

    try {
      const data = await bookSlot(payload); // POST /api/book
      if (data.success) {
        setMessage(`Slot ${data.slot_number} booked successfully! Amount: ₹${data.amount_paid}`);
        setVehicleNumber("");
        setVehicleOwner("");
        setSlotNumber("");
        setInTime("");
        setOutTime("");
      } else {
        setMessage(data.message || "Booking failed.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="container">
        <h2 style={{ color: "white" }}>Book a Parking Slot for Car</h2>
        {message && <div style={{ color: "red", marginBottom: "10px" }}>{message}</div>}

        <div className="box">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Vehicle Number:</label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                placeholder="Enter vehicle number"
                required
              />
              {errors.vehicleNumber && <div className="error-message">{errors.vehicleNumber}</div>}
            </div>

            <div className="form-group">
              <label>Owner Name:</label>
              <input
                type="text"
                value={vehicleOwner}
                onChange={(e) => setVehicleOwner(e.target.value)}
                placeholder="Enter owner name"
                required
              />
              {errors.vehicleOwner && <div className="error-message">{errors.vehicleOwner}</div>}
            </div>

            <div className="form-group">
              <label>Select Slot:</label>
              <select
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
            </div>

            <div className="form-group">
              <label>In Time:</label>
              <input
                type="datetime-local"
                value={inTime}
                onChange={(e) => setInTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Out Time:</label>
              <input
                type="datetime-local"
                value={outTime}
                onChange={(e) => setOutTime(e.target.value)}
                required
              />
              {errors.time && <div className="error-message">{errors.time}</div>}
            </div>

            <div className="form-group">
              <label>Payment Method:</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              >
                <option value="PhonePe">PhonePe</option>
                <option value="GPay">GPay</option>
              </select>
            </div>

            <div className="form-group">
              <button type="submit">Book Slot</button>
            </div>
          </form>
        </div>
        <BackToHome />
      </div>
    </Layout>
  );
}

export default BookCar;
