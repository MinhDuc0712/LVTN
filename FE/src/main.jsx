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

import User from './pages/user/profile/Account.jsx'
import Post from './pages/user/profile/Post.jsx'
import Posts from './pages/user/profile/Posts.jsx'
import PaymentPost from './pages/user/profile/PaymentPost.jsx'
import RoomDetail from './pages/user/Room/RoomDetail.jsx'
import TopUp from './pages/user/profile/NapTien/Top-up.jsx'
import Momo from './pages/user/profile/NapTien/Momo.jsx'
import QR from './pages/user/profile/NapTien/QR.jsx'
import HistoryTopUp from './pages/user/profile/NapTien/history/Top-up.jsx'
import HistoryPayment from './pages/user/profile/NapTien/history/Payment.jsx'

import Admin from './pages/admin/SidebarWithNavbar.jsx'
import Category from './pages/admin/Category.jsx'
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Header />
    <main className="bg-orange-50 min-h-screen">
      <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/dang-nhap" element={<Login />} />
      <Route path="/dang-ky-tai-khoan" element={<Register />} />

      <Route path="/user" element={<User />} />
        <Route path="/post" element={<Post />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/post/paymentpost" element={<PaymentPost />} />
        <Route path="/room/:id" element={<RoomDetail />} />
        <Route path="/top-up" element={<TopUp />} />
        <Route path="/top-up/momo" element={<Momo />} />
        <Route path="/top-up/QR" element={<QR />} />
        <Route path="/history/top-up" element={<HistoryTopUp />} />
        <Route path="/history/payment" element={<HistoryPayment />} />


        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/category" element={<Category />} />
    </Routes>
    </main>
    <Footer />
  </BrowserRouter>
);
