import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import {
    MapPin, Calendar, DollarSign, User, Phone, Mail, Eye,
    FileText, AlertCircle, CheckCircle, Clock, Wifi, Car,
    Shield, Building2, MessageCircle, Zap, Droplet, Home
} from 'lucide-react';

export default function HouseList() {
    const [activeItem, setActiveItem] = useState('my-rental');

    const myRentals = [
        {
            id: 1,
            propertyName: 'Chung cư Mini HOME CONVENIENT',
            address: '92 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM',
            roomNumber: 'Phòng 101',
            monthlyRent: 15_000_000,
            deposit: 30_000_000,
            startDate: '2024-01-15',
            endDate: '2025-01-14',
            status: 'active',
            landlord: {
                name: 'Nguyễn Văn An',
                phone: '0901234567',
                email: 'nguyenvana@email.com',
            },
            amenities: ['wifi', 'parking', 'security'],
            area: '75m²',
            lastPayment: '2024-11-01',
            nextPayment: '2024-12-01',
            contractFile: 'hop-dong-thue-nha.pdf',
            unpaidBills: 2,
            bills: [
                { type: 'electricity', amount: 320000, period: '11/2024', status: 'unpaid' },
                { type: 'water', amount: 110000, period: '11/2024', status: 'unpaid' },
                { type: 'rent', amount: 15000000, period: '12/2024', status: 'pending' }
            ]
        },
        // ... (other rental data)
    ];

    const formatCurrency = (v) => new Intl.NumberFormat('vi-VN').format(v) + 'đ';
    const formatDate = (s) => new Date(s).toLocaleDateString('vi-VN');

    const statusBadge = {
        active: (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Đang thuê
            </span>
        ),
        expired: (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <AlertCircle className="h-3 w-3 mr-1" />
                Hết hạn
            </span>
        ),
    };

    const amenityIcon = {
        wifi: <Wifi className="h-4 w-4 text-blue-600" />,
        parking: <Car className="h-4 w-4 text-green-600" />,
        security: <Shield className="h-4 w-4 text-purple-600" />,
    };

    const billTypeIcon = {
        electricity: <Zap className="h-4 w-4 text-yellow-500" />,
        water: <Droplet className="h-4 w-4 text-blue-400" />,
        rent: <Home className="h-4 w-4 text-green-500" />
    };

    const RentalCard = ({ rental }) => (
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {rental.propertyName}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{rental.address}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                        <strong>Phòng:</strong> {rental.roomNumber} •{' '}
                        <strong>Diện tích:</strong> {rental.area}
                    </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                    {statusBadge[rental.status]}
                    {rental.unpaidBills > 0 && (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                            {rental.unpaidBills} hóa đơn chưa TT
                        </span>
                    )}
                </div>
            </div>

            {/* Giá cả */}
            <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                    <p className="text-sm text-gray-600 mb-1">Tiền thuê hàng tháng</p>
                    <p className="text-lg font-bold text-green-600">
                        {formatCurrency(rental.monthlyRent)}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-600 mb-1">Tiền cọc</p>
                    <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(rental.deposit)}
                    </p>
                </div>
            </div>

            {/* Danh sách hóa đơn */}
            {rental.bills && rental.bills.length > 0 && (
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Hóa đơn gần đây:</h4>
                    <div className="space-y-2">
                        {rental.bills.map((bill, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                                <div className="flex items-center">
                                    {billTypeIcon[bill.type]}
                                    <span className="ml-2 text-sm">
                                        {bill.type === 'electricity' ? 'Điện' : 
                                         bill.type === 'water' ? 'Nước' : 'Tiền phòng'} {bill.period}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <span className={`text-sm font-medium ${
                                        bill.status === 'paid' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {formatCurrency(bill.amount)}
                                    </span>
                                    <Link 
                                        to={`/${bill.type === 'electricity' ? 'ElectricityBill' : 
                                            bill.type === 'water' ? 'WaterTicket' : 'RentBill'}`}
                                        className="ml-3 text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Thời gian */}
            <div className="flex items-center justify-between mb-4 p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">
                        <strong>Từ:</strong> {formatDate(rental.startDate)}
                    </span>
                </div>
                <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">
                        <strong>Đến:</strong> {formatDate(rental.endDate)}
                    </span>
                </div>
            </div>

            {/* Tiện ích */}
            <div className="flex items-center space-x-3 mb-4">
                <span className="text-sm font-medium text-gray-700">Tiện ích:</span>
                <div className="flex space-x-2">
                    {rental.amenities.map((a) => (
                        <div key={a}>{amenityIcon[a]}</div>
                    ))}
                </div>
            </div>

            {/* Chủ nhà */}
            <div className="border-t pt-4 mb-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Thông tin chủ nhà</p>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-1" />
                        <span>{rental.landlord.name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-1" />
                        <span>{rental.landlord.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-1" />
                        <span>{rental.landlord.email}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
                <Link 
                    to="/RentHouse/RentalRoomDetail" 
                    className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                >
                    <Eye className="h-4 w-4 mr-1" />
                    Xem chi tiết
                </Link>
                <Link 
                to="/Contract"
                className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors">
                    <FileText className="h-4 w-4 mr-1" />
                    Hợp đồng
                </Link>
                <Link 
                    to="/RentHouse/RoomRentBill" 
                    className="flex items-center px-3 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm hover:bg-orange-200 transition-colors"
                >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Tiền phòng
                </Link>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

            {/* Content */}
            <main className="flex-1 overflow-auto p-6">
                {/* Header */}
                <header className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Nhà đang thuê</h1>
                    <p className="text-gray-600">Quản lý thông tin các căn nhà bạn đang thuê</p>
                </header>

                {/* Quick stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Đang thuê</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {myRentals.filter((r) => r.status === 'active').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Hóa đơn chưa TT</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {myRentals.reduce((sum, r) => sum + r.unpaidBills, 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Tổng tiền thuê</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {formatCurrency(
                                        myRentals
                                            .filter((r) => r.status === 'active')
                                            .reduce((sum, r) => sum + r.monthlyRent, 0)
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <Zap className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Hóa đơn điện</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {myRentals
                                        .filter((r) => r.status === 'active')
                                        .reduce((sum, r) => sum + (r.bills?.filter(b => b.type === 'electricity').length || 0), 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rental list */}
                <section className="space-y-6">
                    {myRentals.map((r) => (
                        <RentalCard key={r.id} rental={r} />
                    ))}

                    {myRentals.length === 0 && (
                        <div className="text-center py-12">
                            <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có nhà thuê</h3>
                            <p className="text-gray-600">
                                Bạn chưa thuê nhà nào. Hãy tìm kiếm và thuê ngôi nhà phù hợp.
                            </p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}