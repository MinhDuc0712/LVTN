import { createKhach, createHopDong, getRoomUserByIdAPI } from "@/api/homePage";
import {
  Camera,
  CheckCircle,
  Heart,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Star,
  ThumbsUp,
  Tv,
  Wifi,
  Wind,
  X,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const amenities = [
  { icon: Wind, name: "Điều hòa" },
  { icon: Wifi, name: "Wifi" },
  { icon: Zap, name: "Bếp từ" },
  { icon: Home, name: "Máy giặt" },
  { icon: Home, name: "Tủ lạnh" },
  { icon: Tv, name: "Tivi" },
];

const reviews = [
  {
    id: 1,
    name: "Nguyễn Minh Anh",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    rating: 5,
    date: "2 tuần trước",
    comment:
      "Phòng rất đẹp, sạch sẽ và tiện nghi đầy đủ. Chủ nhà rất thân thiện và hỗ trợ nhiệt tình. Tôi sẽ ở lại lâu dài.",
  },
  {
    id: 2,
    name: "Trần Văn Bình",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    rating: 4,
    date: "1 tháng trước",
    comment:
      "Vị trí thuận tiện, gần trung tâm. Phòng khá ổn nhưng cần cải thiện thêm về âm thanh cách âm.",
  },
  {
    id: 3,
    name: "Lê Thị Cẩm",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    rating: 5,
    date: "1 tháng trước",
    comment:
      "Phòng tuyệt vời! Nội thất hiện đại, wifi mạnh, có chỗ để xe an toàn. Rất hài lòng với sự lựa chọn này.",
  },
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const RentalRoomDetail = () => {
  const [showContractModal, setShowContractModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id: phongId } = useParams();
  const [room, setRoom] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await getRoomUserByIdAPI(phongId);
        console.log("Dữ liệu phòng:", res);
        setRoom(res);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu phòng:", err);
      } finally {
        setLoadingRoom(false);
      }
    };
    fetchRoom();
  }, [phongId]);

  const [formData, setFormData] = useState({
    ho_ten: "",
    sdt: "",
    email: "",
    cmnd: "",
    startDate: "",
    duration: "1",
    termsAgreed: false,
  });
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
    name: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitContract = async (e) => {
    e.preventDefault();

    if (
      !formData.ho_ten ||
      !formData.sdt ||
      !formData.cmnd ||
      !formData.startDate
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    try {
      setLoading(true);
      const resKhach = await createKhach({
        ho_ten: formData.ho_ten,
        sdt: formData.sdt,
        cmnd: formData.cmnd,
        email: formData.email || null,
        dia_chi: "",
      });

      const khach = resKhach?.khach;
      console.log("Khách hàng đã tạo:", khach);
      if (!khach || !khach.id) {
        throw new Error("Không lấy được ID khách hàng từ API.");
      }

      const start = new Date(formData.startDate);
      const durationMonths = parseInt(formData.duration);
      const end = new Date(start);
      end.setMonth(end.getMonth() + durationMonths);

      const hopDongPayload = {
        phong_id: phongId,
        khach_id: khach.id,
        ngay_bat_dau: start.toISOString().split("T")[0],
        ngay_ket_thuc: end.toISOString().split("T")[0],
        tien_coc: room?.gia,
        tien_thue: room?.gia,
        chi_phi_tien_ich: 0,
        ghi_chu: "",
      };

      await createHopDong(hopDongPayload);

      alert("Đăng ký thuê phòng thành công!");
      setShowContractModal(false);
      setFormData({
        ho_ten: "",
        sdt: "",
        email: "",
        cmnd: "",
        startDate: "",
        duration: "1",
        termsAgreed: false,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(", ")
        : error.message;
      console.error("Lỗi tạo hợp đồng:", errorMessage);
      alert(`Không thể đăng ký thuê phòng: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    console.log("Review data:", reviewForm);
    setShowReviewModal(false);
    alert("Cảm ơn bạn đã đánh giá!");
    setReviewForm({ rating: 5, comment: "", name: "" });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < rating ? "fill-current text-yellow-400" : "text-gray-300"
        }
      />
    ));
  };

  if (loadingRoom) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
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
          <span>Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Không tìm thấy phòng!</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-blue-600 hover:underline"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        {/* Header Navigation */}
        <nav className="mb-8 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="cursor-pointer hover:text-blue-600">
              Trang chủ
            </span>
            <span className="mx-2">/</span>
            <span className="cursor-pointer hover:text-blue-600">
              Danh sách phòng
            </span>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-800">Chi tiết phòng</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setLiked(!liked)}
              className={`rounded-full border p-2 transition-all ${liked ? "border-red-200 bg-red-50 text-red-500" : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"}`}
            >
              <Heart size={20} className={liked ? "fill-current" : ""} />
            </button>
            <button className="rounded-full border border-gray-200 bg-white p-2 text-gray-500 transition-all hover:bg-gray-50">
              <Share2 size={20} />
            </button>
          </div>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative">
              <div className="grid h-96 grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
                {room.images && room.images.length > 0 ? (
                  <>
                    <div className="col-span-2 row-span-2">
                      <img
                        src={`/storage/${room.images[0]?.image_path}`}
                        alt="Main room"
                        className="h-full w-full rounded-l-2xl object-cover"
                        onError={(e) =>
                          (e.target.src =
                            "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop")
                        }
                      />
                    </div>
                    {room.images.slice(1, 5).map((image, index) => (
                      <div key={index}>
                        <img
                          src={`/storage/${image.image_path}`}
                          alt={`Room image ${index + 1}`}
                          className="h-full w-full object-cover"
                          onError={(e) =>
                            (e.target.src =
                              "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&h=200&fit=crop")
                          }
                        />
                      </div>
                    ))}
                    {room.images.length > 4 && (
                      <div className="relative">
                        <img
                          src={`/storage/${room.images[4]?.image_path}`}
                          alt="More images"
                          className="h-full w-full rounded-br-2xl object-cover"
                          onError={(e) =>
                            (e.target.src =
                              "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=300&h=200&fit=crop")
                          }
                        />
                        <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-br-2xl bg-black">
                          <button className="flex items-center gap-2 text-white hover:underline">
                            <Camera size={20} />
                            <span>Xem thêm ảnh</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="col-span-4 row-span-2 flex items-center justify-center rounded-2xl bg-gray-100">
                    <p className="text-gray-500">Không có hình ảnh</p>
                  </div>
                )}
              </div>
            </div>

            {/* Room Details */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h1 className="mb-3 text-4xl font-bold text-gray-800">
                    {room.ten_phong || "Phòng không xác định"}
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {renderStars(5)}
                      <span className="ml-2 font-medium text-gray-600">
                        4.8 (127 đánh giá)
                      </span>
                    </div>
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        room.trang_thai === "trong"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {room.trang_thai === "trong"
                        ? "✓ Có sẵn ngay"
                        : room.trang_thai === "da_thue"
                          ? "Đã thuê"
                          : "Bảo trì"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {room.gia ? formatCurrency(room.gia) : "Chưa có giá"}
                  </div>
                  <div className="text-gray-500">/ tháng</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                  Mô tả chi tiết
                </h2>
                <p className="text-lg leading-relaxed text-gray-700">
                  {room.mo_ta || "Không có mô tả chi tiết."}
                </p>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                  Tiện nghi nổi bật
                </h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {amenities.map((amenity, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 transition-colors hover:bg-blue-50"
                    >
                      <amenity.icon className="text-blue-600" size={24} />
                      <span className="font-medium text-gray-700">
                        {amenity.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                  Vị trí
                </h2>
                <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                  <MapPin className="mt-1 text-red-500" size={24} />
                  <div>
                    <p className="font-medium text-gray-800">
                      {room.dia_chi || "Không có thông tin địa chỉ"}
                    </p>
                    <p className="mt-1 text-gray-600">
                      Trung tâm thành phố • Gần Metro • Nhiều tiện ích xung
                      quanh
                    </p>
                    <button className="mt-2 font-medium text-blue-600 hover:underline">
                      Xem trên bản đồ →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Đánh giá từ khách thuê
                </h2>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Viết đánh giá
                </button>
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-100 pb-6 last:border-b-0"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <h4 className="font-semibold text-gray-800">
                            {review.name}
                          </h4>
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.date}
                          </span>
                        </div>
                        <p className="leading-relaxed text-gray-700">
                          {review.comment}
                        </p>
                        <div className="mt-3 flex items-center gap-4">
                          <button className="flex items-center gap-2 text-gray-500 transition-colors hover:text-blue-600">
                            <ThumbsUp size={16} />
                            <span className="text-sm">Hữu ích (12)</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-500 transition-colors hover:text-blue-600">
                            <MessageCircle size={16} />
                            <span className="text-sm">Trả lời</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="top-8 rounded-2xl bg-white p-6 shadow-lg lg:sticky">
              <h3 className="mb-6 text-2xl font-bold text-gray-800">
                Chi tiết đặt phòng
              </h3>
              <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 py-3">
                  <span className="text-gray-600">Giá thuê hàng tháng</span>
                  <span className="font-semibold text-gray-800">
                    {room.gia ? formatCurrency(room.gia) : "Chưa có giá"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 py-3">
                  <span className="text-gray-600">Phí dịch vụ</span>
                  <span className="font-semibold text-gray-800">
                    {formatCurrency(0)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 py-3">
                  <span className="text-gray-600">Tiền đặt cọc</span>
                  <span className="font-semibold text-gray-800">
                    {room.gia ? formatCurrency(room.gia) : "Chưa có giá"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-4">
                  <span className="font-bold text-gray-800">
                    Tổng chi phí ban đầu
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {room.gia
                      ? formatCurrency(room.gia + 0 + room.gia)
                      : "Chưa có giá"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowContractModal(true)}
                className="mb-4 w-full transform rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-blue-700 hover:to-blue-800"
                disabled={room.trang_thai !== "trong"}
              >
                {room.trang_thai === "trong"
                  ? "Đặt phòng ngay"
                  : "Phòng không khả dụng"}
              </button>

              <div className="mb-4 text-center">
                <p className="mb-3 text-sm text-gray-500">
                  Hoặc liên hệ trực tiếp chủ nhà
                </p>
                <button className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-blue-600 py-3 font-medium text-blue-600 transition-colors hover:bg-blue-50">
                  <Phone size={20} />
                  {room.chu_nha_sdt || "0901 234 567"}
                </button>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
                <CheckCircle size={16} className="text-green-500" />
                <span>Miễn phí hủy trong 24h đầu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Modal */}
        {showContractModal && (
          <div className="bg-opacity-50 fixed inset-0 z-[100] flex items-center justify-center bg-black p-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-10 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  Đăng ký thuê phòng
                </h3>
                <button
                  onClick={() => setShowContractModal(false)}
                  className="rounded-full p-2 transition-colors hover:bg-gray-100"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    name="ho_ten"
                    required
                    value={formData.ho_ten}
                    onChange={handleInputChange}
                    placeholder="Họ tên đầy đủ"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    name="sdt"
                    required
                    value={formData.sdt}
                    onChange={handleInputChange}
                    placeholder="Số điện thoại"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email (không bắt buộc)"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="cmnd"
                  required
                  value={formData.cmnd}
                  onChange={handleInputChange}
                  placeholder="Số CMND/CCCD"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Ngày bắt đầu thuê
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      required
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Thời hạn thuê
                    </label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="1">1 tháng</option>
                      <option value="3">3 tháng</option>
                      <option value="6">6 tháng</option>
                      <option value="12">12 tháng</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleSubmitContract}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-4 text-lg font-bold text-white transition-all hover:from-blue-700 hover:to-blue-800 disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Xác nhận đăng ký"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && (
          <div className="bg-opacity-50 fixed inset-0 z-[100] flex items-center justify-center bg-black p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  Viết đánh giá
                </h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="rounded-full p-2 transition-colors hover:bg-gray-100"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Họ tên của bạn
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={reviewForm.name}
                    onChange={handleReviewChange}
                    placeholder="Nhập họ tên"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    Đánh giá của bạn
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setReviewForm((prev) => ({ ...prev, rating: star }))
                        }
                        className="focus:outline-none"
                      >
                        <Star
                          size={32}
                          className={
                            star <= reviewForm.rating
                              ? "fill-current text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Nhận xét chi tiết
                  </label>
                  <textarea
                    name="comment"
                    required
                    value={reviewForm.comment}
                    onChange={handleReviewChange}
                    placeholder="Chia sẻ trải nghiệm của bạn về phòng trọ này..."
                    rows="4"
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleSubmitReview}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3 font-bold text-white transition-all hover:from-blue-700 hover:to-blue-800"
                >
                  Gửi đánh giá
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalRoomDetail;
