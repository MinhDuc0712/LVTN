
import React, { useState } from 'react';
import Sidebar from './Sidebar';

import {
    Eye,
    FileText,
    Calendar,
    DollarSign,
    MapPin,
    Phone,
    User,
    Home,
    Clock,
    AlertCircle,
    CheckCircle,
    Download,
    MessageCircle,
} from 'lucide-react';

export default function TenantContractView() {
    /* ---------------- STATE ---------------- */
    const [activeItem, setActiveItem] = useState('contract');
    const [activeTab, setActiveTab] = useState('list');
    const [selectedContract, setSelectedContract] = useState(null);

    /* ---------- DEMO DATA (thay bằng API sau) ---------- */
    const currentTenant = {
        name: 'Nguyễn Văn An',
        phone: '0909123456',
        email: 'nguyenvanan@email.com',
        idCard: '123456789',
    };

    const contracts = [
        {
            id: 1,
            contractNumber: 'HD001',
            houseName: 'Chung cư Mini HOME CONVENIENT',
            address: '180 Cao Lỗ Phường 4 Quận 8 TP.HCM',
            landlord: {
                name: 'HOME CONVENIENT',
                phone: '0908765432',
            },
            startDate: '2024-01-15',
            endDate: '2024-12-31',
            monthlyRent: 15000000,
            deposit: 30000000,
            status: 'active',
            paymentStatus: 'paid',
            nextPaymentDate: '2024-07-15',
            roomType: 'Phòng 101',
            area: '75m²',
            utilities:
                'Điện: 4,000đ/số, Nước: 25,000đ/m³, Internet: 300,000đ/tháng, Phí quản lý: 500,000đ/tháng',
            terms:
                'Không được nuôi thú cưng, không hút thuốc trong nhà, báo trước 1 tháng khi chấm dứt hợp đồng.',
        },
        {
            id: 2,
            contractNumber: 'HD002',
            houseName: 'Chung cư Mini HOME CONVENIENT',
            address: '180 Cao Lỗ Phường 4 Quận 8 TP.HCM',
            landlord: {
                name: 'HOME CONVENIENT',
                phone: '0908765432',
            },
            startDate: '2023-06-01',
            endDate: '2024-05-31',
            monthlyRent: 25000000,
            deposit: 50000000,
            status: 'expired',
            paymentStatus: 'completed',
            nextPaymentDate: null,
            roomType: 'Phòng 103',
            area: '120m²',
            utilities:
                'Điện: 3,800đ/số, Nước: 22,000đ/m³, Internet: 400,000đ/tháng',
            terms:
                'Có thể nuôi thú cưng nhỏ, không tổ chức tiệc tùng sau 22h, bảo trì định kỳ 6 tháng/lần.',
        },
        {
            id: 3,
            contractNumber: 'HD003',
            houseName: 'Chung cư Mini HOME CONVENIENT',
            address: '180 Cao Lỗ Phường 4 Quận 8 TP.HCM',
            landlord: {
                name: 'HOME CONVENIENT',
                phone: '0908765432',
            },
            startDate: '2024-03-01',
            endDate: '2025-02-28',
            monthlyRent: 12000000,
            deposit: 24000000,
            status: 'active',
            paymentStatus: 'pending',
            nextPaymentDate: '2024-07-01',
            roomType: 'Phòng 202',
            area: '45m²',
            utilities:
                'Điện: 4,200đ/số, Nước: 30,000đ/m³, Internet miễn phí, Phí quản lý: 300,000đ/tháng',
            terms:
                'Không hút thuốc, giữ gìn vệ sinh chung, thanh toán đúng hạn.',
        },
    ];


    /* ---------- HELPERS ---------- */
    const formatCurrency = (v) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
    const formatDate = (s) => new Date(s).toLocaleDateString('vi-VN');
    const daysUntil = (d) => Math.ceil((new Date(d) - new Date()) / 8.64e7); // ms⇢day

    const statusColor = {
        active: 'bg-green-100 text-green-800',
        expired: 'bg-gray-100 text-gray-800',
        pending: 'bg-yellow-100 text-yellow-800',
    };
    const statusText = {
        active: 'Đang hiệu lực',
        expired: 'Đã hết hạn',
        pending: 'Chờ xử lý',
    };

    const payColor = {
        paid: 'bg-green-100 text-green-800',
        pending: 'bg-red-100 text-red-800',
        completed: 'bg-blue-100 text-blue-800',
    };
    const payText = {
        paid: 'Đã thanh toán',
        pending: 'Chưa thanh toán',
        completed: 'Hoàn thành',
    };

    /* ---------------- SUB COMPONENTS ---------------- */
    const ContractCard = (c) => {
        const soon = daysUntil(c.endDate) <= 30 && daysUntil(c.endDate) > 0;

        return (
            <div
                key={c.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
                {/* ---- Header ---- */}
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <Home size={24} className="text-blue-600" />
                            <div>
                                <h3 className="font-semibold text-lg text-gray-800">{c.houseName}</h3>
                                <p className="text-sm text-gray-600">Mã HĐ: {c.contractNumber}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[c.status]}`}>
                                {statusText[c.status]}
                            </span>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${payColor[c.paymentStatus]}`}
                            >
                                {payText[c.paymentStatus]}
                            </span>
                        </div>
                    </div>

                    {/* ---- Warning sắp hết hạn ---- */}
                    {soon && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
                            <div className="flex items-center text-sm text-yellow-700">
                                <AlertCircle size={16} className="mr-2" />
                                Hợp đồng sẽ hết hạn trong {daysUntil(c.endDate)} ngày (
                                {formatDate(c.endDate)})
                            </div>
                        </div>
                    )}

                    {/* ---- Info grid ---- */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 text-gray-600">
                        <div className="flex gap-2">
                            <MapPin size={16} />
                            <div>
                                <p className="font-medium text-sm">{c.roomType}</p>
                                <p className="text-xs">{c.address}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Calendar size={16} />
                            <div>
                                <p className="font-medium text-sm">Thời hạn</p>
                                <p className="text-xs">
                                    {formatDate(c.startDate)} – {formatDate(c.endDate)}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <DollarSign size={16} />
                            <div>
                                <p className="font-medium text-sm">{formatCurrency(c.monthlyRent)}/tháng</p>
                                <p className="text-xs">Diện tích: {c.area}</p>
                            </div>
                        </div>
                    </div>

                    {/* ---- Owner + next payment ---- */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex gap-1 items-center">
                            <Phone size={14} />
                            Chủ nhà: {c.landlord.name}
                        </span>
                        <span className="flex gap-1 items-center">
                            <Phone size={14} />
                            {c.landlord.phone}
                        </span>
                        {c.nextPaymentDate && (
                            <span className="flex gap-1 items-center">
                                <Clock size={14} />
                                Thanh toán tiếp: {formatDate(c.nextPaymentDate)}
                            </span>
                        )}
                    </div>

                    {/* ---- Payment warning ---- */}
                    {c.status === 'active' && c.paymentStatus === 'pending' && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-4 text-sm text-red-700">
                            <AlertCircle size={16} className="mr-2 inline" />
                            Bạn có khoản thanh toán chưa hoàn thành. Vui lòng thanh toán trước ngày{' '}
                            {formatDate(c.nextPaymentDate)}.
                        </div>
                    )}
                </div>

                {/* ---- Footer buttons ---- */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex gap-2">
                    <button
                        onClick={() => {
                            setSelectedContract(c);
                            setActiveTab('view');
                        }}
                        className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg flex items-center justify-center gap-1 text-sm transition-colors"
                    >
                        <Eye size={16} />
                        Xem chi tiết
                    </button>
                    <button className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg flex items-center justify-center gap-1 text-sm transition-colors">
                        <Download size={16} />
                        Tải HĐ
                    </button>
                    <button className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 rounded-lg flex items-center justify-center gap-1 text-sm transition-colors">
                        <MessageCircle size={16} />
                        Liên hệ
                    </button>
                </div>
            </div>
        );
    };

    const ContractList = () => (
        <section className="space-y-6">
            {/* ---- Tenant info ---- */}
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <User size={24} className="text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-800">Thông tin cá nhân</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-gray-600 text-sm">
                    <p><strong>Họ tên:</strong> {currentTenant.name}</p>
                    <p><strong>Số điện thoại:</strong> {currentTenant.phone}</p>
                    <p><strong>Email:</strong> {currentTenant.email}</p>
                    <p><strong>CMND/CCCD:</strong> {currentTenant.idCard}</p>
                </div>
            </div>

            {/* ---- List heading ---- */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Danh sách hợp đồng thuê nhà</h2>
                <span className="text-sm text-gray-600">Tổng: {contracts.length} hợp đồng</span>
            </div>

            {/* ---- Cards ---- */}
            <div className="grid gap-6">
                {contracts.map((c) => ContractCard(c))}
                {contracts.length === 0 && (
                    <div className="text-center py-12">
                        <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium text-gray-600 mb-2">Chưa có hợp đồng nào</h3>
                        <p className="text-gray-500">
                            Bạn chưa có hợp đồng thuê nhà nào được ghi nhận trong hệ thống.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );

    /* ---------- VIEW CONTRACT (tab “view”) ---------- */
    const ViewContract = () => {
        if (!selectedContract) return null;
        const c = selectedContract;                       // rút gọn tên biến

        return (
            <section className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl border border-gray-200 shadow-lg">
                    {/* ---- Panel header ---- */}
                    <div className="px-6 py-4 border-b flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Chi tiết hợp đồng thuê nhà
                        </h2>
                        <button
                            onClick={() => setActiveTab('list')}
                            className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            ← Quay lại
                        </button>
                    </div>

                    {/* ---- Main body ---- */}
                    <div className="p-6 space-y-8">
                        {/* Heading + badges */}
                        <div className="text-center pb-6 border-b">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">HỢP ĐỒNG THUÊ NHÀ</h1>
                            <p className="text-gray-600">Số hợp đồng: {c.contractNumber}</p>

                            <div className="flex justify-center gap-4 mt-4">
                                <span
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${statusColor[c.status]}`}
                                >
                                    {statusText[c.status]}
                                </span>
                                <span
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${payColor[c.paymentStatus]}`}
                                >
                                    {payText[c.paymentStatus]}
                                </span>
                            </div>
                        </div>

                        {/* Two‑column: landlord / tenant */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                    Thông tin bên cho thuê
                                </h3>
                                <div className="space-y-2 text-gray-600">
                                    <p><strong>Tên:</strong> {c.landlord.name}</p>
                                    <p><strong>Điện thoại:</strong> {c.landlord.phone}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                    Thông tin bên thuê
                                </h3>
                                <div className="space-y-2 text-gray-600">
                                    <p><strong>Tên:</strong> {currentTenant.name}</p>
                                    <p><strong>CMND/CCCD:</strong> {currentTenant.idCard}</p>
                                    <p><strong>Điện thoại:</strong> {currentTenant.phone}</p>
                                    <p><strong>Email:</strong> {currentTenant.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Asset info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                Thông tin tài sản cho thuê
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="font-medium text-lg text-gray-800">{c.houseName}</p>
                                <p className="text-gray-600 mt-1">{c.address}</p>
                                <div className="grid md:grid-cols-2 gap-4 mt-3 text-gray-600">
                                    <p><strong>Loại:</strong> {c.roomType}</p>
                                    <p><strong>Diện tích:</strong> {c.area}</p>
                                </div>
                            </div>
                        </div>

                        {/* Contract & financial terms */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                    Thời hạn hợp đồng
                                </h3>
                                <div className="space-y-2 text-gray-600">
                                    <p><strong>Từ ngày:</strong> {formatDate(c.startDate)}</p>
                                    <p><strong>Đến ngày:</strong> {formatDate(c.endDate)}</p>
                                    {c.status === 'active' && (
                                        <p><strong>Còn lại:</strong> {daysUntil(c.endDate)} ngày</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                    Điều khoản tài chính
                                </h3>
                                <div className="space-y-2 text-gray-600">
                                    <p><strong>Tiền thuê:</strong> {formatCurrency(c.monthlyRent)}/tháng</p>
                                    <p><strong>Tiền cọc:</strong> {formatCurrency(c.deposit)}</p>
                                    {c.nextPaymentDate && (
                                        <p><strong>Thanh toán tiếp:</strong> {formatDate(c.nextPaymentDate)}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Utilities & Terms */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                Chi phí tiện ích
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4 text-gray-600">
                                {c.utilities}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                Điều khoản hợp đồng
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4 text-gray-600">
                                {c.terms}
                            </div>
                        </div>

                        {/* ------- BILLS (nếu có) ------- */}
                        {c.bills && c.bills.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                    Chi tiết hóa đơn
                                </h3>
                                <table className="w-full text-sm text-left border">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-2">Tháng</th>
                                            <th className="p-2">Trạng thái</th>
                                            <th className="p-2 text-right">Tổng tiền</th>
                                            <th className="p-2">Ngày thanh toán</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {c.bills.map((b) => (
                                            <tr key={b.id} className="border-t">
                                                <td className="p-2">{b.month}</td>
                                                <td className="p-2">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${b.status === 'paid'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-yellow-100 text-yellow-700'
                                                            }`}
                                                    >
                                                        {b.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                                    </span>
                                                </td>
                                                <td className="p-2 text-right">
                                                    {formatCurrency(b.items.reduce((sum, i) => sum + i.amount, 0))}
                                                </td>
                                                <td className="p-2">
                                                    {b.paidDate ? formatDate(b.paidDate) : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* ---- Action buttons ---- */}
                        <div className="flex gap-4 pt-6 border-t">
                            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                <Download size={20} />
                                Tải xuống hợp đồng
                            </button>
                            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                <MessageCircle size={20} />
                                Liên hệ chủ nhà
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    };


    /* ---------------- MAIN RETURN ---------------- */
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

            {/* ----- Content tràn phải, cuộn độc lập ----- */}

            <div className="flex-1 overflow-auto">
                <div className="flex-1 overflow-auto p-6">
                    <header className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Hợp đồng thuê nhà của tôi
                        </h1>
                        <p className="text-gray-600">
                            Xem và quản lý các hợp đồng thuê nhà hiện tại của bạn
                        </p>
                    </header>

                    {activeTab === 'list' ? <ContractList /> : <ViewContract />}
                </div>
            </div>
        </div>
    );
}
