import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import HomePage from "./pages/HomePage";
import Courses from "./pages/Courses";
import Meetings from "./pages/Meetings";
import Footer from "./components/Footer";

import "./App.css";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
