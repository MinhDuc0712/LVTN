import { getUserContracts } from "@/api/homePage";
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle,
  Home,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import { useAuth } from "@/context/AuthContext";

export default function HouseList() {
  const [activeItem, setActiveItem] = useState("my-rental");
  const [myRentals, setMyRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRentals = async () => {
      if (!user?.MaNguoiDung) {
        console.warn("User chưa sẵn sàng hoặc không có MaNguoiDung");
        return;
      }

      try {
        setLoading(true);

        const response = await getUserContracts(user.MaNguoiDung);
        console.log("RESPONSE FULL:", response);

        const hopdongs = response?.hopdongs || [];

        if (!hopdongs.length) {
          throw new Error("Không có hợp đồng nào được tìm thấy");
        }

        setMyRentals(hopdongs);
      } catch (error) {
        console.error("Lỗi khi tải danh sách hợp đồng:", error.message);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Không thể tải danh sách nhà đang thuê.",
        );
        setMyRentals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [user]);

  const formatCurrency = (v) => new Intl.NumberFormat("vi-VN").format(v) + "đ";
  const formatDate = (s) => new Date(s).toLocaleDateString("vi-VN");

  const statusBadge = {
    active: (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        <CheckCircle className="mr-1 h-3 w-3" />
        Đang thuê
      </span>
    ),
    expired: (
      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
        <AlertCircle className="mr-1 h-3 w-3" />
        Hết hạn
      </span>
    ),
  };

  const RentalCard = ({ rental }) => (
    <div className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="mb-1 text-xl font-semibold text-gray-900">
            {rental.tenPhong || "Phòng không xác định"}
          </h3>
          <p className="text-sm text-gray-600">
            <strong>Phòng:</strong> {rental.id || "N/A"} •{" "}
            <strong>Diện tích:</strong> {rental.dienTich || "N/A"}
          </p>
        </div>
        <div className="flex flex-col items-end">
          {statusBadge[rental.status] || statusBadge.expired}
        </div>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
        <div>
          <p className="mb-1 text-sm text-gray-600">Tiền thuê hàng tháng</p>
          <p className="text-lg font-bold text-green-600">
            {formatCurrency(rental.tienThue || 0)}
          </p>
        </div>
        <div>
          <p className="mb-1 text-sm text-gray-600">Tiền cọc</p>
          <p className="text-lg font-bold text-blue-600">
            {formatCurrency(rental.tienCoc || 0)}
          </p>
        </div>
      </div>
      {/* <p className="mb-4 text-sm text-gray-600">Không có hóa đơn gần đây</p> */}
      <div className="mb-4 flex items-center justify-between rounded-lg border border-gray-200 p-3">
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            <strong>Từ:</strong> {formatDate(rental.startDate || new Date())}
          </span>
        </div>
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            <strong>Đến:</strong>{" "}
            {rental.endDate ? formatDate(rental.endDate) : "N/A"}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          to={`/RentHouse/RentalRoomDetail/${rental.id || ""}`}
          className="flex items-center rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-700 transition-colors hover:bg-blue-200"
        >
          <Home className="mr-1 h-4 w-4" />
          Xem chi tiết
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <main className="flex-1 overflow-auto p-6">
        <header className="mb-6">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Nhà đang thuê
          </h1>
          <p className="text-gray-600">
            Quản lý thông tin các căn nhà bạn đang thuê
          </p>
        </header>
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
        ) : (
          <section className="mx-auto max-w-5xl">
            {myRentals.length > 0 ? (
              myRentals.map((r) => <RentalCard key={r.id} rental={r} />)
            ) : (
              <div className="py-12 text-center">
                <Building2 className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  Chưa có nhà thuê
                </h3>
                <p className="text-gray-600">
                  Bạn chưa thuê nhà nào. Hãy tìm kiếm và thuê ngôi nhà phù hợp.
                </p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
