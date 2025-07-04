import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar';
import {
  AlertCircle, Zap, Droplet, Home, Bell,
  DollarSign, Calendar, Clock, ArrowRight, MapPin
} from 'lucide-react';

const UnpaidBillsAlert = () => {
  const [activeItem, setActiveItem] = useState('bills');
  
  // Dữ liệu hóa đơn chưa thanh toán
  const unpaidBills = [
    {
      id: 1,
      type: 'electricity',
      period: '01/2024',
      dueDate: '10/02/2024',
      amount: 320000,
      daysOverdue: 5,
      meterNumber: 'EM123456',
      roomNumber: 'A201'
    },
    {
      id: 2,
      type: 'water',
      period: '01/2024',
      dueDate: '15/02/2024',
      amount: 150000,
      daysOverdue: 0,
      meterNumber: 'WM789012',
      roomNumber: 'A201'
    },
    {
      id: 3,
      type: 'rent',
      period: '02/2024',
      dueDate: '05/03/2024',
      amount: 4500000,
      daysOverdue: -10, // Số ngày còn lại trước hạn
      meterNumber: null,
      roomNumber: 'A201'
    },
    {
      id: 4,
      type: 'electricity',
      period: '01/2024',
      dueDate: '12/02/2024',
      amount: 280000,
      daysOverdue: 3,
      meterNumber: 'EM654321',
      roomNumber: 'B305'
    }
  ];

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const getBillIcon = (type) => {
    switch(type) {
      case 'electricity':
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case 'water':
        return <Droplet className="h-5 w-5 text-blue-400" />;
      case 'rent':
        return <Home className="h-5 w-5 text-green-600" />;
      default:
        return <DollarSign className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBillTypeName = (type) => {
    switch(type) {
      case 'electricity':
        return 'Tiền điện';
      case 'water':
        return 'Tiền nước';
      case 'rent':
        return 'Tiền phòng';
      default:
        return 'Hóa đơn';
    }
  };

  const getDueStatus = (daysOverdue) => {
    if (daysOverdue > 0) {
      return {
        text: `Trễ ${daysOverdue} ngày`,
        color: 'text-red-600',
        bg: 'bg-red-50'
      };
    } else if (daysOverdue === 0) {
      return {
        text: 'Hôm nay',
        color: 'text-orange-600',
        bg: 'bg-orange-50'
      };
    } else {
      return {
        text: `Còn ${Math.abs(daysOverdue)} ngày`,
        color: 'text-blue-600',
        bg: 'bg-blue-50'
      };
    }
  };

  // Tính tổng số tiền cần thanh toán
  const totalAmount = unpaidBills.reduce((sum, bill) => {
    const lateFee = bill.daysOverdue > 0 ? bill.amount * 0.01 * bill.daysOverdue : 0;
    return sum + bill.amount + lateFee;
  }, 0);

  // Nhóm hóa đơn theo phòng
  const billsByRoom = unpaidBills.reduce((acc, bill) => {
    if (!acc[bill.roomNumber]) {
      acc[bill.roomNumber] = [];
    }
    acc[bill.roomNumber].push(bill);
    return acc;
  }, {});

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar User */}
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <Bell className="w-6 h-6 text-red-500 mr-2" />
              Cảnh báo hóa đơn chưa thanh toán
            </h1>
            <p className="text-gray-600">Danh sách các hóa đơn cần thanh toán</p>
          </div>

          {/* Summary Alert */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Bạn có {unpaidBills.length} hóa đơn chưa thanh toán từ {Object.keys(billsByRoom).length} phòng
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p className="font-medium">
                    Tổng số tiền cần thanh toán: {formatPrice(totalAmount)}
                  </p>
                  <p className="mt-1">
                    Vui lòng thanh toán sớm để tránh bị:
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Phạt trễ hạn 1%/ngày (với hóa đơn trễ hạn)</li>
                    <li>Ngưng cung cấp dịch vụ (sau 15 ngày quá hạn)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Unpaid Bills List - Grouped by Room */}
          <div className="space-y-6 mb-6">
            {Object.entries(billsByRoom).map(([roomNumber, bills]) => (
              <div key={roomNumber} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Room Header */}
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                    Phòng {roomNumber}
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      ({bills.length} hóa đơn)
                    </span>
                  </h2>
                </div>

                {/* Bills for this room */}
                <div className="divide-y divide-gray-200">
                  {bills.map((bill) => {
                    const dueStatus = getDueStatus(bill.daysOverdue);
                    const lateFee = bill.daysOverdue > 0 ? bill.amount * 0.01 * bill.daysOverdue : 0;
                    
                    return (
                      <div key={bill.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            <div className={`p-2 rounded-lg ${dueStatus.bg} mr-3`}>
                              {getBillIcon(bill.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center">
                                <h3 className="font-medium text-gray-900 mr-3">
                                  {getBillTypeName(bill.type)} - {bill.period}
                                </h3>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dueStatus.color} ${dueStatus.bg}`}>
                                  {dueStatus.text}
                                </span>
                              </div>
                              <div className="mt-1 text-sm text-gray-500">
                                <div className="flex items-center space-x-4">
                                  {bill.type !== 'rent' && (
                                    <span>Số đồng hồ: {bill.meterNumber}</span>
                                  )}
                                  <span>Hạn: {bill.dueDate}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                              <div className="mt-2 flex justify-between items-end">
                                <div>
                                  <p className=" mt-2 m-3 text-lg font-bold text-gray-900">
                                    {formatPrice(bill.amount)}
                                  </p>
                                  {bill.daysOverdue > 0 && (
                                    <p className="text-sm text-red-600 mt-1">
                                      Phí trễ hạn: {formatPrice(lateFee)}
                                    </p>
                                  )}
                                </div>
                                <Link
                                  to={`/User/Payment/${bill.type}/${bill.id}`}
                                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
                                >
                                  Thanh toán ngay <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                              </div>
                      </div>
                    );
                  })}
                </div>

                {/* Room Total */}
                <div className="bg-gray-50 px-4 py-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Tổng tiền phòng {roomNumber}:
                    </span>
                    <span className="text-lg font-bold text-red-600">
                      {formatPrice(bills.reduce((sum, bill) => {
                        const lateFee = bill.daysOverdue > 0 ? bill.amount * 0.01 * bill.daysOverdue : 0;
                        return sum + bill.amount + lateFee;
                      }, 0))}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <DollarSign className="w-5 h-5 text-green-600 mr-2" />
              Phương thức thanh toán
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Chuyển khoản ngân hàng</h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Ngân hàng:</span> Vietcombank
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Số TK:</span> 123456789
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Chủ TK:</span> CÔNG TY QUẢN LÝ HOME CONVENIENT
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Nội dung:</span> [SỐ PHÒNG] [LOẠI HÓA ĐƠN] [KỲ]
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Thanh toán trực tiếp</h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Địa điểm:</span> Văn phòng quản lý tòa nhà
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Thời gian:</span> 8:00 - 17:00 (T2-T6)
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Hỗ trợ:</span> 0901 234 567
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Lưu ý quan trọng</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Sau 15 ngày quá hạn, dịch vụ sẽ bị ngưng cung cấp</li>
                    <li>Phí trễ hạn 1%/ngày tính trên tổng số tiền</li>
                    <li>Vui lòng giữ lại biên lai sau khi thanh toán</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnpaidBillsAlert;