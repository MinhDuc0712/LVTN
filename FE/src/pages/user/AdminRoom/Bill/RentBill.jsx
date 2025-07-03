import React, { useState } from 'react';
import { Printer, ArrowLeft, Download, Home, Key, Calendar, User, CreditCard, Wifi, Droplet, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar';

const RoomRentBill = () => {
  const [activeItem, setActiveItem] = useState('contract');
  const [activeTab, setActiveTab] = useState('list');
  const [selectedContract, setSelectedContract] = useState(null);
  
  const [bill, setBill] = useState({
    roomNumber: "Phòng 201",
    tenantName: "Nguyễn Văn A",
    period: "01/12/2023 - 31/12/2023",
    issueDate: "25/11/2023",
    dueDate: "05/12/2023",
    roomPrice: 4500000,
    electricityFee: 320000,
    waterFee: 110000,
    wifiFee: 100000,
    serviceFee: 50000,
    lateFee: 0,
    total: 5080000,
    paymentStatus: "Chưa thanh toán",
    paymentMethod: "",
    contractNumber: "HD-2023-201"
  });

  const handlePayment = () => {
    setBill(prev => ({
      ...prev,
      paymentStatus: "Đã thanh toán",
      paymentMethod: "Chuyển khoản"
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <Link to="/HouseList" className="flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Quay lại
            </Link>
            <div className="flex gap-3">
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Printer className="w-5 h-5" />
                In phiếu
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-5 h-5" />
                Tải PDF
              </button>
            </div>
          </div>

          {/* Bill Container */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            {/* Bill Header */}
            <div className="bg-blue-600 text-white p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold mb-1">PHIẾU THU TIỀN PHÒNG</h1>
                  <p className="text-blue-100">Chung cư mini HOME CONVENIENT</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-blue-100">Số hợp đồng: <span className="font-medium">{bill.contractNumber}</span></p>
                  <p className="text-blue-100">Ngày xuất: {bill.issueDate}</p>
                </div>
              </div>
            </div>

            {/* Bill Info */}
            <div className="p-6 border-b">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-sm text-gray-500">Phòng</h3>
                    <p className="font-medium">{bill.roomNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-sm text-gray-500">Khách hàng</h3>
                    <p className="font-medium">{bill.tenantName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-sm text-gray-500">Kỳ thu tiền</h3>
                    <p className="font-medium">{bill.period}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-yellow-500" />
                Dịch vụ phòng
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm text-gray-500">Tiền phòng</h3>
                  </div>
                  <p className="text-xl font-bold">{formatPrice(bill.roomPrice)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <h3 className="text-sm text-gray-500">Tiền điện</h3>
                  </div>
                  <p className="text-xl font-bold">{formatPrice(bill.electricityFee)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplet className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm text-gray-500">Tiền nước</h3>
                  </div>
                  <p className="text-xl font-bold">{formatPrice(bill.waterFee)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Wifi className="w-4 h-4 text-green-500" />
                    <h3 className="text-sm text-gray-500">Internet</h3>
                  </div>
                  <p className="text-xl font-bold">{formatPrice(bill.wifiFee)}</p>
                </div>
              </div>
            </div>

            {/* Bill Details */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4">Chi tiết thanh toán</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Dịch vụ</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Đơn giá</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3 border-b">Tiền phòng</td>
                      <td className="px-4 py-3 border-b text-right">{formatPrice(bill.roomPrice)}</td>
                      <td className="px-4 py-3 border-b text-right font-medium">{formatPrice(bill.roomPrice)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 border-b">Tiền điện</td>
                      <td className="px-4 py-3 border-b text-right">{formatPrice(bill.electricityFee)}</td>
                      <td className="px-4 py-3 border-b text-right font-medium">{formatPrice(bill.electricityFee)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 border-b">Tiền nước</td>
                      <td className="px-4 py-3 border-b text-right">{formatPrice(bill.waterFee)}</td>
                      <td className="px-4 py-3 border-b text-right font-medium">{formatPrice(bill.waterFee)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 border-b">Internet</td>
                      <td className="px-4 py-3 border-b text-right">{formatPrice(bill.wifiFee)}</td>
                      <td className="px-4 py-3 border-b text-right font-medium">{formatPrice(bill.wifiFee)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 border-b">Phí dịch vụ</td>
                      <td className="px-4 py-3 border-b text-right">{formatPrice(bill.serviceFee)}</td>
                      <td className="px-4 py-3 border-b text-right font-medium">{formatPrice(bill.serviceFee)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Phí trễ hạn</td>
                      <td className="px-4 py-3 text-right">-</td>
                      <td className="px-4 py-3 text-right font-medium">{formatPrice(bill.lateFee)}</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="2" className="px-4 py-3 text-right font-semibold">Tổng cộng:</td>
                      <td className="px-4 py-3 text-right font-bold text-blue-600 text-lg">{formatPrice(bill.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Payment Info */}
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-500" />
                Thông tin thanh toán
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-gray-500 mb-2">Trạng thái</h3>
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    bill.paymentStatus === "Đã thanh toán" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {bill.paymentStatus}
                  </div>
                  {bill.paymentMethod && (
                    <p className="mt-2 text-sm">Phương thức: {bill.paymentMethod}</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-2">Hạn thanh toán</h3>
                  <p className="font-medium">{bill.dueDate}</p>
                  {bill.paymentStatus === "Chưa thanh toán" && (
                    <button 
                      onClick={handlePayment}
                      className="mt-4 w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Thanh toán ngay
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
            <p className="font-medium">Điều khoản thanh toán:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Thanh toán trước ngày {bill.dueDate} để tránh phí trễ hạn</li>
              <li>Chấp nhận thanh toán bằng tiền mặt hoặc chuyển khoản</li>
              <li>Thông tin chuyển khoản: Vietcombank - 123456789 - CHUNG CƯ HOME CONVENIENT</li>
              <li>Mọi thắc mắc vui lòng liên hệ quản lý tòa nhà</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomRentBill;