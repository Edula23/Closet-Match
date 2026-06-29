import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import HeroSection from "./components/Hero";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroSection/>} />
      </Routes>
    </Router>
  );

}
export default App;