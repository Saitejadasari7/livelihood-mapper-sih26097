import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/voice" element={<ComingSoon title="Voice Assistant" phase="Phase 5" description="Speak or type to build your profile. Coming soon." />} />
          <Route path="/livelihood" element={<ComingSoon title="Livelihood Mapping" phase="Phase 6" description="Matching work options will appear here." />} />
          <Route path="/skill-gap" element={<ComingSoon title="Skill Gap Analysis" phase="Phase 8" description="Existing and missing skills will appear here." />} />
          <Route path="/training" element={<ComingSoon title="Training Opportunities" phase="Phase 7" description="Training and NSQF information will appear here." />} />
          <Route path="*" element={<ComingSoon title="Page not found" phase="n/a" description="This page does not exist." />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}