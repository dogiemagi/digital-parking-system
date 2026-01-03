import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/back.css";

const BackToHome = () => {
  const navigate = useNavigate();

  return (
    <div style={{ marginTop: "20px" }}>
      <button 
        
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>
    </div>
  );
};

export default BackToHome;
