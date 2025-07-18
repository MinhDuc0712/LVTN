import { useState, useEffect } from "react";
import SidebarWithNavbar from "../SidebarWithNavbar";
import { FaCalendarAlt, FaSave } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getHopDong, getServicePrices, createElectricBills, getLastElectricReading } from "@/api/homePage/request";
import { toast } from "react-toastify";
export default function CreateElectricBill() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [donGia, setDonGia] = useState(0);
    const [hoaDonList, setHoaDonList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const formatCurrencyVND = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    useEffect(() => {
        const fetchData = async () => {
            toast.dismiss();
            toast.info(`Đang tải dữ liệu cho ngày: ${selectedDate}`);
            try {
                const [hopdongs, servicePrices] = await Promise.all([
                    getHopDong(),
                    getServicePrices()
                ]);

                const dien = servicePrices.find(sp => sp.ten.toLowerCase().trim() === "điện");
                if (dien) setDonGia(dien.gia_tri);

                const hoaDonWithLastReading = await Promise.all(
                    hopdongs.map(async (hd) => {
                        try {
                            const response = await getLastElectricReading(hd.id, selectedDate);

                            return {
                                hopdong_id: hd.id,
                                roomName: hd.phong?.ten_phong || `Phòng ${hd.phong_id}`,
                                chi_so_dau: response?.chi_so_cuoi || 0,
                                chi_so_cuoi: "",
                                lastMonth: response?.thang_truoc || null
                            };
                        } catch (error) {
                            toast.dismiss();
                            toast.error(`Lỗi khi lấy chỉ số phòng ${hd.phong?.ten_phong || hd.phong_id}`);
                            return {
                                hopdong_id: hd.id,
                                roomName: hd.phong?.ten_phong || `Phòng ${hd.phong_id}`,
                                chi_so_dau: 0,
                                chi_so_cuoi: "",
                                lastMonth: null
                            };
                        }
                    })
                );

                setHoaDonList(hoaDonWithLastReading);
            } catch (error) {
                toast.dismiss();
                toast.error("Không thể tải dữ liệu hợp đồng hoặc giá dịch vụ.");
                setError("Không thể tải dữ liệu hợp đồng hoặc giá dịch vụ.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedDate]);

    const handleChange = (index, field, value) => {
        const updated = [...hoaDonList];
        updated[index][field] = value;
        setHoaDonList(updated);
    };

    const tinhTien = (dau, cuoi) => {
        const soDien = cuoi - dau;
        return soDien > 0 ? soDien * donGia : 0;
    };

    const validateData = () => {
        const hasEmptyFields = hoaDonList.some(
            item => item.chi_so_dau === "" || item.chi_so_cuoi === ""
        );

        if (hasEmptyFields) {
            toast.dismiss();
            toast.warning("Vui lòng nhập đầy đủ chỉ số điện cho tất cả các phòng");
            return false;
        }

        const invalidItems = hoaDonList.filter(item => {
            const chiSoDau = Number(item.chi_so_dau);
            const chiSoCuoi = Number(item.chi_so_cuoi);
            return (
                isNaN(chiSoDau) ||
                isNaN(chiSoCuoi) ||
                chiSoDau < 0 ||
                chiSoCuoi < 0 ||
                chiSoCuoi < chiSoDau
            );
        });

        if (invalidItems.length > 0) {
            const roomNames = invalidItems.map(item => item.roomName).join(", ");
            toast.dismiss();
            toast.error(`Vui lòng kiểm tra lại chỉ số điện cho các phòng: ${roomNames}\nYêu cầu: Chỉ số không được âm và chỉ số cuối ≥ đầu`);
            return false;
        }

        return true;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateData()) return;

        const dataToSubmit = hoaDonList.map((item) => ({
            hopdong_id: item.hopdong_id,
            chi_so_dau: Number(item.chi_so_dau),
            chi_so_cuoi: Number(item.chi_so_cuoi),
            don_gia: tinhTien(Number(item.chi_so_dau), Number(item.chi_so_cuoi)),
            ngay_tao: selectedDate,
        }));

        try {
            setSubmitting(true);
            const result = await createElectricBills(dataToSubmit);

            if (result.success) {
                toast.dismiss();
                toast.error(result.message || "Lưu hóa đơn không thành công");
            } else {
                toast.dismiss();
                toast.success("Lưu hóa đơn điện thành công");
                navigate("/admin/ElectricBill");
            }
        } catch (error) {
            let errorMessage = "Có lỗi xảy ra khi lưu hóa đơn điện";

            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;
            } else if (error.request) {
                errorMessage = "Không thể kết nối đến server";
            }
            toast.dismiss();
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };


    if (loading) {
        return (
            <SidebarWithNavbar>
                <div className="p-6">Đang tải dữ liệu...</div>
            </SidebarWithNavbar>
        );
    }

    if (error) {
        return (
            <SidebarWithNavbar>
                <div className="p-6 text-red-600">{error}</div>
            </SidebarWithNavbar>
        );
    }

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
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow rounded p-6 space-y-6"
                >
                    <div className="flex gap-4 flex-col md:flex-row">
                        <div className="flex-1">
                            <label className="block font-medium mb-1">
                                <FaCalendarAlt className="inline mr-2" />
                                Ngày tạo hóa đơn
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full border border-gray-300 px-3 py-2 rounded"
                                required
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block font-medium mb-1">
                                Đơn giá điện (VNĐ/kWh)
                            </label>
                            <div className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-800 flex items-center justify-between">
                                <span>{formatCurrencyVND(donGia)}</span>
                                <span className="text-sm text-gray-500">/ 1 kWh</span>
                            </div>
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
                                    const soDien = Number(hd.chi_so_cuoi) - Number(hd.chi_so_dau);
                                    const thanhTien = tinhTien(Number(hd.chi_so_dau), Number(hd.chi_so_cuoi));
                                    return (
                                        <tr key={hd.hopdong_id}>
                                            <td className="border px-4 py-2">{hd.roomName}</td>
                                            <td className="border px-4 py-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className="w-full px-2 py-1 border rounded"
                                                    value={hd.chi_so_dau}
                                                    disabled
                                                />
                                            </td>
                                            <td className="border px-4 py-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className="w-full px-2 py-1 border rounded"
                                                    value={hd.chi_so_cuoi}
                                                    onChange={(e) => handleChange(index, "chi_so_cuoi", e.target.value)}
                                                    required
                                                />
                                            </td>
                                            <td className="border px-4 py-2 text-center">
                                                {hd.chi_so_cuoi !== "" ? soDien : "-"}
                                            </td>
                                            <td className="border px-4 py-2 text-right">
                                                {hd.chi_so_cuoi !== "" ? formatCurrencyVND(thanhTien) : "-"}
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
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                            disabled={submitting}
                        >
                            <FaSave /> {submitting ? "Đang lưu..." : "Lưu hóa đơn"}
                        </button>
                    </div>
                </form>
            </div>
        </SidebarWithNavbar>
    );
}