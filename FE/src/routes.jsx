import { Routes, Route } from "react-router-dom";
import Home from "./pages/user/Home";
import HousesByCategory from "./pages/user/HousesByCategory";
import RentHouse from "./pages/user/RentHouse";
import Login from "./layout/Auth/Login";
import Register from "./layout/Auth/Register";
import User from "./pages/user/profile/Account";
import Post from "./pages/user/profile/Post";
import Posts from "./pages/user/profile/Posts";
import ServicePrice from "./pages/user/profile/ServicePrice";
import PaymentPost from "./pages/user/profile/PaymentPost";
import RoomDetail from "./pages/user/Room/RoomDetail";
import TopUp from "./pages/user/profile/NapTien/Top-up";
import ZaloPay from "./pages/user/profile/NapTien/ZaloPay";
import QR from "./pages/user/profile/NapTien/QR";
import HistoryTopUp from "./pages/user/profile/NapTien/history/Top-up";
import HistoryPayment from "./pages/user/profile/NapTien/history/Payment";
import Admin from "./pages/admin/SidebarWithNavbar";
import Category from "./pages/admin/Category";
import Utilities from "./pages/admin/Utilities";
import Top_up from "./pages/admin/top_up";
import Users from "./pages/admin/Users";
// import Role from "./pages/admin/Role";
import ChangePassword from "./pages/user/profile/ChangePassword";
import Dashboard from "./pages/admin/Dashborad";
import SavedListings from "./pages/user/SavedListing/SavedListing";
import GoongMap from "./pages/map";
import PostModeration from "./pages/admin/Post";
import NotFound from "./pages/NotFound";
import RentalRoomDetail from "./pages/user/AdminRoom/RentalRoomDetail";
import BankingConfirm from "./pages/user/profile/NapTien/Confirm";
import QR_Post from "./pages/user/profile/QR_Post";
import HouseList from "./pages/user/AdminRoom/HouseList";
import Contract from "./pages/user/AdminRoom/Contract";
import ElectricityBill from "./pages/user/AdminRoom/Bill/ElectricityBill";
import RentBill from "./pages/user/AdminRoom/Bill/RentBill";
import WaterTicket from "./pages/user/AdminRoom/Bill/WaterTicket";
import Electricity from "./pages/user/AdminRoom/TransactionHistory/Electricity";
import Water from "./pages/user/AdminRoom/TransactionHistory/Water";
import Rent from "./pages/user/AdminRoom/TransactionHistory/Rent";
import ForgotPassword from "./layout/ForgotPass";
import Unpail from "./pages/user/AdminRoom/Payment/Unpail";
import AddRoom from "./pages/admin/Home/AddRoom";
import Room from "./pages/admin/Home/Rom";
import Contracts from "./pages/admin/Home/Contract";
import ContractAdd from "./pages/admin/Home/ContractAdd";
import Price from "./pages/admin/Home/Price";
import ElectricBill from "./pages/admin/Home/ElectricBill";
import AddElectric from "./pages/admin/Home/AddElectric";
import WaterBill from "./pages/admin/Home/WaterBill";
import AddWater from "./pages/admin/Home/AddWater";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Home />} />
      <Route path="/RentHouse" element={<RentHouse />} />
      <Route path="/category/:categoryId" element={<HousesByCategory />} />
      <Route path="/dang-nhap" element={<Login />} />
      <Route path="/dang-ky-tai-khoan" element={<Register />} />
      <Route path="/quen-mat-khau" element={<ForgotPassword />} />
      {/* <Route path="/user" element={<User />} /> */}
      {/* <Route path="/change_password" element={<ChangePassword />} /> */}
      {/* <Route path="/post" element={<Post />} /> */}
      {/* <Route path="/post/:id" element={<Post />} /> */}
      {/* <Route path="/posts" element={<Posts />} /> */}
      <Route path="/ServicePrice" element={<ServicePrice />} />
      {/* <Route path="/post/paymentpost" element={<PaymentPost />} /> */}
      <Route path="/room/:id" element={<RoomDetail />} />
      {/* <Route path="/top-up" element={<TopUp />} /> */}
      {/* <Route path="/top-up/ZaloPay" element={<ZaloPay />} /> */}
      {/* <Route path="/top-up/QR" element={<QR />} /> */}
      {/* <Route path="/banking-confirm" element={<BankingConfirm />} /> */}
      {/* <Route path="/Top-up-qr-post" element={<QR_Post />} /> */}
      <Route path="/savedList" element={<SavedListings />} />
      {/* <Route path="/history/top-up" element={<HistoryTopUp />} /> */}
      {/* <Route path="/history/payment" element={<HistoryPayment />} /> */}
      {/* <Route path="/admin" element={<Admin />} /> */}
      {/* <Route path="/admin/category" element={<Category />} /> */}
      {/* <Route path="/admin/Utilities" element={<Utilities />} /> */}
      {/* <Route path="/admin/top_up" element={<Top_up />} /> */}
      {/* <Route path="/admin/users" element={<Users />} /> */}
      {/* <Route path="/admin/role" element={<Role />} /> */}
      <Route path="/admin/Room/add" element={<AddRoom mode="add"/>} />
      <Route path="/admin/Room/edit/:id" element={<AddRoom mode="edit"/>} />
      <Route path="/admin/Room" element={<Room />} />
      <Route path="/admin/Contracts" element={<Contracts />} />
      <Route path="/admin/ContractAdd" element={<ContractAdd />} />
      <Route path="/admin/Price" element={<Price />} />
      <Route path="/admin/ElectricBill" element={<ElectricBill />} />
      <Route path="/admin/AddElectric" element={<AddElectric />} />
      <Route path="/admin/WaterBill" element={<WaterBill />} />
      <Route path="/admin/AddWater" element={<AddWater />} />

      {/* <Route path="/admin/" element={<Dashboard />} /> */}
      {/* <Route path="/admin/post" element={<PostModeration />} /> */}
      <Route
        path="/RentHouse/RentalRoomDetail"
        element={<RentalRoomDetail />}
      />
      <Route path="/HouseList" element={<HouseList />} />
      <Route path="/Contract" element={<Contract />} />
      <Route path="/ElectricityBill" element={<ElectricityBill />} />
      <Route path="/WaterTicket" element={<WaterTicket />} />
      <Route path="/RentBill" element={<RentBill />} />
      <Route path="/Electricity" element={<Electricity />} />
      <Route path="/Water" element={<Water />} />
      <Route path="/Rent" element={<Rent />} />
      <Route path="/Unpail" element={<Unpail />} />

      {/* Protected user routes (yêu cầu đăng nhập) */}
      <Route
        path="/user"
        element={
          <ProtectedRoute requireAuth={true}>
            <User />
          </ProtectedRoute>
        }
      />
      <Route
        path="/change_password"
        element={
          <ProtectedRoute requireAuth={true}>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      {/* Protected host routes (yêu cầu đăng nhập và quyền chủ tin đăng) */}
      <Route
        path="/post"
        element={
          <ProtectedRoute requireAuth={true} requireHost={true}>
            <Post />
          </ProtectedRoute>
        }
      />
      <Route
        path="/post/:id"
        element={
          <ProtectedRoute requireAuth={true} requireHost={true}>
            <Post />
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts"
        element={
          <ProtectedRoute requireAuth={true} requireHost={true}>
            <Posts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ServicePrice"
        element={
          <ProtectedRoute requireAuth={true} requireHost={true}>
            <ServicePrice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/post/paymentpost"
        element={
          <ProtectedRoute requireAuth={true} requireHost={true}>
            <PaymentPost />
          </ProtectedRoute>
        }
      />
      <Route
        path="/top-up"
        element={
          <ProtectedRoute requireAuth={true} requireHost={true}>
            <TopUp />
          </ProtectedRoute>
        }
      />
      <Route
        path="/top-up/ZaloPay"
        element={
          <ProtectedRoute requireAuth={true} requireHost={true}>
            <ZaloPay />
          </ProtectedRoute>
        }
      />
      <Route
        path="/top-up/QR"
        element={
          <ProtectedRoute requireAuth={true} requireHost={true}>
            <QR />
          </ProtectedRoute>
        }
      />
      <Route
        path="/banking-confirm"
        element={
          <ProtectedRoute requireAuth={true} requireHost={true}>
            <BankingConfirm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Top-up-qr-post"
        element={
          <ProtectedRoute requireAuth={true} requireHost={true}>
            <QR_Post />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history/top-up"
        element={
          <ProtectedRoute requireAuth={true} requireHost={true}>
            <HistoryTopUp />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history/payment"
        element={
          <ProtectedRoute requireAuth={true} requireHost={true}>
            <HistoryPayment />
          </ProtectedRoute>
        }
      />

      {/* Protected admin routes (yêu cầu đăng nhập và quyền admin) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAuth={true} requireAdmin={true}>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/category"
        element={
          <ProtectedRoute requireAuth={true} requireAdmin={true}>
            <Category />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/Utilities"
        element={
          <ProtectedRoute requireAuth={true} requireAdmin={true}>
            <Utilities />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/top_up"
        element={
          <ProtectedRoute requireAuth={true} requireAdmin={true}>
            <Top_up />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requireAuth={true} requireAdmin={true}>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/"
        element={
          <ProtectedRoute requireAuth={true} requireAdmin={true}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/post"
        element={
          <ProtectedRoute requireAuth={true} requireAdmin={true}>
            <PostModeration />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
