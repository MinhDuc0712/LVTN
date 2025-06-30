import {
  usePostUserDepositTransaction,
  useUpdateUserDepositTransaction,
} from "@/api/homePage/queries";
import { useAuth } from "@/context/AuthContext";
import {
  CheckCircle,
  Copy,
  Gift,
  Info,
  QrCode,
  Smartphone
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../Sidebar";

function BankingPayment() {
  const [amount, setAmount] = useState(50000);
  const [maGiaoDich, setMaGiaoDich] = useState("");
  const [isCreatingTransaction, setIsCreatingTransaction] = useState(false);
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const createDepositMutation = usePostUserDepositTransaction();
  const updateDepositMutation = useUpdateUserDepositTransaction();
  // Tính khuyến mãi
  let bonus = 0;
  if (amount >= 2000000) bonus = amount * 0.25;
  else if (amount >= 1000000) bonus = amount * 0.2;
  else if (amount >= 100000) bonus = amount * 0.1;

  const finalReceive = amount + bonus;
  const amounts = [50000, 100000, 200000, 500000, 1000000, 2000000, 5000000];

  // Bank info
  const bankInfo = {
    bankName: "BIDV",
    accountNumber: "5220181705",
    accountName: "NGUYEN TRAN MINH DUC",
    transferContent: maGiaoDich || "Đang tạo mã...",
  };

  // Mock transaction creation
  useEffect(() => {
    let timeout;

    const khuyenMai =
      amount >= 2000000
        ? 25
        : amount >= 1000000
          ? 20
          : amount >= 100000
            ? 10
            : 0;

    const createTransaction = async () => {
      try {
        const data = await createDepositMutation.mutateAsync({
          ma_nguoi_dung: user.SDT,
          so_tien: amount,
          khuyen_mai: khuyenMai,
          phuong_thuc: "Banking",
          trang_thai: "Đang xử lý",
          ghi_chu: `Nạp tiền QR từ ${user.HoTen}`,
        });

        if (!data || !data.ma_giao_dich)
          throw new Error("Phản hồi không hợp lệ");

        setMaGiaoDich(data.ma_giao_dich);
      } catch (err) {
        console.error("Lỗi tạo giao dịch:", err);
        toast.error("Không thể tạo giao dịch mới");
      }
    };

    const updateTransaction = async () => {
      try {
        await updateDepositMutation.mutateAsync({
          id: maGiaoDich,
          formData: {
            so_tien: amount,
            khuyen_mai: khuyenMai,
            phuong_thuc: "Banking",
            trang_thai: "Đang xử lý",
            ghi_chu: `Cập nhật số tiền QR từ ${user?.HoTen || "Người dùng"}`,
          },
        });
      } catch (err) {
        console.error("Lỗi cập nhật giao dịch:", err);
      }
    };

    if (user && amount > 0) {
      timeout = setTimeout(() => {
        if (!maGiaoDich) {
          createTransaction();
        } else {
          updateTransaction();
        }
      }, 300);
    }

    return () => clearTimeout(timeout);
  }, [user, amount, maGiaoDich]);

  const handleCopyContent = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleConfirmPayment = () => {
    // Mock navigation to confirmation page
    alert(`Chuyển đến trang xác nhận với mã giao dịch: ${maGiaoDich}`);
  };
  if (!isAuthenticated) return <Navigate to="/Top-up/QR" replace />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-4 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
              Nạp tiền QR Banking
            </h1>
            <p className="text-gray-600">Chuyển khoản nhanh chóng và an toàn</p>
          </div>

          {/* Navigation Tabs */}
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

          {/* Promotion Banner */}
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-orange-400 to-pink-500 p-6 text-white">
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-white/20 p-3">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold">
                  Ưu đãi nạp tiền đặc biệt!
                </h3>
                <div className="space-y-1 text-sm opacity-90">
                  <p>Nạp 100K - 1M: Tặng thêm 10%</p>
                  <p>Nạp 1M - 2M: Tặng thêm 20%</p>
                  <p>Nạp từ 2M: Tặng thêm 25%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column - QR Code & Bank Info */}
            <div className="space-y-6">
              {/* QR Code Section */}
              <div className="rounded-2xl bg-white p-6 shadow-xl">
                <div className="text-center">
                  <h2 className="mb-4 flex items-center justify-center space-x-2 text-xl font-bold text-gray-800">
                    <QrCode className="h-6 w-6 text-blue-600" />
                    <span>Mã QR thanh toán</span>
                  </h2>

                  {isCreatingTransaction ? (
                    <div className="flex flex-col items-center space-y-4 py-12">
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                      <p className="text-gray-600">Đang tạo mã QR...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative inline-block">
                        <img
                          src={`https://api.vietqr.io/image/970418-5220181705-xghjIke.jpg?accountName=NGUYEN%20TRAN%20MINH%20DUC&amount=${amount}&addInfo=${maGiaoDich}`}
                          alt="QR thanh toán"
                          className="mx-auto h-95 w-100 rounded-xl border-4 border-white shadow-lg"
                        />
                        <div className="absolute -top-2 -right-2 rounded-full bg-green-500 p-2 text-white">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="mb-2 text-sm text-gray-600">
                          Quét mã QR bằng app ngân hàng
                        </p>
                        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Smartphone className="h-4 w-4" />
                            <span>Mobile Banking</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bank Information */}
              <div className="rounded-2xl bg-white p-6 shadow-xl">
                <h3 className="mb-4 text-lg font-bold text-gray-800">
                  Thông tin chuyển khoản
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                    <span className="text-gray-600">Ngân hàng:</span>
                    <span className="font-semibold">{bankInfo.bankName}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                    <span className="text-gray-600">Số tài khoản:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-semibold">
                        {bankInfo.accountNumber}
                      </span>
                      <button
                        onClick={() =>
                          handleCopyContent(bankInfo.accountNumber)
                        }
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                    <span className="text-gray-600">Chủ tài khoản:</span>
                    <span className="font-semibold">
                      {bankInfo.accountName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                    <span className="text-gray-600">Nội dung CK:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-red-600">
                        {bankInfo.transferContent}
                      </span>
                      <button
                        onClick={() =>
                          handleCopyContent(bankInfo.transferContent)
                        }
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {copied && (
                  <div className="mt-3 text-center text-sm font-medium text-green-600">
                    ✓ Đã sao chép!
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Amount Selection & Transaction Info */}
            <div className="space-y-6">
              {/* Amount Selection */}
              <div className="rounded-2xl bg-white p-6 shadow-xl">
                <h3 className="mb-6 text-xl font-bold text-gray-800">
                  Chọn số tiền nạp
                </h3>

                <div className="mb-6 grid grid-cols-2 gap-3">
                  {amounts.map((amt) => (
                    <button
                      key={amt}
                      className={`rounded-xl border-2 p-4 transition-all duration-200 ${
                        amt === amount
                          ? "scale-105 border-blue-500 bg-blue-50 text-blue-700 shadow-lg"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                      onClick={() => setAmount(amt)}
                    >
                      <div className="font-bold">{amt.toLocaleString()}₫</div>
                      {amt >= 100000 && (
                        <div className="mt-1 text-xs text-green-600">
                          +
                          {amt >= 2000000
                            ? "25%"
                            : amt >= 1000000
                              ? "20%"
                              : "10%"}
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Hoặc nhập số tiền tùy chỉnh
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full rounded-xl border-2 border-gray-200 p-4 text-lg font-semibold focus:border-blue-500 focus:outline-none"
                    placeholder="Nhập số tiền..."
                    min="10000"
                  />
                </div>
              </div>

              {/* Transaction Summary */}
              <div className="rounded-2xl bg-white p-6 shadow-xl">
                <h3 className="mb-6 text-xl font-bold text-gray-800">
                  Chi tiết giao dịch
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">Số tiền nạp:</span>
                    <span className="text-lg font-semibold">
                      {amount.toLocaleString()}₫
                    </span>
                  </div>

                  {bonus > 0 && (
                    <div className="flex items-center justify-between rounded-lg bg-green-50 px-3 py-2">
                      <span className="text-gray-600">Khuyến mãi:</span>
                      <span className="text-lg font-semibold text-green-600">
                        +{bonus.toLocaleString()}₫
                      </span>
                    </div>
                  )}

                  <div className="border-t-2 border-dashed border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-800">
                        Tổng nhận được:
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {finalReceive.toLocaleString()}₫
                      </span>
                    </div>
                  </div>
                </div>

                {/* Transaction ID */}
                {maGiaoDich && (
                  <div className="mt-6 rounded-lg bg-gray-50 p-4">
                    <div className="mb-1 flex items-center space-x-2 text-sm text-gray-600">
                      <Info className="h-4 w-4" />
                      <span>Mã giao dịch</span>
                    </div>
                    <div className="font-mono font-semibold text-gray-800">
                      {maGiaoDich}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Button */}
              <div className="rounded-2xl bg-white p-6 shadow-xl">
                 <button
              disabled={!maGiaoDich}
              onClick={() =>
                navigate(`/banking-confirm?ma_giao_dich=${maGiaoDich}`)
              }
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
            >
              Tôi đã chuyển khoản
            </button>

                <p className="mt-3 text-center text-xs text-gray-500">
                  Nhấn nút này sau khi đã hoàn tất chuyển khoản
                </p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
            <h4 className="mb-3 flex items-center space-x-2 font-bold text-yellow-800">
              <Info className="h-5 w-5" />
              <span>Lưu ý quan trọng</span>
            </h4>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li>
                • Vui lòng chuyển khoản đúng số tiền và nội dung để được xử lý
                tự động
              </li>
              <li>• Giao dịch sẽ được xử lý trong vòng 1-5 phút</li>
              <li>• Liên hệ hotline nếu gặp vấn đề: 1900 0000</li>
              <li>• Không chia sẻ mã giao dịch cho người khác</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BankingPayment;
