import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import VoiceAssistant from "./pages/VoiceAssistant.jsx";
import Livelihoods from "./pages/Livelihoods.jsx";
import Training from "./pages/Training.jsx";
import JobSearch from "./pages/JobSearch.jsx";
import AdminPortal from "./pages/AdminPortal.jsx";
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
          <Route path="/voice" element={<VoiceAssistant />} />
          <Route path="/livelihood" element={<Livelihoods />} />
          <Route path="/skill-gap" element={<Livelihoods />} />
          <Route path="/training" element={<Training />} />
          <Route path="/jobs" element={<JobSearch />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="*" element={<ComingSoon title="Page not found" phase="n/a" description="This page does not exist." />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}