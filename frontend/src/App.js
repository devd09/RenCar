import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HostLogin from "./pages/HostLogin";
import HostRegister from "./pages/HostRegister";
import HostDashboard from "./pages/HostDashboard";
import AddCar from "./pages/AddCar";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HostLogin />} />
        <Route path="/register" element={<HostRegister />} />
        <Route path="/host/dashboard" element={<HostDashboard />} />
        <Route path="/host/add-car" element={<AddCar />} />

      </Routes>
    </Router>
  );
}

export default App;
