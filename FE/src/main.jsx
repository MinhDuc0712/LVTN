import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from './App.jsx'
import Header from "./components/Header.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./layout/Auth/Register.jsx";
import Login from "./layout/Auth/Login.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/user/Home.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Header />
    <main className="bg-orange-50 min-h-screen">
      <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/dang-nhap" element={<Login />} />
      <Route path="/dang-ky-tai-khoan" element={<Register />} />
    </Routes>
    </main>
    <Footer />
  </BrowserRouter>
);
