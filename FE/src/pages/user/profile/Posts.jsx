import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  Edit,
  EyeOff,
  Home,
  Image,
  Loader2,
  MapPin,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { getUserHouses, hideHouse, relistHouse } from "@/api/homePage/request";
import Sidebar from "./Sidebar";
function Posts() {
  const [activeTab, setActiveTab] = useState("all");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHideModal, setShowHideModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const queryClient = useQueryClient();
  const { data: houses = [], isLoading } = useQuery({
    queryKey: ["user-houses"],
    queryFn: getUserHouses,
  });
  const [paymentMode, setPaymentMode] = useState("new");

  const formatCurrency = (value) => {
    const number = Number(value);

    if (number >= 1_000_000_000_000) {
      return `${(number / 1_000_000_000_000_000_000_000_000)} tỷ/tháng`;
    }

    if (number < 1_000_000) {
      return `${number.toLocaleString("vi-VN")} đồng/tháng`;
    } else {
      const millions = number / 1_000_000;
      const display = Number.isInteger(millions)
        ? millions.toLocaleString("vi-VN")
        : millions.toFixed(1).replace(".", ",");
      return `${display} triệu/tháng`;
    }
  };
  const handleHidePost = (post) => {
    setSelectedPost(post);
    setShowHideModal(true);
  };
  // const isExpired = (house) => {
  //   return new Date(house.NgayHetHan) < new Date();
  // };
  const handleConfirmHide = async () => {
    try {
      await hideHouse(selectedPost?.id);
      toast.success("Ẩn tin đăng thành công");
      setShowHideModal(false);
      queryClient.invalidateQueries(["houses"]);
    } catch (error) {
      toast.error("Ẩn tin đăng thất bại");
      console.error(error);
    }
  };
  const handleFreeRelist = async (post) => {
    try {
      const res = await relistHouse(post.id);
      console.log(res);
      if (res?.require_payment) {
        const mode = res?.mode || "renew";
        setPaymentMode(mode);
        setSelectedPost(post);
        setShowPaymentModal(true);
        return;
      }

      toast.success("Đăng lại tin thành công!");
      queryClient.invalidateQueries(["userHouses"]);
    } catch (error) {
      const message = error?.response?.data?.message;

      if (message?.includes("hết hạn")) {
        setPaymentMode("renew");
        setSelectedPost(post);
        setShowPaymentModal(true);
      } else {
        toast.error(message || "Đăng lại thất bại");
      }
    }
  };

  const mapHouseToPost = (house) => ({
    id: house.MaNha,
    image: house.images?.[0]?.DuongDanHinh || "/default.jpg",
    label: house.category?.name || "Khác",
    title: house.TieuDe,
    price: formatCurrency(Number(house.Gia)),
    startDate: house.NgayDang || "---",
    endDate: house.NgayHetHan || "---",
    status: house.TrangThai,
    rejectReason: house.LyDoTuChoi || "",
  });

  const transformedPosts = houses.map(mapHouseToPost);

  const categoryColors = {
    "Nhà cho thuê": "bg-gradient-to-r from-red-500 to-red-600",
    "Căn hộ cao cấp": "bg-gradient-to-r from-emerald-500 to-emerald-600",
    "Phòng trọ sinh viên": "bg-gradient-to-r from-amber-500 to-orange-500",
    "Nhà nguyên căn": "bg-gradient-to-r from-purple-500 to-purple-600",
    Khác: "bg-gradient-to-r from-blue-500 to-blue-600",
  };

  const statusConfig = {
    "Đang xử lý": {
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
      icon: Clock,
    },
    "Đã từ chối": {
      color: "text-red-600",
      bg: "bg-red-50 border-red-200",
      icon: X,
    },
    "Đã ẩn": {
      color: "text-gray-600",
      bg: "bg-gray-50 border-gray-200",
      icon: EyeOff,
    },
    "Đang chờ thanh toán": {
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
      icon: CreditCard,
    },
    "Đã duyệt": {
      color: "text-green-600",
      bg: "bg-green-50 border-green-200",
      icon: Check,
    },
    "Đã cho thuê": {
      color: "text-purple-600",
      bg: "bg-purple-50 border-purple-200",
      icon: Home,
    },
  };

  const filteredPosts =
    activeTab === "all"
      ? transformedPosts
      : activeTab === "active"
        ? transformedPosts.filter((post) =>
            ["Đã duyệt", "Đang xử lý", "Đã cho thuê"].includes(post.status),
          )
        : transformedPosts.filter((post) =>
            [
              "Đã từ chối",
              "Đã ẩn",
              "Đang chờ thanh toán",
              "Tin hết hạn",
            ].includes(post.status),
          );

  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const currentPagePosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="text-lg font-medium text-gray-600">
            Đang tải danh sách tin đăng...
          </span>
        </div>
      </div>
    );
  }

  const renderActionButton = (post) => {
    switch (post.status) {
      case "Đang chờ thanh toán":
        return (
          <button
            onClick={() => {
              setSelectedPost(post);
              setPaymentMode("new");
              setShowPaymentModal(true);
            }}
            className="flex transform items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
          >
            <CreditCard className="h-4 w-4" />
            Thanh toán
          </button>
        );

      case "Đã từ chối":
        return (
          <Link
            to={`/post/${post.id}`}
            className="flex transform items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg"
          >
            <Edit className="h-4 w-4" />
            Sửa tin
          </Link>
        );

      case "Đã ẩn":
      case "Tin hết hạn":
        return (
          <div className="flex min-w-[130px] flex-col gap-2">
            <button
              onClick={() => handleFreeRelist(post)}
              className="flex transform items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:scale-105 hover:from-green-600 hover:to-green-700 hover:shadow-md"
            >
              <RotateCcw className="h-3 w-3" />
              Đăng lại
            </button>
          </div>
        );

      case "Đã duyệt":
        return (
          <Link
            onClick={() => handleHidePost(post)}
            className="flex transform items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 px-3 py-2 text-xs font-medium text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-gray-600 hover:to-gray-700 hover:shadow-lg"
          >
            <EyeOff className="h-4 w-4" />
            Ẩn tin
          </Link>
        );

      case "Đang xử lý":
        return (
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang xử lý...
          </div>
        );

      default:
        return (
          <div className="px-3 py-2 text-sm font-medium text-gray-400">---</div>
        );
    }
  };

  const tabConfig = [
    {
      key: "all",
      label: "Tất cả",
      icon: Building,
      count: transformedPosts.length,
    },
    {
      key: "active",
      label: "Đang hoạt động",
      icon: Sparkles,
      count: transformedPosts.filter((post) =>
        ["Đã duyệt", "Đang xử lý", "Đã cho thuê"].includes(post.status),
      ).length,
    },
    {
      key: "expired",
      label: "Hết hạn",
      icon: Clock,
      count: transformedPosts.filter((post) =>
        ["Đã từ chối", "Đã ẩn", "Đang chờ thanh toán", "Tin hết hạn"].includes(
          post.status,
        ),
      ).length,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:flex-row md:p-6">
      <Sidebar />

      <div className="w-full overflow-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-xl md:w-3/4">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <h1 className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-3xl font-bold text-transparent">
              Danh sách tin đăng
            </h1>
          </div>
          <p className="ml-1 text-gray-600">
            Quản lý và theo dõi tất cả tin đăng của bạn
          </p>
        </div>

        {/* Enhanced Tabs */}
        <div className="mb-8 inline-flex rounded-xl bg-gray-50 p-1">
          {tabConfig.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(1);
                }}
                className={`relative flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all duration-300 ${
                  activeTab === tab.key
                    ? "scale-105 transform bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:bg-white/50 hover:text-gray-800"
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{tab.label}</span>
                <span
                  className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                    activeTab === tab.key
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Enhanced Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-auto">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="border-b border-gray-200 p-4 text-left font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Mã tin
                    </div>
                  </th>
                  <th className="border-b border-gray-200 p-4 text-left font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Hình ảnh
                    </div>
                  </th>
                  <th className="min-w-[280px] border-b border-gray-200 p-4 text-left font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Thông tin tin đăng
                    </div>
                  </th>
                  <th className="border-b border-gray-200 p-4 text-left font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Giá
                    </div>
                  </th>
                  <th className="border-b border-gray-200 p-4 text-left font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Thời gian
                    </div>
                  </th>
                  <th className="border-b border-gray-200 p-4 text-left font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Trạng thái
                    </div>
                  </th>
                  <th className="min-w-[150px] border-b border-gray-200 p-4 text-center font-semibold text-gray-700">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPagePosts.map((post, index) => {
                  const statusInfo = statusConfig[post.status] || {};
                  const StatusIcon = statusInfo.icon || Clock;

                  return (
                    <tr
                      key={`${post.id}-${index}`}
                      className="border-b border-gray-100 transition-all duration-200 last:border-b-0 hover:bg-blue-50/50"
                    >
                      <td className="p-4">
                        <div className="rounded-lg bg-gray-50 px-3 py-2 text-center font-bold text-gray-800">
                          {post.id}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="group relative">
                          <img
                            src={post.image}
                            alt="Ảnh tin"
                            className="h-24 w-28 rounded-xl object-cover shadow-md transition-shadow duration-200 group-hover:shadow-lg"
                          />
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col gap-3">
                          <span
                            className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-sm ${categoryColors[post.label] || "bg-gradient-to-r from-blue-500 to-blue-600"}`}
                          >
                            {post.label}
                          </span>
                          <span className="line-clamp-2 max-w-[250px] text-sm font-semibold break-words text-gray-800 transition-colors duration-200 hover:text-blue-600">
                            {post.title}
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 font-bold text-green-700">
                          {post.price}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Bắt đầu:</span>
                            <span>{post.startDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Kết thúc:</span>
                            <span>{post.endDate}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div
                          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${statusInfo.bg || "border-gray-200 bg-gray-50"} ${statusInfo.color || "text-gray-600"}`}
                        >
                          <StatusIcon className="h-4 w-4" />
                          {post.status}
                        </div>
                        {post.status === "Đã từ chối" && post.rejectReason && (
                          <div className="mt-2 rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-500 italic">
                            <X className="mr-1 inline h-3 w-3" />
                            {post.rejectReason}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {renderActionButton(post)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Trang trước
            </button>

            <div className="flex items-center gap-2">
              <span className="text-gray-600">Trang</span>
              <span className="rounded-lg bg-blue-50 px-3 py-1 font-bold text-blue-600">
                {currentPage}
              </span>
              <span className="text-gray-600">trong</span>
              <span className="font-bold text-gray-800">{totalPages}</span>
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trang sau
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Enhanced Payment Modal */}
        {showPaymentModal && selectedPost && paymentMode && (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-3">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Tiếp tục thanh toán
                </h2>
              </div>

              <p className="mb-6 leading-relaxed text-gray-600">
                {paymentMode === "renew"
                  ? "Bạn đang thanh toán để gia hạn tin đăng của mình. Vui lòng xác nhận thông tin bên dưới."
                  : "Bạn đang thanh toán cho bài đăng mới. Vui lòng xác nhận thông tin bên dưới."}
              </p>

              <div className="mb-6 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <p className="font-semibold text-gray-800">
                    Mã tin: #{selectedPost?.id}
                  </p>
                </div>
                <p className="ml-6 text-sm text-gray-700">
                  {selectedPost?.title}
                </p>
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                >
                  Hủy bỏ
                </button>

                <Link
                  to={`/post/paymentpost?id=${selectedPost?.id}&mode=${paymentMode}`}
                  className="transform rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-medium text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
                >
                  Xác nhận thanh toán
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Hide Post Modal */}
        {showHideModal && (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-gray-100 p-3">
                  <EyeOff className="h-6 w-6 text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Ẩn tin đăng
                </h2>
              </div>

              <p className="mb-6 leading-relaxed text-gray-600">
                Bạn có chắc chắn muốn ẩn tin đăng này? Tin đăng sẽ không hiển
                thị với người dùng khác.
              </p>

              <div className="mb-6 rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-red-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <p className="font-semibold text-gray-800">
                    Mã tin: #{selectedPost?.id}
                  </p>
                </div>
                <p className="ml-6 text-sm text-gray-700">
                  {selectedPost?.title}
                </p>
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={() => setShowHideModal(false)}
                  className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleConfirmHide}
                  className="transform rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 font-medium text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-red-600 hover:to-red-700 hover:shadow-lg"
                >
                  Xác nhận ẩn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Posts;
