import { Routes, Route } from "react-router-dom";
import Home from "./pages/user/Home";
import Login from "./layout/Auth/Login";
import Register from "./layout/Auth/Register";
import User from "./pages/user/profile/Account";
import Post from "./pages/user/profile/Post";
import Posts from "./pages/user/profile/Posts";
import PaymentPost from "./pages/user/profile/PaymentPost";
import RoomDetail from "./pages/user/Room/RoomDetail";
import TopUp from "./pages/user/profile/NapTien/Top-up";
import Momo from "./pages/user/profile/NapTien/Momo";
import QR from "./pages/user/profile/NapTien/QR";
import HistoryTopUp from "./pages/user/profile/NapTien/history/Top-up";
import HistoryPayment from "./pages/user/profile/NapTien/history/Payment";
import Admin from "./pages/admin/SidebarWithNavbar";
import Category from "./pages/admin/Category";
import Utilities from "./pages/admin/Utilities";
import Top_up from "./pages/admin/top_up";
import Users from "./pages/admin/Users";
import ChangePassword from "./pages/user/profile/ChangePassword";
import Dashboard from "./pages/admin/Dashborad";
import SavedListings from "./pages/user/SavedListing/SavedListing";
import GoongMap from "./pages/map"; // Assuming this is a test page

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dang-nhap" element={<Login />} />
      <Route path="/dang-ky-tai-khoan" element={<Register />} />
      <Route path="/user" element={<User />} />
      <Route path="/change_password" element={<ChangePassword />}/>
      <Route path="/post" element={<Post />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/post/paymentpost" element={<PaymentPost />} />
      <Route path="/room/:id" element={<RoomDetail />} />
      <Route path="/top-up" element={<TopUp />} />
      <Route path="/top-up/momo" element={<Momo />} />
      <Route path="/top-up/QR" element={<QR />} />
      <Route path="/savedList" element={<SavedListings />} />
      <Route path="/history/top-up" element={<HistoryTopUp />} />
      <Route path="/history/payment" element={<HistoryPayment />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/category" element={<Category />} />
      <Route path="/admin/Utilities" element={<Utilities />} />
      <Route path="/admin/top_up" element={<Top_up />} />
      <Route path="/admin/users" element={<Users />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/test" element={<GoongMap />} />
    </Routes>
  );
};

export default AppRoutes;
