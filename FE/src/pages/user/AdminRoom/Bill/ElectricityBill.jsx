import React, { useState } from 'react';
import { Printer, ArrowLeft, Download, Home, Zap, Calendar, User, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar';

const ElectricityBill = () => {
  const [activeItem, setActiveItem] = useState('contract');
  const [activeTab, setActiveTab] = useState('list');
  const [selectedContract, setSelectedContract] = useState(null);
  
  const [bill, setBill] = useState({
    roomNumber: "Phòng 201",
    tenantName: "Nguyễn Văn A",
    period: "01/11/2025 - 30/11/2025",
    issueDate: "01/12/2025",
    dueDate: "10/07/2025",
    previousReading: 1250,
    currentReading: 1350,
    consumption: 100, // kWh
    unitPrice: 2500, // VND/kWh
    subtotal: 250000,
    lateFee: 0,
    total: 250000,
    paymentStatus: "Chưa thanh toán",
    paymentMethod: "",
    meterNumber: "EM12345678"
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
                In hóa đơn
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
                  <h1 className="text-2xl font-bold mb-1">HÓA ĐƠN TIỀN ĐIỆN</h1>
                  <p className="text-blue-100">Chung cư mini HOME CONVENIENT</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-blue-100">Mã hóa đơn: <span className="font-medium">EL-202311-201</span></p>
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
                    <h3 className="text-sm text-gray-500">Kỳ thanh toán</h3>
                    <p className="font-medium">{bill.period}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Meter Reading */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Chỉ số điện
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm text-gray-500 mb-1">Chỉ số cũ</h3>
                  <p className="text-2xl font-bold">{bill.previousReading} <span className="text-sm font-normal">kWh</span></p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm text-gray-500 mb-1">Chỉ số mới</h3>
                  <p className="text-2xl font-bold">{bill.currentReading} <span className="text-sm font-normal">kWh</span></p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm text-gray-500 mb-1">Điện tiêu thụ</h3>
                  <p className="text-2xl font-bold text-blue-600">{bill.consumption} <span className="text-sm font-normal">kWh</span></p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Mã công tơ: {bill.meterNumber}</p>
              </div>
            </div>

            {/* Bill Details */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4">Chi tiết thanh toán</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Mô tả</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Đơn giá</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Số lượng</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3 border-b">Tiền điện ({bill.consumption}kWh)</td>
                      <td className="px-4 py-3 border-b text-right">{bill.unitPrice.toLocaleString('vi-VN')} đ/kWh</td>
                      <td className="px-4 py-3 border-b text-right">{bill.consumption} kWh</td>
                      <td className="px-4 py-3 border-b text-right font-medium">{bill.subtotal.toLocaleString('vi-VN')} đ</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Phí trễ hạn</td>
                      <td className="px-4 py-3 text-right">-</td>
                      <td className="px-4 py-3 text-right">-</td>
                      <td className="px-4 py-3 text-right font-medium">{bill.lateFee.toLocaleString('vi-VN')} đ</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="3" className="px-4 py-3 text-right font-semibold">Tổng cộng:</td>
                      <td className="px-4 py-3 text-right font-bold text-blue-600 text-lg">{bill.total.toLocaleString('vi-VN')} đ</td>
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
          <div className="p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800">
            <p className="font-medium">Lưu ý:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Hóa đơn có hiệu lực trong vòng 10 ngày kể từ ngày xuất</li>
              <li>Mọi thắc mắc vui lòng liên hệ quản lý tòa nhà</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectricityBill;