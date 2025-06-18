import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { toast } from 'react-hot-toast';
import { axiosUser } from '@/api/axios';
import { useAuthUser } from "@/api/homePage/queries";
import { useQueryClient } from "@tanstack/react-query";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}


function PaymentPost() {
    const query = useQuery();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const houseId = query.get("id");
    const { data: user, isLoading: isUserLoading, error: userError } = useAuthUser();
    useEffect(() => {

    }, [user, isUserLoading, userError]);
    
    const handlePayment = async () => {
        if (!houseId) {
            toast.error("Không tìm thấy bài đăng.");
            return;
        }

        try {
            await axiosUser.post("/houses/payment", {
                houseId,
                planType: type,
                duration: quantity,
                unit: durationUnit,
                total,
            });
            queryClient.setQueryData(["me"], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    so_du: oldData.so_du - total,
                };
            });


            toast.success("Thanh toán thành công!");
            navigate("/my-houses"); // hoặc trang bạn muốn quay lại
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi thanh toán.");
        }
    };

    const plans = {
        normal: {
            label: "Tin thường",
            pricePerDay: 5000,
            minDays: 3,
        },
        vip: {
            label: "Tin VIP",
            pricePerDay: 30000,
            minDays: 1,
        },
    };

    const durationOptions = {
        day: { label: "Theo ngày", factor: 1 },
        week: { label: "Theo tuần", factor: 7 },
        month: { label: "Theo tháng", factor: 30 },
    };

    const [type, setType] = useState("normal");
    const [durationUnit, setDurationUnit] = useState("day");
    const [quantity, setQuantity] = useState(3);
    const [total, setTotal] = useState(0);

    useEffect(() => {

        if (durationUnit === "day" && quantity < 3) {
            setQuantity(3);
            return;
        }

        const days = quantity * durationOptions[durationUnit].factor;
        const plan = plans[type];
        const validDays = Math.max(days, type === "normal" ? plan.minDays : 1);
        setTotal(validDays * plan.pricePerDay);
    }, [type, durationUnit, quantity]);


    return (
        <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen p-4 md:p-6">
            <Sidebar />
            <div className="w-full md:w-3/4 p-4 md:p-6 bg-white rounded-lg shadow-lg overflow-auto">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-700">Thanh toán tin đăng</h1>

                <div className="border-b mb-6">
                    <button className="mr-4">Thanh toán</button>
                </div>

                <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white shadow rounded-xl">
                    <h2 className="text-xl font-semibold">Chọn gói tin đăng</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block mb-1">Loại tin</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="normal">Tin thường (5.000₫/ngày)</option>
                                <option value="vip">Tin VIP (30.000₫/ngày)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1">Đơn vị thời gian</label>
                            <select
                                value={durationUnit}
                                onChange={(e) => setDurationUnit(e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                {Object.entries(durationOptions).map(([key, val]) => (
                                    <option key={key} value={key}>
                                        {val.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1">
                                Số lượng ({durationOptions[durationUnit].label.toLowerCase()})
                            </label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                min={durationUnit === "day" ? 3 : 1}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-blue-100 rounded shadow-inner">
                        <h3 className="font-semibold text-lg mb-2">Thông tin thanh toán</h3>
                        <ul className="text-sm space-y-1">
                            <li>
                                <span className="font-medium">Loại tin:</span> {plans[type].label}
                            </li>
                            <li>
                                <span className="font-medium">Thời gian:</span>{" "}
                                {quantity} {durationOptions[durationUnit].label.toLowerCase()} (
                                {quantity * durationOptions[durationUnit].factor} ngày)
                            </li>
                            <li>
                                <span className="font-medium">Đơn giá:</span>{" "}
                                {plans[type].pricePerDay.toLocaleString()} ₫/ngày
                            </li>
                            <li>
                                <span className="font-medium">Tổng cộng:</span>{" "}
                                <span className="text-xl font-bold text-blue-600">
                                    {total.toLocaleString()}₫
                                </span>
                            </li>
                        </ul>
                        {type === "normal" ? (
                            <p className="mt-4 text-yellow-700 bg-yellow-100 p-3 rounded">
                                Tin đăng sẽ hiển thị sau tin VIP, tin đăng sẽ phải chờ phê duyệt mới được hiển thị.
                            </p>
                        ) : (
                            <p className="mt-4 text-green-700 bg-green-100 p-3 rounded">
                                Tin đăng sẽ hiển thị lên trang đầu và không phải chờ phê duyệt.
                            </p>
                        )}

                    </div>
                    <div className="mt-6 space-y-4">
                        <h2 className="text-xl font-semibold">Chọn phương thức thanh toán</h2>

                        {/* Trừ tiền từ tài khoản */}
                        <div className="border p-4 rounded relative">
                            <label className="flex items-start space-x-2">
                                <input type="radio" name="payment" className="mt-1" defaultChecked />
                                <div className="flex-1">
                                    <p className="font-semibold">Trừ tiền trong tài khoản HOME CONVENIENT</p>
                                    <p className="text-green-600 text-sm">
                                        (Bạn đang có: {user?.so_du?.toLocaleString() || 0}₫)
                                    </p>
                                    {user?.so_du < total && (
                                        <p className="text-red-600 text-sm">
                                            Số tiền trong tài khoản của bạn không đủ để thực hiện thanh toán, vui lòng{" "}
                                            <Link to="/top-up" className="text-blue-600 underline">nạp thêm</Link> hoặc chọn phương thức khác bên dưới.
                                        </p>
                                    )}
                                </div>
                            </label>
                        </div>
                        {/* QR Code */}
                        <div className="border p-4 rounded flex items-center justify-between">
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="payment" />
                                <span>Thanh toán quét mã QRCode</span>
                            </label>
                            <img className="w-10" src="https://img.icons8.com/ios-filled/24/000000/qr-code.png" alt="QR Code" />
                        </div>

                        {/* Ví MoMo */}
                        <div className="border p-4 rounded flex items-center justify-between">
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="payment" />
                                <span>Thanh toán ví MoMo</span>
                            </label>
                            <img className="w-10" src="../src/assets/momo.png" alt="MoMo" />
                        </div>

                        {/* Chuyển khoản ngân hàng */}
                        <div className="border p-4 rounded space-y-2">
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="payment" />
                                <span>Chuyển khoản ngân hàng</span>
                            </label>
                            <p className="text-red-600 text-sm">Số tiền chuyển khoản: <strong>{total.toLocaleString()}₫</strong></p>
                            <p className="text-sm">
                                Nội dung chuyển khoản: <span className="bg-blue-100 text-blue-800 font-semibold px-2 py-1 rounded">HOME CONVENIENT TT 151962 {plans[type].label} {quantity} {durationOptions[durationUnit].label.toLowerCase()}</span>
                            </p>
                        </div>
                        <div className="flex justify-between gap-4 mt-6">
                            <Link className="flex items-center justify-center gap-2 w-1/2 px-6 py-3 bg-gray-300 text-black font-medium rounded-xl hover:bg-gray-400 transition" to="/post">
                                <span className="text-lg">←</span> Quay lại
                            </Link>
                            <button
                                onClick={handlePayment}
                                className="w-1/2 px-6 py-3 bg-[#ff1e56] hover:bg-[#e60042] text-white font-semibold rounded-xl transition"
                            >
                                Thanh toán {total.toLocaleString()}₫
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentPost;