// src/pages/admin/RoomPriceAdd.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SidebarWithNavbar from "../SidebarWithNavbar";
import { FaPlus, FaTrash, FaSave, FaCalendarAlt, FaDollarSign, FaHome } from "react-icons/fa";

export default function RoomPriceAdd() {
  const navigate = useNavigate();

  // Danh sách phòng mẫu (có thể lấy từ API)
  const rooms = ["Phòng 101", "Phòng 102", "Phòng 201", "Phòng 301"];

  const [formData, setFormData] = useState({
    room: "",
    services: [
      {
        name: "",
        price: "",
        startDate: "",
        endDate: ""
      }
    ]
  });

  const handleServiceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedServices = [...formData.services];
    updatedServices[index][name] = value;
    setFormData((prev) => ({ ...prev, services: updatedServices }));
  };

  const handleAddService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        { name: "", price: "", startDate: "", endDate: "" }
      ]
    }));
  };

  const handleRemoveService = (index) => {
    const updated = formData.services.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, services: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dữ liệu gửi lên:", formData);
    // TODO: Gọi API lưu giá dịch vụ
    navigate("/admin/ContractList");
  };

  return (
    <SidebarWithNavbar>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">Thêm giá dịch vụ cho phòng</h1>
          <Link to="/admin/ContractList" className="text-blue-600 hover:underline text-sm">
            &larr; Quay lại danh sách
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6 space-y-6"
        >
          {/* Chọn phòng */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              <FaHome className="inline-block mr-2" />
              Chọn phòng
            </label>
            <select
              required
              name="room"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Chọn phòng --</option>
              {rooms.map((room) => (
                <option key={room}>{room}</option>
              ))}
            </select>
          </div>

          {/* Danh sách dịch vụ */}
          <div>
            <label className="block mb-4 font-medium text-gray-700">Danh sách dịch vụ</label>
            {formData.services.map((service, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-4 border-b pb-4"
              >
                <div>
                  <label className="block text-sm font-medium">Tên dịch vụ</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="VD: Internet, Nước, Điện"
                    value={service.name}
                    onChange={(e) => handleServiceChange(index, e)}
                    className="w-full border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Giá (VND)</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Giá dịch vụ"
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, e)}
                    className="w-full border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    <FaCalendarAlt className="inline-block mr-1 mb-1" />
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={service.startDate}
                    onChange={(e) => handleServiceChange(index, e)}
                    className="w-full border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    <FaCalendarAlt className="inline-block mr-1 mb-1" />
                    Đến ngày
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      name="endDate"
                      value={service.endDate}
                      onChange={(e) => handleServiceChange(index, e)}
                      className="w-full border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                    {formData.services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveService(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddService}
              className="flex items-center text-sm text-blue-600 hover:underline"
            >
              <FaPlus className="mr-1" /> Thêm dịch vụ
            </button>
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FaSave className="mr-2" /> Lưu thông tin
            </button>
          </div>
        </form>
      </div>
    </SidebarWithNavbar>
  );
}
