import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import SidebarWithNavbar from "../SidebarWithNavbar";
import {
    FaSave,
    FaTimes,
    FaCalendarAlt,
    FaUserFriends,
    FaHome,
    FaMoneyBillWave,
    FaStickyNote
} from "react-icons/fa";

export default function ContractAdd() {
    const navigate = useNavigate();

    const rooms = ["Phòng 101", "Phòng 201", "Phòng 301"];
    const customers = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"];

    const [formData, setFormData] = useState({
        roomName: "",
        customerName: "",
        startDate: "",
        endDate: "",
        deposit: "",
        note: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Dữ liệu gửi lên:", formData);
        // TODO: gọi API tạo hợp đồng ở đây
        navigate("/admin/ContractList"); // hoặc đường dẫn bạn muốn
    };

    return (
        <SidebarWithNavbar>
            <div className="container mx-auto px-4 py-8">
                {/* Tiêu đề + breadcrumbs */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-blue-800">
                        Tạo hợp đồng mới
                    </h1>
                    <Link
                        to="/admin/Contracts"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        &larr; Quay lại danh sách
                    </Link>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md rounded-lg p-6 space-y-6"
                >
                    {/* Phòng */}
                    <div>
                        <label className="block mb-2 font-medium">
                            <FaHome className="inline-block mr-2 mb-1" />
                            Chọn phòng
                        </label>
                        <select
                            required
                            name="roomName"
                            value={formData.roomName}
                            onChange={handleChange}
                            className="w-full border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Chọn phòng --</option>
                            {rooms.map((room) => (
                                <option key={room}>{room}</option>
                            ))}
                        </select>
                    </div>

                    {/* Khách hàng */}
                    <div>
                        <label className="block mb-2 font-medium">
                            <FaUserFriends className="inline-block mr-2 mb-1" />
                            Chọn khách hàng
                        </label>
                        <select
                            required
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            className="w-full border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Chọn khách hàng --</option>
                            {customers.map((cus) => (
                                <option key={cus}>{cus}</option>
                            ))}
                        </select>
                    </div>

                    {/* Ngày bắt đầu - kết thúc */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 font-medium">
                                <FaCalendarAlt className="inline-block mr-2 mb-1" />
                                Ngày bắt đầu
                            </label>
                            <input
                                required
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">
                                <FaCalendarAlt className="inline-block mr-2 mb-1" />
                                Ngày kết thúc
                            </label>
                            <input
                                required
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="w-full border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    {/* Tiền thuê */}
                    <div>
                        <label className="block mb-2 font-medium">
                            <FaMoneyBillWave className="inline-block mr-2 mb-1" />
                            Tiền thuê (VND)
                        </label>
                        <input
                            required
                            type="number"
                            min="0"
                            name="deposit"
                            value={formData.deposit}
                            onChange={handleChange}
                            placeholder="Nhập số tiền thuê"
                            className="w-full border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Tiền cọc */}
                    <div>
                        <label className="block mb-2 font-medium">
                            <FaMoneyBillWave className="inline-block mr-2 mb-1" />
                            Tiền cọc (VND)
                        </label>
                        <input
                            required
                            type="number"
                            min="0"
                            name="deposit"
                            value={formData.deposit}
                            onChange={handleChange}
                            placeholder="Nhập số tiền cọc"
                            className="w-full border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Ghi chú */}
                    <div>
                        <label className="block mb-2 font-medium">
                            <FaStickyNote className="inline-block mr-2 mb-1" />
                            Chi Phí Tiện Ích
                        </label>
                        <textarea
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Chi phí tiện ích"
                            className="w-full border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Ghi chú */}
                    <div>
                        <label className="block mb-2 font-medium">
                            <FaStickyNote className="inline-block mr-2 mb-1" />
                            Ghi chú
                        </label>
                        <textarea
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Thêm ghi chú (nếu có)"
                            className="w-full border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Nút hành động */}
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex items-center px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200"
                        >
                            <FaTimes className="mr-2" /> Hủy
                        </button>
                        <button
                            type="submit"
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            <FaSave className="mr-2" /> Lưu hợp đồng
                        </button>
                    </div>
                </form>
            </div>
        </SidebarWithNavbar>
    );
}