import { useAuthUser } from "@/api/homePage/";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { postPaymentForHouse } from "@/api/homePage/request";
import Sidebar from "./Sidebar";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function PaymentPost() {
  const query = useQuery();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const houseId = query.get("id");
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useAuthUser();
  const [paymentMethod, setPaymentMethod] = useState("wallet");

  useEffect(() => {}, [user, isUserLoading, userError]);

  const handlePayment = async () => {
  if (!houseId) {
    toast.error("Không tìm thấy bài đăng.");
    return;
  }

  if (paymentMethod === "wallet") {
    if (user?.so_du < total) {
      toast.error("Số dư không đủ để thanh toán.");
      return;
    }

    try {
      await postPaymentForHouse({
        houseId,
        type,
        quantity,
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

    
      if (type === "vip") {
        toast.success("Thanh toán thành công! Bài đăng của bạn đã được đăng.");
      } else {
        toast.success("Thanh toán thành công! Bài đăng của bạn sẽ được xét duyệt trong 24h tới.");
      }
      
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi thanh toán.");
    }
  } else if (paymentMethod === "momo") {
    // Handle MoMo payment
    navigate(
      `/zalo-pay-post?amount=${total}&reason=ThanhToanTinDang&id=${houseId}&type=${type}&quantity=${quantity}&unit=${durationUnit}`,
    );
  } else if (paymentMethod === "bank") {
    navigate(
      `/Top-up-qr-post?amount=${total}&reason=ThanhToanTinDang&id=${houseId}&type=${type}&quantity=${quantity}&unit=${durationUnit}`,
    );
    toast.info("Vui lòng chuyển khoản theo thông tin hiển thị.");
  } else {
    toast.error("Vui lòng chọn phương thức thanh toán.");
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
    <div className="flex min-h-screen flex-col bg-gray-50 p-4 md:flex-row md:p-6">
      <Sidebar />
      <div className="w-full overflow-auto rounded-lg bg-white p-4 shadow-lg md:w-3/4 md:p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-700 md:text-3xl">
          Thanh toán tin đăng
        </h1>

        <div className="mb-6 border-b">
          <button className="mr-4">Thanh toán</button>
        </div>

        <div className="mx-auto max-w-4xl space-y-6 rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Chọn gói tin đăng</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block">Loại tin</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded border p-2"
              >
                <option value="normal">Tin thường (5.000₫/ngày)</option>
                <option value="vip">Tin VIP (30.000₫/ngày)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block">Đơn vị thời gian</label>
              <select
                value={durationUnit}
                onChange={(e) => setDurationUnit(e.target.value)}
                className="w-full rounded border p-2"
              >
                {Object.entries(durationOptions).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block">
                Số lượng ({durationOptions[durationUnit].label.toLowerCase()})
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={durationUnit === "day" ? 3 : 1}
                className="w-full rounded border p-2"
              />
            </div>
          </div>

          <div className="rounded bg-blue-100 p-4 shadow-inner">
            <h3 className="mb-2 text-lg font-semibold">Thông tin thanh toán</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <span className="font-medium">Loại tin:</span>{" "}
                {plans[type].label}
              </li>
              <li>
                <span className="font-medium">Thời gian:</span> {quantity}{" "}
                {durationOptions[durationUnit].label.toLowerCase()} (
                {quantity * durationOptions[durationUnit].factor} ngày)
              </li>
              <li>
                <span className="font-medium">Đơn giá:</span>{" "}
                {plans[type].pricePerDay.toLocaleString()} ₫/ngày
              </li>
              <li>
                <span className="font-medium">Tổng cộng:</span>
                <span className="text-xl font-bold text-blue-600">
                  {total.toLocaleString()}₫
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">
              Chọn phương thức thanh toán
            </h2>

            <div className="relative rounded border p-4">
              <label className="flex items-start space-x-2">
                <input
                  type="radio"
                  name="payment"
                  value="wallet"
                  checked={paymentMethod === "wallet"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-semibold">
                    Trừ tiền trong tài khoản HOME CONVENIENT
                  </p>
                  <p className="text-sm text-green-600">
                    (Bạn đang có: {user?.so_du?.toLocaleString() || 0}₫)
                  </p>
                  {user?.so_du < total && (
                    <p className="text-sm text-red-600">
                      Số tiền không đủ. Vui lòng
                      <Link
                        to="/top-up"
                        className="ml-1 text-blue-600 underline"
                      >
                        nạp thêm
                      </Link>
                    </p>
                  )}
                </div>
              </label>
            </div>

            {/* <div className="flex items-center justify-between rounded border p-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="payment"
                  value="qr"
                  checked={paymentMethod === "qr"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Thanh toán quét mã QRCode</span>
              </label>
              <img className="w-10" src="https://img.icons8.com/ios-filled/24/000000/qr-code.png" alt="QR Code" />
            </div> */}

            <div className="flex items-center justify-between rounded border p-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="payment"
                  value="momo"
                  checked={paymentMethod === "momo"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Thanh toán ví MoMo</span>
              </label>
              <img className="w-10" src="../src/assets/momo.png" alt="MoMo" />
            </div>

            <div className="space-y-2 rounded border p-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Chuyển khoản ngân hàng</span>
              </label>
              <p className="text-sm text-red-600">
                Số tiền chuyển khoản: <strong>{total.toLocaleString()}₫</strong>
              </p>
            </div>

            <div className="mt-6 flex justify-between gap-4">
              <Link
                className="flex w-1/2 items-center justify-center gap-2 rounded-xl bg-gray-300 px-6 py-3 font-medium text-black transition hover:bg-gray-400"
                to="/post"
              >
                <span className="text-lg">←</span> Quay lại
              </Link>
              <button
                onClick={handlePayment}
                className="w-1/2 rounded-xl bg-[#ff1e56] px-6 py-3 font-semibold text-white transition hover:bg-[#e60042]"
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
