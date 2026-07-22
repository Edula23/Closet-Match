import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeroSection from "./pages/Hero";
// import SignupPage from "./pages/SignUp";
// import LoginPage from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Closet from "./pages/Closet";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/closet" element={<Closet/>} />
      </Routes>
    </Router>
  );
}
export default App;