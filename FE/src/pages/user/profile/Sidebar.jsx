import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaPlus, FaList, FaMoneyBill, FaHistory,
  FaTags, FaUser, FaSignOutAlt, FaBars, FaTimes
} from 'react-icons/fa';
import avatar from '@/assets/avatar.jpg';
import { useAuthUser } from "../../../api/homePage/queries";

const menuItems = [
  { icon: <FaPlus />, label: 'Đăng tin mới', path: '/post' },
  { icon: <FaList />, label: 'Danh sách tin đăng', path: '/posts' },
  { icon: <FaMoneyBill />, label: 'Nạp tiền vào tài khoản', path: '/top-up' },
  { icon: <FaHistory />, label: 'Lịch sử nạp tiền', path: '/history/top-up' },
  { icon: <FaHistory />, label: 'Lịch sử thanh toán', path: '/history/payment' },
  { icon: <FaTags />, label: 'Bảng giá dịch vụ', path: '/pricing' },
  { icon: <FaUser />, label: 'Quản lý tài khoản', path: '/user' },
  { icon: <FaSignOutAlt />, label: 'Đăng xuất', path: '/logout' },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: user, isLoading: isUserLoading, error: userError } = useAuthUser();
  // console.log("HinhDaiDien:", user?.HinhDaiDien);

  if (isUserLoading) return <p className="p-4">Đang tải thông tin người dùng...</p>;
  if (userError) return <p className="p-4 text-red-500">Không thể tải dữ liệu người dùng</p>;

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden flex justify-between items-center p-4 bg-gray-100">
        <div className="font-bold text-lg">Trang cá nhân</div>
        <button onClick={() => setIsOpen(true)}>
          <FaBars size={24} />
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden" onClick={() => setIsOpen(false)}>
          <div className="w-3/4 bg-white h-full p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <div className="font-bold text-xl">Menu</div>
              <button onClick={() => setIsOpen(false)}>
                <FaTimes size={24} />
              </button>
            </div>
            <SidebarContent avatar={avatar} user={user} />
          </div>
        </div>
      )}

      {/* Sidebar for Desktop */}
      <div className="hidden md:block w-1/4 bg-gray-100 p-4">
        <SidebarContent avatar={avatar} user={user} />
      </div>
    </>
  );
};

const SidebarContent = ({ avatar, user }) => (
  <>
    <div className="flex items-center mb-4">
      <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden">
        <img
          src={`data:image/png;base64,${user?.HinhDaiDien}`}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
        
      </div>
      <div className="ml-2">
        <p className="font-bold">{user?.HoTen || "Chưa đăng nhập"}</p>
        <p>{user?.SDT || "..."}</p>
        <p className="text-sm text-gray-600">Mã tài khoản: {user?.MaNguoiDung || "..."}</p>
      </div>
    </div>
    <Link to="/top-up">
      <button className="bg-yellow-400 text-white py-2 px-4 rounded mb-4 w-full cursor-pointer">Nạp tiền</button>
    </Link>
    <p className="mb-4 text-sm">Số dư tài khoản: {user?.so_du?.toLocaleString('vi-VN') || 0}₫</p>
    <ul>
      {menuItems.map((item, idx) => (
        <Link key={idx} to={item.path}>
          <li className="mb-2 hover:bg-amber-50 flex items-center p-2 rounded">
            <span className="mr-2">{item.icon}</span> {item.label}
          </li>
        </Link>
      ))}
    </ul>
  </>
);

export default Sidebar;
