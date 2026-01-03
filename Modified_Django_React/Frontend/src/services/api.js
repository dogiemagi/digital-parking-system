const API_URL = "http://127.0.0.1:5000/api"; // Flask backend URL

// Fetch available slots for vehicle type
export const getSlots = async (vehicleType) => {
  try {
    const response = await fetch(`${API_URL}/slots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicle_type: vehicleType }),
    });
    return await response.json(); // { slots: [1,2,...] }
  } catch (error) {
    console.error("Error fetching slots:", error);
    return { slots: [] };
  }
};

// Book a slot
export const bookSlot = async (bookingData) => {
  try {
    const response = await fetch(`${API_URL}/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });
    return await response.json(); // { success: true/false, slot_number, amount_paid, message }
  } catch (error) {
    console.error("Error booking slot:", error);
    return { success: false };
  }
};

// Get parking status
export const getStatus = async () => {
  try {
    const response = await fetch(`${API_URL}/status`);
    return await response.json(); // { slots: [...] }
  } catch (error) {
    console.error("Error fetching status:", error);
    return { slots: [] };
  }
};

// Checkout vehicle
export const checkoutVehicle = async (vehicleNumber, vehicleOwner) => {
  try {
    const response = await fetch(`${API_URL}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicle_number: vehicleNumber, vehicle_owner: vehicleOwner }),
    });
    return await response.json(); // { success, message, penalty }
  } catch (error) {
    console.error("Error during checkout:", error);
    return { success: false };
  }
};

// Pay penalty
export const payPenalty = async (vehicleNumber, penaltyAmount) => {
  try {
    const response = await fetch(`${API_URL}/pay_penalty`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicle_number: vehicleNumber, penalty_amount: penaltyAmount }),
    });
    return await response.json(); // { success: true/false, message }
  } catch (error) {
    console.error("Error paying penalty:", error);
    return { success: false };
  }
};

// Admin login
export const adminLogin = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/admin_login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return await response.json(); // { success, message }
  } catch (error) {
    console.error("Error during admin login:", error);
    return { success: false };
  }
};

// Get admin dashboard
export const getAdminDashboard = async () => {
  try {
    const response = await fetch(`${API_URL}/admin`);
    return await response.json(); // { slots: [...] }
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    return { slots: [] };
  }
};
