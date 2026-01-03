import React from "react";
import Layout from "../components/Layout";
import "../styles/style.css";

function CheckoutSuccess({ message }) {
  return (
    <Layout>
      <div className="container success-page">
        <h1 className="success-message">{message}</h1>
        <a href="/" className="btn">
          Back to Home
        </a>
      </div>
    </Layout>
  );
}

export default CheckoutSuccess;
