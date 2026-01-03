import React from "react";
import Layout from "../components/Layout";
import "../styles/style.css";
import BackToHome from "../components/BackToHome";

function PayPenalty({ vehicleNumber, penaltyAmount, penaltyTime, onPay }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (onPay) {
      onPay({ vehicleNumber, penaltyAmount });
    }
  };

  return (
    <Layout>
      <div className="container">
        <h1>Pay Penalty</h1>
        <p>
          You have a penalty of ₹{penaltyAmount} for {penaltyTime.toFixed(2)}{" "}
          hours over time.
        </p>

        <form onSubmit={handleSubmit}>
          <input type="hidden" name="vehicle_number" value={vehicleNumber} />
          <input type="hidden" name="penalty_amount" value={penaltyAmount} />
          <button type="submit">Pay Penalty</button>
        </form>
        <BackToHome />
      </div>
    </Layout>
  );
}

export default PayPenalty;
