import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ===== Pages =====
import HomePage from "./pages/HomePage";
import HostLogin from "./pages/HostLogin";
import HostRegister from "./pages/HostRegister";
import HostDashboard from "./pages/HostDashboard";
import AddCar from "./pages/AddCar";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerRegister from "./pages/CustomerRegister";
import CustomerDashboard from "./pages/CustomerDashboard";
import CarList from "./pages/CarList";
import ContactUs from "./pages/ContactUs";
import PaymentPage from "./pages/PaymentPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* ===== Landing Page ===== */}
        <Route path="/" element={<HomePage />} />

        {/* ===== Host Routes ===== */}
        <Route path="/host/login" element={<HostLogin />} />
        <Route path="/host/register" element={<HostRegister />} />
        <Route path="/host/dashboard" element={<HostDashboard />} />
        <Route path="/host/add-car" element={<AddCar />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* ===== Customer Routes ===== */}
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/cars" element={<CarList />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </Router>
  );
}

export default App;
