import { useState } from "react";
import SidebarWithNavbar from "../SidebarWithNavbar";
import { FaCalendarAlt, FaSave } from "react-icons/fa";
import { Link} from "react-router-dom";

const hopDongList = [
    { id: 1, roomName: "Phòng 101" },
    { id: 2, roomName: "Phòng 102" },
    { id: 3, roomName: "Phòng 201" },
];

export default function CreateElectricBill() {
    const [thang, setThang] = useState("2025-07");
    const [donGia, setDonGia] = useState(3500);
    const [hoaDonList, setHoaDonList] = useState(
        hopDongList.map((hd) => ({
            hopdong_id: hd.id,
            roomName: hd.roomName,
            chi_so_dau: "",
            chi_so_cuoi: "",
        }))
    );

    const handleChange = (index, field, value) => {
        const updated = [...hoaDonList];
        updated[index][field] = value;
        setHoaDonList(updated);
    };

    const tinhTien = (dau, cuoi) => {
        const soDien = cuoi - dau;
        return soDien > 0 ? soDien * donGia : 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSubmit = hoaDonList.map((item) => ({
            hopdong_id: item.hopdong_id,
            chi_so_dau: Number(item.chi_so_dau),
            chi_so_cuoi: Number(item.chi_so_cuoi),
            don_gia: Number(donGia),
            thang,
        }));

        console.log("Dữ liệu gửi lên backend:", dataToSubmit);
        // TODO: gọi API lưu danh sách hóa đơn điện
    };

    return (
        <SidebarWithNavbar>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-blue-800">
                        Tạo hóa đơn điện
                    </h1>
                    <Link
                        to="/admin/ElectricBill"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        &larr; Quay lại danh sách
                    </Link>
                </div>
                <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6 space-y-6">
                    <div className="flex gap-4 flex-col md:flex-row">
                        <div className="flex-1">
                            <label className="block font-medium mb-1">
                                <FaCalendarAlt className="inline mr-2" />
                                Tháng áp dụng
                            </label>
                            <input
                                type="month"
                                value={thang}
                                onChange={(e) => setThang(e.target.value)}
                                className="w-full border border-gray-300 px-3 py-2 rounded"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block font-medium mb-1">Đơn giá điện (VNĐ/kWh)</label>
                            <input
                                type="number"
                                value={donGia}
                                onChange={(e) => setDonGia(e.target.value)}
                                className="w-full border border-gray-300 px-3 py-2 rounded"
                                required
                            />
                        </div>
                    </div>

                    <div className="overflow-auto">
                        <table className="min-w-full mt-4 border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-4 py-2 text-left">Phòng</th>
                                    <th className="border px-4 py-2 text-left">Chỉ số đầu</th>
                                    <th className="border px-4 py-2 text-left">Chỉ số cuối</th>
                                    <th className="border px-4 py-2 text-left">Số điện</th>
                                    <th className="border px-4 py-2 text-left">Thành tiền (VNĐ)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hoaDonList.map((hd, index) => {
                                    const soDien =
                                        Number(hd.chi_so_cuoi) - Number(hd.chi_so_dau);
                                    const thanhTien = tinhTien(
                                        Number(hd.chi_so_dau),
                                        Number(hd.chi_so_cuoi)
                                    );
                                    return (
                                        <tr key={hd.hopdong_id}>
                                            <td className="border px-4 py-2">{hd.roomName}</td>
                                            <td className="border px-4 py-2">
                                                <input
                                                    type="number"
                                                    className="w-full px-2 py-1 border rounded"
                                                    value={hd.chi_so_dau}
                                                    onChange={(e) =>
                                                        handleChange(index, "chi_so_dau", e.target.value)
                                                    }
                                                    required
                                                />
                                            </td>
                                            <td className="border px-4 py-2">
                                                <input
                                                    type="number"
                                                    className="w-full px-2 py-1 border rounded"
                                                    value={hd.chi_so_cuoi}
                                                    onChange={(e) =>
                                                        handleChange(index, "chi_so_cuoi", e.target.value)
                                                    }
                                                    required
                                                />
                                            </td>
                                            <td className="border px-4 py-2 text-center">
                                                {soDien > 0 ? soDien : "-"}
                                            </td>
                                            <td className="border px-4 py-2 text-right">
                                                {thanhTien > 0 ? thanhTien.toLocaleString() : "-"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-right">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                        >
                            <FaSave /> Lưu hóa đơn
                        </button>
                    </div>
                </form>
            </div>
        </SidebarWithNavbar>
    );
}
