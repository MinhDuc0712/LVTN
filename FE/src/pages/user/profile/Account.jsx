import { useState } from 'react';
import Sidebar from './Sidebar';

const AccountManagement = () => {
  // Khai báo avatar state
  const [avatar, setAvatar] = useState('src/assets/avatar.jpg');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen p-4 md:p-6">
      <Sidebar />

      <div className="w-full md:w-3/4 p-4 md:p-6 bg-white rounded-lg shadow-lg overflow-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-700">Quản lý tài khoản</h1>

        <div className="border-b mb-4 flex flex-wrap gap-2">
          <button className="mr-4">Thông tin cá nhân</button>
          <button className="mr-4">Đổi số điện thoại</button>
          <button>Đổi mật khẩu</button>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <div className="flex flex-col sm:flex-row items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden">
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <label className="mt-2 sm:mt-0 sm:ml-2 cursor-pointer bg-gray-500 text-white px-3 py-1 rounded text-sm">
              Đổi ảnh đại diện
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {/* Các input khác */}
          <div className="mb-4">
            <label className="block mb-1 text-sm">Số điện thoại</label>
            <input type="text" value="0344773350" className="border p-2 w-full rounded" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm">Tên liên hệ</label>
            <input type="text" value="Quỳnh Trang" className="border p-2 w-full rounded" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm">Email</label>
            <input type="text" value="-" className="border p-2 w-full rounded" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm">Mật khẩu</label>
            <input type="password" value="********" className="border p-2 w-full rounded" />
          </div>
          <button className="bg-gray-500 text-white py-2 px-4 rounded">Cập nhật</button>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
