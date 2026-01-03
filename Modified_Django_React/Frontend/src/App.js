import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Book from "./pages/Book";
import BookCar from "./pages/BookCar";
import BookBike from "./pages/BookBike";
import Checkout from "./pages/Checkout";
import PayPenalty from "./pages/PayPenalty";
import ParkingStatus from "./pages/ParkingStatus";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import BookingSuccess from "./pages/BookingSuccess";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/car" element={<BookCar />} />
        <Route path="/book/bike" element={<BookBike />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pay_penalty" element={<PayPenalty />} />
        <Route path="/status" element={<ParkingStatus />} />
        <Route path="/admin_login" element={<AdminLogin />} />
        {/* ✅ Updated route to match navigate */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/success" element={<BookingSuccess />} />
        <Route path="/checkout_success" element={<CheckoutSuccess message="Checkout successful!" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
