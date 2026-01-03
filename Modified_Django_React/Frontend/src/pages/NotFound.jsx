import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/style.css"; // your existing CSS

function NotFound() {
  return (
    <Layout>
      <div className="container success-page">
        <h1>Vehicle Not Found</h1>
        <Link to="/" className="btn">
          Back to Home
        </Link>
      </div>
    </Layout>
  );
}

export default NotFound;
