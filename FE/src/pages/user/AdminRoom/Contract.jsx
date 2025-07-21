import { getUserContracts } from "@/api/homePage";
import { useAuth } from "@/context/AuthContext";
import {
    AlertCircle,
    Calendar,
    DollarSign,
    Download,
    Eye,
    FileText,
    Home,
    MessageCircle,
    User
} from "lucide-react";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
export default function TenantContractView() {
  /* ---------------- STATE ---------------- */
  const { user } = useAuth();
  const [activeItem, setActiveItem] = useState("contract");
  const [activeTab, setActiveTab] = useState("list");
  const [selectedContract, setSelectedContract] = useState(null);
  const [currentTenant, setCurrentTenant] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- FETCH DATA ---------- */
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.MaNguoiDung) {
        console.warn("User chưa sẵn sàng hoặc không có MaNguoiDung");
        return;
      }
      try {
        setLoading(true);
        const res = await getUserContracts(user.MaNguoiDung);
        // console.log("VCL:",res);
        setContracts(res.hopdongs);
        setCurrentTenant(res.khach);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  /* ---------- HELPERS ---------- */
  const formatCurrency = (v) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(v);
  const formatDate = (s) => new Date(s).toLocaleDateString("vi-VN");
  const daysUntil = (endDate) =>
    Math.ceil((new Date(endDate) - new Date()) / 8.64e7);

  const statusColor = {
    active: "bg-green-100 text-green-800",
    expired: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
  };
  const statusText = {
    active: "Đang hiệu lực",
    expired: "Đã hết hạn",
    pending: "Chờ xử lý",
  };

  const payColor = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
  };
  const payText = {
    paid: "Đã thanh toán",
    pending: "Chưa thanh toán",
    completed: "Hoàn thành",
  };

  /* ---------------- SUB COMPONENTS ---------------- */
  const ContractCard = (c) => {
    const soon = daysUntil(c.endDate) <= 30 && daysUntil(c.endDate) > 0;

    return (
      <div
        key={c.id}
        className="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
      >
        {/* ---- Header ---- */}
        <div className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Home size={24} className="text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {c.tenPhong}
                </h3>
                <p className="text-sm text-gray-600">Mã HĐ: {c.id}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[c.status]}`}
              >
                {statusText[c.status]}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${payColor[c.paymentStatus]}`}
              >
                {payText[c.paymentStatus]}
              </span>
            </div>
          </div>

          {/* ---- Warning sắp hết hạn ---- */}
          {soon && (
            <div className="mb-4 border-l-4 border-yellow-400 bg-yellow-50 p-3">
              <div className="flex items-center text-sm text-yellow-700">
                <AlertCircle size={16} className="mr-2" />
                Hợp đồng sẽ hết hạn trong {daysUntil(c.endDate)} ngày (
                {formatDate(c.endDate)})
              </div>
            </div>
          )}

          {/* ---- Info grid ---- */}
          <div className="mb-4 grid gap-4 text-gray-600 md:grid-cols-2 lg:grid-cols-2">
            {/* <div className="flex gap-2">
                <MapPin size={16} />
                <div>
                    <p className="text-sm font-medium">{c.roomType}</p>
                    <p className="text-xs">{c.address}</p>
                </div>
                </div> */}
            <div className="flex gap-2">
              <Calendar size={16} />
              <div>
                <p className="text-sm font-medium">Thời hạn</p>
                <p className="text-xs">
                  {formatDate(c.startDate)} – {formatDate(c.endDate)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <DollarSign size={16} />
              <div>
                <p className="text-sm font-medium">
                  {formatCurrency(c.tienThue)}/tháng
                </p>
                <p className="text-xs">Diện tích: {c.dienTich}</p>
              </div>
            </div>
          </div>

          {/* ---- Owner + next payment ---- */}
          {/* <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                <Phone size={14} />
                Chủ nhà: {c.landlord.name}
                </span>
                <span className="flex items-center gap-1">
                <Phone size={14} />
                {c.landlord.phone}
                </span>
                {c.nextPaymentDate && (
                <span className="flex items-center gap-1">
                    <Clock size={14} />
                    Thanh toán tiếp: {formatDate(c.nextPaymentDate)}
                </span>
                )}
            </div> */}

          {/* ---- Payment warning ---- */}
          {c.status === "active" && c.paymentStatus === "pending" && (
            <div className="mb-4 border-l-4 border-red-400 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={16} className="mr-2 inline" />
              Bạn có khoản thanh toán chưa hoàn thành. Vui lòng thanh toán trước
              ngày {formatDate(c.nextPaymentDate)}.
            </div>
          )}
        </div>

        {/* ---- Footer buttons ---- */}
        <div className="flex gap-2 border-t border-gray-200 bg-gray-50 px-6 py-3">
          <button
            onClick={() => {
              setSelectedContract(c);
              setActiveTab("view");
            }}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-700 transition-colors hover:bg-blue-200"
          >
            <Eye size={16} />
            Xem chi tiết
          </button>
          {/* <button className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-green-100 px-3 py-2 text-sm text-green-700 transition-colors hover:bg-green-200">
                <Download size={16} />
                Tải HĐ
            </button>
            <button className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-purple-100 px-3 py-2 text-sm text-purple-700 transition-colors hover:bg-purple-200">
                <MessageCircle size={16} />
                Liên hệ
            </button> */}
        </div>
      </div>
    );
  };

  const ContractList = () => (
    <section className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow">
        <div className="mb-4 flex items-center gap-3">
          <User size={24} className="text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Thông tin cá nhân</h2>
        </div>
        {currentTenant ? (
          <div className="grid gap-4 text-sm text-gray-600 md:grid-cols-2">
            <p>
              <strong>Họ tên:</strong> {currentTenant.ho_ten}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {currentTenant.sdt}
            </p>
            <p>
              <strong>Email:</strong> {currentTenant.email}
            </p>
            <p>
              <strong>CMND/CCCD:</strong> {currentTenant.cmnd}
            </p>
          </div>
        ) : (
          <p className="text-gray-600">Không có thông tin cá nhân.</p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Danh sách hợp đồng thuê nhà
        </h2>
        <span className="text-sm text-gray-600">
          Tổng: {contracts.length} hợp đồng
        </span>
      </div>
      <div className="grid gap-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
              />
            </svg>
            <span className="ml-2">Đang tải dữ liệu...</span>
          </div>
        ) : contracts.length > 0 ? (
          contracts.map((c) => <ContractCard key={c.id} {...c} />)
        ) : (
          <div className="py-12 text-center">
            <FileText size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-xl font-medium text-gray-600">
              Chưa có hợp đồng nào
            </h3>
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
    const c = selectedContract; // rút gọn tên biến

    return (
      <section className="mx-auto max-w-4xl">
        <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
          {/* ---- Panel header ---- */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Chi tiết hợp đồng thuê nhà
            </h2>
            <button
              onClick={() => setActiveTab("list")}
              className="rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
            >
              ← Quay lại
            </button>
          </div>

          {/* ---- Main body ---- */}
          <div className="space-y-8 p-6">
            {/* Heading + badges */}
            <div className="border-b pb-6 text-center">
              <h1 className="mb-2 text-3xl font-bold text-gray-800">
                HỢP ĐỒNG THUÊ NHÀ
              </h1>
              <p className="text-gray-600">Số hợp đồng: {c.id}</p>

              <div className="mt-4 flex justify-center gap-4">
                <span
                  className={`rounded-full px-4 py-2 text-sm font-medium ${statusColor[c.status]}`}
                >
                  {statusText[c.status]}
                </span>
                <span
                  className={`rounded-full px-4 py-2 text-sm font-medium ${payColor[c.paymentStatus]}`}
                >
                  {payText[c.paymentStatus]}
                </span>
              </div>
            </div>

            {/* Two‑column: landlord / tenant */}
            <div className="grid gap-8 md:grid-cols-2">
              {/* <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-800">
                    Thông tin bên cho thuê
                    </h3>
                    <div className="space-y-2 text-gray-600">
                    <p>
                        <strong>Tên:</strong> {c.landlord.name}
                    </p>
                    <p>
                        <strong>Điện thoại:</strong> {c.landlord.phone}
                    </p>
                    </div>
                </div> */}

              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                  Thông tin bên thuê
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Tên:</strong> {currentTenant.ho_ten}
                  </p>
                  <p>
                    <strong>CMND/CCCD:</strong> {currentTenant.cmnd}
                  </p>
                  <p>
                    <strong>Điện thoại:</strong> {currentTenant.sdt}
                  </p>
                  <p>
                    <strong>Email:</strong> {currentTenant.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Asset info */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Thông tin tài sản cho thuê
              </h3>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-lg font-medium text-gray-800">
                  {c.tenPhong}
                </p>
                {/* <p className="mt-1 text-gray-600">{c.address}</p> */}
                <div className="mt-3 grid gap-4 text-gray-600 md:grid-cols-2">
                  {/* <p>
                        <strong>Loại:</strong> {c.roomType}
                    </p> */}
                  <p>
                    <strong>Diện tích:</strong> {c.dienTich}
                  </p>
                </div>
              </div>
            </div>

            {/* Contract & financial terms */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                  Thời hạn hợp đồng
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Từ ngày:</strong> {formatDate(c.startDate)}
                  </p>
                  <p>
                    <strong>Đến ngày:</strong> {formatDate(c.endDate)}
                  </p>
                  {c.status === "active" && (
                    <p>
                      <strong>Còn lại:</strong> {daysUntil(c.endDate)} ngày
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                  Điều khoản tài chính
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Tiền thuê:</strong> {formatCurrency(c.tienThue)}
                    /tháng
                  </p>
                  <p>
                    <strong>Tiền cọc:</strong> {formatCurrency(c.tienCoc)}
                  </p>
                  {c.nextPaymentDate && (
                    <p>
                      <strong>Thanh toán tiếp:</strong>{" "}
                      {formatDate(c.nextPaymentDate)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Utilities & Terms */}
            {/* <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                    Chi phí tiện ích
                </h3>
                <div className="rounded-lg bg-gray-50 p-4 text-gray-600">
                    {c.bills && c.bills.length > 0
                    ? `${c.bills.length} hóa đơn`
                    : "Không có hóa đơn"}
                </div>
                </div> */}

            {/* <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                    Điều khoản hợp đồng
                </h3>
                <div className="rounded-lg bg-gray-50 p-4 text-gray-600">
                    {c.terms}
                </div>
                </div> */}

            {/* ------- BILLS (nếu có) ------- */}
            {c.bills && c.bills.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                  Chi tiết hóa đơn
                </h3>
                <table className="w-full border text-left text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2">Tháng</th>
                      <th className="p-2">Trạng thái</th>
                      <th className="p-2 text-right">Tổng tiền</th>
                      <th className="p-2">Ngày thanh toán</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.bills.map((bill) => (
                      <tr key={bill.id} className="border-b">
                        <td className="p-2">
                          {(() => {
                            const [year, month] = bill.month.split("-");
                            return `${month}/${year}`;
                          })()}
                        </td>
                        <td className="p-2">
                          {bill.status === "paid"
                            ? "Đã thanh toán"
                            : "Chưa thanh toán"}
                        </td>
                        <td className="p-2 text-right">
                          {bill.items
                            .reduce((total, item) => total + item.amount, 0)
                            .toLocaleString()}
                          đ
                        </td>
                        <td className="p-2">{bill.paidDate || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ---- Action buttons ---- */}
            <div className="flex gap-4 border-t pt-6">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700">
                <Download size={20} />
                Tải xuống hợp đồng
              </button>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700">
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
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Hợp đồng thuê nhà của tôi
            </h1>
            <p className="text-gray-600">
              Xem và quản lý các hợp đồng thuê nhà hiện tại của bạn
            </p>
          </header>

          {activeTab === "list" ? <ContractList /> : <ViewContract />}
        </div>
      </div>
    </div>
  );
}
