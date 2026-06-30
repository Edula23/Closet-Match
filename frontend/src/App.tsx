import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import HeroSection from "./components/Hero";
import SignupPage from "./components/SignUp";
import LoginPage from "./components/Login";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroSection/>} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/login" element={<LoginPage/>} />
      </Routes>
    </Router>
  );

}
export default App;