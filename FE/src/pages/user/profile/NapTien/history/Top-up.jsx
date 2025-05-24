import Sidebar from '../../Sidebar';
import { Link } from 'react-router-dom';
import { useGetDepositTransactions } from '../../../../../api/homePage/queries';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../../../context/AuthContext';

const TRANSACTION_STATUS = {
  PENDING: "Đang xử lý",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Hủy bỏ",
};

const PAYMENT_METHODS = {
  Banking: "Chuyển khoản ngân hàng",
  MoMo: "Ví MoMo",
  ZaloPay: "Ví ZaloPay",
  ViettelPay: "Ví ViettelPay"
};

function HistoryTopUp() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  
  const { 
    data: transactionsData, 
    isLoading, 
    isError,
    error,
    isFetching
  } = useGetDepositTransactions({
    page: currentPage,
    ma_nguoi_dung: user?.MaNguoiDung,
    limit: 5,
  });

  useEffect(() => {
    if (isError) {
      toast.error('Có lỗi khi tải lịch sử nạp tiền');
    }
  }, [isError, error]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN') + ' ' + date.toLocaleDateString('vi-VN');
  };

  const getPaymentMethod = (method) => {
    return PAYMENT_METHODS[method] || method || 'N/A';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hoàn tất': return 'text-green-500';
      case 'Đang xử lý': return 'text-yellow-500';
      case 'Hủy bỏ': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const transactions = transactionsData || [];

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen p-4 md:p-6">
      <Sidebar />
      <div className="w-full md:w-3/4 p-4 md:p-6 bg-white rounded-lg shadow-lg overflow-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-700">Lịch sử nạp tiền</h1>

        <div className="border-b mb-6 space-x-4 justify-center flex">
          <Link to="/Top-up">
            <button className="px-4 py-2 text-gray-500 cursor-pointer hover:text-blue-500">
              Nạp tiền vào tài khoản
            </button>
          </Link>
          <Link to="/history/top-up">
            <button className="px-4 py-2 border-b-2 cursor-pointer border-blue-500 font-semibold text-blue-500">
              Lịch sử nạp tiền
            </button>
          </Link>
          <Link to="/history/payment">
            <button className="px-4 py-2 text-gray-500 cursor-pointer hover:text-blue-500">
              Lịch sử thanh toán
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Đang tải dữ liệu...</div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500">Có lỗi khi tải dữ liệu</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <p>Bạn chưa có giao dịch nạp tiền nào</p>
            <Link to="/Top-up" className="text-blue-500 hover:underline mt-2 inline-block">
              Nạp tiền ngay
            </Link>
          </div>
        ) : (
          <>
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">TRẠNG THÁI</th>
                  <th className="border p-2">THỜI GIAN</th>
                  <th className="border p-2">SỐ TIỀN</th>
                  <th className="border p-2">KHUYẾN MÃI</th>
                  <th className="border p-2">THỰC NHẬN</th>
                  <th className="border p-2">PHƯƠNG THỨC</th>
                  <th className="border p-2">MÃ GD</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => ( 
                  <tr key={transaction.id} className="border hover:bg-gray-50">
                    <td className={`border p-2 text-center ${getStatusColor(transaction.trang_thai)}`}>
                      {transaction.trang_thai}
                    </td>
                    <td className="border p-2 text-center">
                      {formatDate(transaction.ngay_nap)}
                    </td>
                    <td className="border p-2 text-right font-medium ">
                      +{formatCurrency(transaction.so_tien)}
                    </td>
                    <td className="border p-2 text-right">
                      {transaction.khuyen_mai}%
                    </td>
                    <td className="border p-2 text-right font-medium text-green-600">
                      {formatCurrency(transaction.thuc_nhan)}
                    </td>
                    <td className="border p-2 text-center">
                      {getPaymentMethod(transaction.phuong_thuc)}
                    </td>
                    <td className="border p-2 text-center text-sm">
                      {transaction.ma_giao_dich || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {transactionsData?.meta?.last_page > 1 && (
              <div className="flex justify-center mt-4">
                {Array.from({ length: transactionsData.meta.last_page }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`mx-1 px-3 py-1 rounded ${
                      currentPage === page 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default HistoryTopUp;