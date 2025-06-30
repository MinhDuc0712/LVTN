import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckCircle, Copy, Info } from "lucide-react";
import { axiosUser } from "@/api/axios";
import { useAuth } from "@/context/AuthContext";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function TopUpQrPost() {
  const query = useQuery();
  const navigate = useNavigate();
  const { user } = useAuth();

  const amount = query.get("amount");
  const reason = query.get("reason");
  const houseId = query.get("id");
  const type = query.get("type");
  const quantity = query.get("quantity");
  const unit = query.get("unit");

  const [maGiaoDich, setMaGiaoDich] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const createTransaction = async () => {
      try {
        const response = await axiosUser.post("/deposits", {
          ma_nguoi_dung: user?.SDT, // ✔️ lấy từ user context
          so_tien: amount,
          khuyen_mai: 0,
          phuong_thuc: "Banking",
          trang_thai: "Đang xử lý",
          ghi_chu: `${reason} | ${type} ${quantity} ${unit}`,
        });

        setMaGiaoDich(response.ma_giao_dich);
      } catch (error) {
        toast.error("Không thể tạo giao dịch QR cho tin đăng");
        console.error(error);
      }
    };

    if (!maGiaoDich && user && amount && reason) {
      createTransaction();
    }
  }, [maGiaoDich, user, amount, reason]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(maGiaoDich);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-center text-2xl font-bold">
          Thanh toán tin đăng qua QR
        </h1>

        {maGiaoDich ? (
          <>
            <img
              src={`https://api.vietqr.io/image/970418-5220181705-xghjIke.jpg?accountName=NGUYEN%20TRAN%20MINH%20DUC&amount=${amount}&addInfo=${maGiaoDich}`}
              alt="QR Thanh Toán"
              className="mx-auto mb-4 h-64 w-64 rounded-lg border"
            />
            <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="mb-2 text-sm text-gray-700">
                Nội dung chuyển khoản:
              </p>
              <div className="flex items-center justify-between rounded border bg-white px-3 py-2">
                <span className="font-mono font-bold text-blue-700">
                  {maGiaoDich}
                </span>
                <button
                  onClick={handleCopy}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {copied ? "Đã sao chép" : "Sao chép"}
                </button>
              </div>
            </div>
            <button
              onClick={() =>
                navigate(
                  `/banking-confirm?ma_giao_dich=${maGiaoDich}&id=${houseId}&type=${type}&quantity=${quantity}&unit=${unit}`,
                )
              }
              className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Tôi đã chuyển khoản
            </button>
          </>
        ) : (
          <div className="py-10 text-center">
            <p className="text-gray-600">Đang tạo giao dịch...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopUpQrPost;
