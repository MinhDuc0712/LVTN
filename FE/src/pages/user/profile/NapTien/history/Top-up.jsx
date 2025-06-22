import Sidebar from '../../Sidebar';
import { Link } from 'react-router-dom';
import { useGetDepositTransactions } from '../../../../../api/homePage/queries';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../../../context/AuthContext';

const PAYMENT_METHODS = {
  Banking: "Chuyển khoản ngân hàng",
  MoMo: "Ví MoMo",
  ZaloPay: "Ví ZaloPay",
  ViettelPay: "Ví ViettelPay"
};

function HistoryTopUp() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const {
    data: allTransactions = [],
    isLoading,
    isError,
    error
  } = useGetDepositTransactions({
    ma_nguoi_dung: user?.MaNguoiDung
  });

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
    return date.toLocaleTimeString("vi-VN") + " " + date.toLocaleDateString("vi-VN");
  };

  const getPaymentMethod = (method) => {
    return PAYMENT_METHODS[method] || method || "N/A";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Hoàn tất":
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Hoàn tất</span>;
      case "Đang xử lý":
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Đang xử lý</span>;
      case "Hủy bỏ":
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Hủy bỏ</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">N/A</span>;
    }
  };

  const totalTransactions = allTransactions.length;
  const totalPages = Math.ceil(totalTransactions / pageSize);
  const paginatedTransactions = allTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen p-4 md:p-6">
      <Sidebar />
      <div className="w-full md:w-3/4 p-4 md:p-6 bg-white rounded-xl shadow-md overflow-auto">
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Lịch sử nạp tiền</h1>

          <div className="flex border-b border-gray-200">
            <div className="flex space-x-1">
              <Link to="/Top-up">
                <button className="px-4 py-3 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Nạp tiền vào tài khoản
                </button>
              </Link>
              <Link to="/history/top-up">
                <button className="px-4 py-3 border-b-2 border-blue-600 font-medium text-blue-600">
                  Lịch sử nạp tiền
                </button>
              </Link>
              <Link to="/history/payment">
                <button className="px-4 py-3 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Lịch sử thanh toán
                </button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : isError ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700">Có lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>
            </div>
          ) : totalTransactions === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="mt-2 text-lg font-medium text-gray-900">Không có giao dịch nào</h3>
              <p className="mt-1 text-sm text-gray-500">Bạn chưa có giao dịch nạp tiền nào.</p>
              <div className="mt-6">
                <Link
                  to="/Top-up"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TRẠNG THÁI</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">THỜI GIAN</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SỐ TIỀN</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">KHUYẾN MÃI</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">THỰC NHẬN</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PHƯƠNG THỨC</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ GD</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{getStatusBadge(transaction.trang_thai)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatDate(transaction.ngay_nap)}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">+{formatCurrency(transaction.so_tien)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{transaction.khuyen_mai}%</td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-600">{formatCurrency(transaction.thuc_nhan)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{getPaymentMethod(transaction.phuong_thuc)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">{transaction.ma_giao_dich || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-sm text-gray-600 px-2">
                Tổng <strong>{totalTransactions}</strong> giao dịch
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-gray-700">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Trước
                </button>

                <span>
                  Trang <strong>{currentPage}</strong> / {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
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
