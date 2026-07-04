import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeroSection from "./pages/Hero";
import SignupPage from "./pages/SignUp";
import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Closet from "./pages/Closet";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/closet" element={<ProtectedRoute><Closet /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
export default App;