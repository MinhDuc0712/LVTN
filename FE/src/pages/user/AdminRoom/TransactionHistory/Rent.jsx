import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { 
  ArrowLeft, Home, Calendar, DollarSign, FileText,
  CheckCircle, AlertCircle, Search, Filter,
  Printer, Download, ChevronDown, TrendingUp, Clock
} from 'lucide-react';

const UserRentPaymentHistory = () => {
  const [activeItem, setActiveItem] = useState('payment-history');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentRoom, setCurrentRoom] = useState({
    id: '401',
    name: 'Phòng 401',
    address: '180 Cao Lỗ, P.4, Q.8, TP.HCM',
    contractNumber: 'HD-2023-401'
  });
  
  // Dữ liệu lịch sử thanh toán tiền nhà
  const paymentHistory = [
    {
      id: 1,
      period: '11/2023',
      issueDate: '25/10/2023',
      dueDate: '05/11/2023',
      paymentDate: '03/11/2023',
      amount: 4500000,
      serviceFee: 200000,
      total: 4700000,
      status: 'paid',
      receiptNumber: 'PT-1123-401',
      paymentMethod: 'Chuyển khoản'
    },
    {
      id: 2,
      period: '12/2023',
      issueDate: '25/11/2023',
      dueDate: '05/12/2023',
      paymentDate: '01/12/2023',
      amount: 4500000,
      serviceFee: 200000,
      total: 4700000,
      status: 'paid',
      receiptNumber: 'PT-1223-401',
      paymentMethod: 'Tiền mặt'
    },
    {
      id: 3,
      period: '01/2024',
      issueDate: '25/12/2023',
      dueDate: '05/01/2024',
      paymentDate: null,
      amount: 4500000,
      serviceFee: 200000,
      total: 4700000,
      status: 'unpaid',
      receiptNumber: 'PT-0124-401',
      paymentMethod: null
    },
  ];

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const filteredPayments = paymentHistory.filter(payment => 
    payment.period.toLowerCase().includes(searchTerm.toLowerCase()) || 
    payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusBadge = {
    paid: (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Đã thanh toán
      </span>
    ),
    unpaid: (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <AlertCircle className="h-3 w-3 mr-1" />
        Chưa thanh toán
      </span>
    ),
    late: (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="h-3 w-3 mr-1" />
        Trễ hạn
      </span>
    )
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar User */}
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <div>
              <Link to="/HouseList" className="flex items-center text-blue-600 hover:text-blue-800 mb-2">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Quay lại trang chủ
              </Link>
              <h1 className="text-2xl font-bold flex items-center">
                <Home className="w-6 h-6 text-green-600 mr-2" />
                Lịch sử thanh toán tiền nhà
              </h1>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Printer className="w-5 h-5" />
                In
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-5 h-5" />
                Xuất file
              </button>
            </div>
          </div>

          {/* Current Room Info */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-lg font-semibold flex items-center">
                  <Home className="w-5 h-5 text-green-600 mr-2" />
                  {currentRoom.name}
                </h2>
                <div className="text-sm text-gray-600 mt-1">
                  <p>{currentRoom.address}</p>
                  <p className="mt-1">Số hợp đồng: {currentRoom.contractNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  value={currentRoom.id}
                  onChange={(e) => setCurrentRoom({
                    id: e.target.value,
                    name: `Phòng ${e.target.value}`,
                    address: currentRoom.address,
                    contractNumber: `HD-2023-${e.target.value}`
                  })}
                >
                  <option value="401">Phòng 401</option>
                  <option value="402">Phòng 402</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm theo kỳ hoặc số phiếu thu..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-gray-400 w-5 h-5" />
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  defaultValue="last6"
                >
                  <option value="all">Tất cả thời gian</option>
                  <option value="last6">6 tháng gần nhất</option>
                  <option value="2023">Năm 2023</option>
                  <option value="2024">Năm 2024</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Tổng phiếu thu</p>
                  <p className="text-xl font-bold text-gray-900">
                    {filteredPayments.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Tổng đã thanh toán</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatPrice(filteredPayments
                      .filter(p => p.status === 'paid')
                      .reduce((sum, p) => sum + p.total, 0))}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Công nợ hiện tại</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatPrice(filteredPayments
                      .filter(p => p.status === 'unpaid')
                      .reduce((sum, p) => sum + p.total, 0))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Kỳ thanh toán
                        <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số phiếu thu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tiền phòng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng cộng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payment.period}</div>
                          <div className="text-sm text-gray-500">
                            Hạn: {payment.dueDate}
                            {payment.paymentDate && (
                              <span className="ml-2">• Thanh toán: {payment.paymentDate}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.receiptNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatPrice(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatPrice(payment.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {statusBadge[payment.status]}
                          {payment.paymentMethod && (
                            <div className="text-xs text-gray-500 mt-1">{payment.paymentMethod}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/User/RentReceipt/${payment.id}`}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Chi tiết
                          </Link>
                          {payment.status === 'unpaid' && (
                            <button className="text-green-600 hover:text-green-900">
                              Thanh toán
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        Không tìm thấy phiếu thu nào phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              Tổng quan thanh toán
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Thông tin hợp đồng</h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Tiền phòng:</span> {formatPrice(4500000)}/tháng
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Phí dịch vụ:</span> {formatPrice(200000)}/tháng
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Ngày thanh toán:</span> 05 hàng tháng
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Phương thức thanh toán</h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Ngân hàng:</span> Vietcombank
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Số tài khoản:</span> 123456789
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Chủ tài khoản:</span> CÔNG TY QUẢN LÝ HOME CONVENIENT
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Notice */}
          {filteredPayments.some(p => p.status === 'unpaid') && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    Bạn có <strong>{filteredPayments.filter(p => p.status === 'unpaid').length} phiếu thu tiền phòng</strong> chưa thanh toán. 
                    Vui lòng thanh toán trước ngày <strong>05/{new Date().getMonth() + 2}/{new Date().getFullYear()}</strong> để tránh bị phạt trễ hạn 1%/ngày.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRentPaymentHistory;