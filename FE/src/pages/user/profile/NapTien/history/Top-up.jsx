import Sidebar from "../../Sidebar";
import { Link } from "react-router-dom";
import { useGetDepositTransactions } from "@/api/homePage";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { checkStatus } from "@/api/homePage";

const PAYMENT_METHODS = {
  Banking: "Chuyển khoản ngân hàng",
  // MoMo: "Ví MoMo",
  ZaloPay: "Ví ZaloPay",
  // ViettelPay: "Ví ViettelPay"
};

function HistoryTopUp() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    data: allTransactions = [],
    isLoading,
    isError,
    error,
  } = useGetDepositTransactions({
    ma_nguoi_dung: user?.MaNguoiDung,
  });

  useEffect(() => {
    const verifyPendingZaloTransactions = async () => {
      const pendingZaloTxs = allTransactions.filter(
        (tx) => tx.trang_thai === "Đang xử lý" && tx.phuong_thuc === "ZaloPay",
      );

      await Promise.all(
        pendingZaloTxs.map(async (tx) => {
          try {
            const res = await checkStatus(tx.ma_giao_dich);
            if (res?.data?.status === "success") {
              toast.success(`Giao dịch ${tx.ma_giao_dich} đã hoàn tất.`);
            } else if (res?.data?.status === "failed") {
              toast.error(`Giao dịch ${tx.ma_giao_dich} thất bại.`);
            } else {
              toast.info(`Giao dịch ${tx.ma_giao_dich} đang xử lý...`);
            }
          } catch (err) {
            console.error("Lỗi khi xác minh ZaloPay:", err);
          }
        }),
      );
    };

    if (allTransactions.length > 0) {
      verifyPendingZaloTransactions();
    }
    setTimeout(() => {
      verifyPendingZaloTransactions();
    }, 10000);

  }, [allTransactions]);

  useEffect(() => {
    if (isError) {
      toast.error("Có lỗi khi tải lịch sử nạp tiền");
    }
  }, [isError, error]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleTimeString("vi-VN") + " " + date.toLocaleDateString("vi-VN")
    );
  };

  const getPaymentMethod = (method) => {
    return PAYMENT_METHODS[method] || method || "N/A";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Hoàn tất":
        return (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Hoàn tất
          </span>
        );
      case "Đang xử lý":
        return (
          <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            Đang xử lý
          </span>
        );
      case "Hủy bỏ":
        return (
          <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            Hủy bỏ
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            N/A
          </span>
        );
    }
  };

  const totalTransactions = allTransactions.length;
  const totalPages = Math.ceil(totalTransactions / pageSize);
  const paginatedTransactions = allTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 p-4 md:flex-row md:p-6">
      <Sidebar />
      <div className="w-full overflow-auto rounded-xl bg-white p-4 shadow-md md:w-3/4 md:p-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
            Lịch sử nạp tiền
          </h1>

          <div className="flex border-b border-gray-200">
            <div className="flex space-x-1">
              <Link to="/Top-up">
                <button className="px-4 py-3 text-gray-600 transition-colors duration-200 hover:text-blue-600">
                  Nạp tiền vào tài khoản
                </button>
              </Link>
              <Link to="/history/top-up">
                <button className="border-b-2 border-blue-600 px-4 py-3 font-medium text-blue-600">
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

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : isError ? (
            <div className="border-l-4 border-red-500 bg-red-50 p-4">
              <p className="text-sm text-red-700">
                Có lỗi khi tải dữ liệu. Vui lòng thử lại sau.
              </p>
            </div>
          ) : totalTransactions === 0 ? (
            <div className="rounded-lg bg-gray-50 py-12 text-center">
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Không có giao dịch nào
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Bạn chưa có giao dịch nạp tiền nào.
              </p>
              <div className="mt-6">
                <Link
                  to="/Top-up"
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  Nạp tiền ngay
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        TRẠNG THÁI
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        THỜI GIAN
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        SỐ TIỀN
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        KHUYẾN MÃI
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        THỰC NHẬN
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        PHƯƠNG THỨC
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        MÃ GD
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {paginatedTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          {getStatusBadge(transaction.trang_thai)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(transaction.ngay_nap)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          +{formatCurrency(transaction.so_tien)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {transaction.khuyen_mai}%
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-600">
                          {formatCurrency(transaction.thuc_nhan)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {getPaymentMethod(transaction.phuong_thuc)}
                        </td>
                        <td className="px-6 py-4 font-mono text-sm text-gray-500">
                          {transaction.ma_giao_dich || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-2 text-sm text-gray-600">
                Tổng <strong>{totalTransactions}</strong> giao dịch
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-gray-700">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded border px-3 py-1 disabled:opacity-50"
                >
                  Trước
                </button>

                <span>
                  Trang <strong>{currentPage}</strong> / {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded border px-3 py-1 disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HistoryTopUp;
