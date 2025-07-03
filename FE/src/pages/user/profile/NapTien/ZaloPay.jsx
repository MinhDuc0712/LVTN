import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import { toast } from "react-toastify";
import { createZaloPayPayment } from "@/api/homePage";
import { useAuth } from "@/context/AuthContext";

function ZaloPay() {
  const [amount, setAmount] = useState(50000);
  const { user, isAuthenticated } = useAuth();

  let bonus = 0;
  if (amount >= 2000000) bonus = amount * 0.25;
  else if (amount >= 1000000) bonus = amount * 0.2;
  else if (amount >= 100000) bonus = amount * 0.1;

  const finalReceive = amount + bonus;

  const amounts = [50000, 100000, 200000, 500000, 1000000, 2000000, 5000000];

  const handleZaloPay = async () => {
    try {
      const payload = {
        amount: Number(amount), // đảm bảo là số
        ma_nguoi_dung: user?.SDT || user?.MaNguoiDung,
      };

      const data  = await createZaloPayPayment(payload);
      console.log("ZaloPay response:", data);

      if (data?.order_url) {
        window.location.href = data.order_url;
      } else {
        toast.error("Không thể chuyển hướng đến ZaloPay.");
      }
    } catch (error) {
      toast.error("Lỗi khi khởi tạo thanh toán với ZaloPay");
      console.error("ZaloPay error:", error?.response?.data || error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 p-4 md:flex-row md:p-6">
      <Sidebar />

      <div className="w-full overflow-auto rounded-lg bg-white p-4 shadow-lg md:w-3/4 md:p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-700 md:text-3xl">
          Quản lý giao dịch
        </h1>

        <div className="flex border-b border-gray-200">
          <div className="flex space-x-1">
            <Link to="/Top-up">
              <button className="border-b-2 border-blue-600 px-4 py-3 font-medium text-blue-600">
                Nạp tiền vào tài khoản
              </button>
            </Link>
            <Link to="/history/top-up">
              <button className="px-4 py-3 text-gray-600 transition-colors duration-200 hover:text-blue-600">
                Lịch sử nạp tiền
              </button>
            </Link>
            <Link to="/history/payment">
              <button className="px-4 py-3 text-gray-600 transition-colors duration-200 hover:text-blue-600">
                Lịch sử thanh toán
              </button>
            </Link>
          </div>
        </div>

        <div className="my-10 mb-6 rounded bg-blue-100 p-4 text-sm text-gray-700 md:w-3/4">
          <p className="mb-2 font-semibold">Ưu đãi nạp tiền:</p>
          <ul className="list-inside list-disc space-y-1">
            <li>Nạp từ 100.000 đến dưới 1.000.000 tặng 10%</li>
            <li>Nạp từ 1.000.000 đến dưới 2.000.000 tặng 20%</li>
            <li>Nạp từ 2.000.000 trở lên tặng 25%</li>
          </ul>
        </div>

        <div className="w-full p-6 md:w-3/4">
          <h1 className="mb-6 text-2xl font-bold">
            Nạp tiền vào tài khoản bằng ZaloPay
          </h1>

          <div className="mb-6 rounded-md bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">Chọn số tiền cần nạp</h2>
            <div className="mb-4 grid grid-cols-3 gap-4 md:grid-cols-4">
              {amounts.map((amt) => (
                <button
                  key={amt}
                  className={`rounded-full border px-4 py-2 transition-all ${
                    amt === amount
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-blue-600 text-blue-600 hover:bg-blue-100"
                  }`}
                  onClick={() => setAmount(amt)}
                >
                  {amt.toLocaleString()}₫
                </button>
              ))}
            </div>
            <label>Hoặc nhập số tiền cần nạp</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-4 w-full rounded border px-4 py-2 focus:outline-none"
              placeholder="Hoặc nhập số tiền cần nạp"
            />
          </div>

          <div className="mb-6 rounded-md bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">Thông tin nạp tiền</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Số tiền nạp</span>
                <span>{amount.toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between">
                <span>Khuyến mãi</span>
                <span>+{bonus.toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-black">
                <span>Thực nhận</span>
                <span>{finalReceive.toLocaleString()}₫</span>
              </div>
            </div>
          </div>
          <button
            className="w-full rounded-full bg-[#008fe5] py-3 font-semibold text-white transition-all hover:bg-[#0070cc]"
            onClick={handleZaloPay}
          >
            Tiếp tục với ZaloPay →
          </button>
        </div>
      </div>
    </div>
  );
}

export default ZaloPay;
