import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ImSpinner2 } from "react-icons/im";
import { axiosUser } from "@/api/axios";

function BankingConfirm() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [transaction, setTransaction] = useState(null);
  const navigate = useNavigate();

  const maGiaoDich = searchParams.get("ma_giao_dich");
  const houseId = searchParams.get("id");
  const type = searchParams.get("type");
  const quantity = searchParams.get("quantity");
  const unit = searchParams.get("unit");

  useEffect(() => {
    const checkTransaction = async () => {
      try {
        const res = await axiosUser.get(`/deposits/check/${maGiaoDich}`);
        const data = res;

        setTransaction(data);

        if (data.trang_thai === "Hoàn tất") {
          setStatus("success");

          // ✅ Nếu có houseId thì gọi thanh toán bài đăng
          if (houseId && type && quantity && unit) {
            try {
              await axiosUser.post("/payments", {
                ma_giao_dich: maGiaoDich,
                houseId,
                type,
                quantity,
                unit,
              });
              toast.success("Đã xác nhận thanh toán bài đăng qua QR!");
              setTimeout(() => navigate("/"), 3000);
            } catch (error) {
              console.error("Lỗi thanh toán bài đăng:", error);
              toast.error("Không thể xác nhận thanh toán bài đăng.");
            }
          } else {
            // Nếu chỉ là nạp tiền
            setTimeout(() => navigate("/history/top-up"), 3000);
          }
        } else if (data.trang_thai === "Hủy bỏ") {
          setStatus("failed");
        } else {
          setStatus("pending");
        }
      } catch (err) {
        console.error("Lỗi kiểm tra giao dịch:", err);
        toast.error("Lỗi kiểm tra giao dịch");
        setStatus("failed");
      }
    };

    if (maGiaoDich) {
      checkTransaction();
      const interval = setInterval(checkTransaction, 10000);
      return () => clearInterval(interval);
    } else {
      toast.error("Không tìm thấy mã giao dịch");
      setStatus("failed");
    }
  }, [maGiaoDich, houseId, type, quantity, unit, navigate]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="py-10 text-center">
            <ImSpinner2 className="mx-auto h-10 w-10 animate-spin text-blue-500" />
            <p className="mt-4 text-gray-600">Đang kiểm tra giao dịch...</p>
          </div>
        );
      case "success":
        return (
          <div className="py-10 text-center text-green-600">
            <h2 className="text-2xl font-bold">Giao dịch thành công!</h2>
            <p className="mt-2">
              Chúng tôi đã nhận được tiền và sẽ cộng vào tài khoản bạn sớm.
            </p>
            <p className="mt-1 font-mono">Mã GD: {transaction?.ma_giao_dich}</p>
          </div>
        );
      case "pending":
        return (
          <div className="py-10 text-center text-yellow-600">
            <h2 className="text-xl font-bold">⏳ Đang chờ xử lý</h2>
            <p className="mt-2">
              Vui lòng đợi vài phút để xác nhận giao dịch...
            </p>
            <p className="mt-1 font-mono">Mã GD: {transaction?.ma_giao_dich}</p>
          </div>
        );
      case "failed":
      default:
        return (
          <div className="py-10 text-center text-red-600">
            <h2 className="text-2xl font-bold">Giao dịch thất bại</h2>
            <p className="mt-2">Không thể xác minh giao dịch.</p>
            <button
              onClick={() => navigate("/Top-up")}
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        {renderContent()}
      </div>
    </div>
  );
}

export default BankingConfirm;
