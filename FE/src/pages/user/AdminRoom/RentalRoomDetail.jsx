import { createKhach, createHopDong, getRoomUserByIdAPI, getServicePrices } from "@/api/homePage";
import {
  Camera,
  CheckCircle,
  Heart,
  Home,
  Phone,
  Share2,
  Star,
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

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const RentalRoomDetail = () => {
  const [showContractModal, setShowContractModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id: phongId } = useParams();
  const [room, setRoom] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [servicePrices, setServicePrices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingRoom(true);
        setLoadingServices(true);

        const roomRes = await getRoomUserByIdAPI(phongId);
        setRoom(roomRes);

        const servicesRes = await getServicePrices();
        setServicePrices(servicesRes);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoadingRoom(false);
        setLoadingServices(false);
      }
    };

    fetchData();
  }, [phongId]);

  const getUtilityPrice = (serviceName) => {
    const service = servicePrices.find(s => s.ten.toLowerCase().includes(serviceName));
    return service ? formatCurrency(service.gia_tri) : "Chưa cập nhật";
  };

  const electricPrice = getUtilityPrice("điện");
  const waterPrice = getUtilityPrice("nước");

  const [formData, setFormData] = useState({
    ho_ten: "",
    sdt: "",
    email: "",
    cmnd: "",
    startDate: "",
    duration: "1",
    termsAgreed: false,
  });

  const calculateServiceFee = () => {
    if (!servicePrices.length) return 0;

    return servicePrices
      .filter(service =>
        !["điện", "nước"].some(keyword =>
          service.ten.toLowerCase().includes(keyword)
        )
      )
      .reduce((total, service) => total + Number(service.gia_tri), 0);
  };


  const totalServiceFee = calculateServiceFee();
  const roomPrice = Number(room?.gia) || 0;
  const deposit = roomPrice;
  const totalInitialCost = roomPrice + deposit + totalServiceFee;
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
                        src={room.images[0].image_path}
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
                          src={image.image_path}
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
                          src={room.images[4]?.image_path}
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
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${room.trang_thai === "trong"
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
                    {room?.gia ? formatCurrency(room.gia) : "Chưa có giá"}
                  </span>
                </div>

                {/* Hiển thị giá điện/nước riêng */}
                <div className="border-b border-gray-100 py-3">
                  <p className="mb-2 text-sm font-medium text-gray-600">Giá tiện ích:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Giá điện (mỗi kWh):</span>
                      <span>
                        {loadingServices ? "Đang tải..." : electricPrice}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Giá nước (mỗi m³):</span>
                      <span>
                        {loadingServices ? "Đang tải..." : waterPrice}
                      </span>
                    </li>
                  </ul>
                </div>
                {!loadingServices && (
                  <div className="border-b border-gray-100 py-3">
                    <p className="mb-2 text-sm font-medium text-gray-600">Các tiện ích khác:</p>
                    <ul className="space-y-2 text-sm">
                      {servicePrices
                        .filter(service =>
                          !["điện", "nước"].some(keyword =>
                            service.ten.toLowerCase().includes(keyword)
                          )
                        )
                        .map((service, index) => (
                          <li key={index} className="flex justify-between">
                            <span>{service.ten}:</span>
                            <span>{formatCurrency(service.gia_tri)}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
                <div className="flex items-center justify-between border-b border-gray-100 py-3">
                  <span className="text-gray-600">Tiền đặt cọc</span>
                  <span className="font-semibold text-gray-800">
                    {room?.gia ? formatCurrency(room.gia) : "Chưa có giá"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-4">
                  <span className="font-bold text-gray-800">
                    Tổng chi phí ban đầu
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(totalInitialCost)}
                  </span>

                </div>
              </div>

              <button
                onClick={() => setShowContractModal(true)}
                className="mb-4 w-full transform rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-blue-700 hover:to-blue-800"
                disabled={room?.trang_thai !== "trong" || loadingRoom}
              >
                {loadingRoom ? "Đang tải..." :
                  room?.trang_thai === "trong" ? "Đặt phòng ngay" : "Phòng không khả dụng"}
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


      </div>
    </div>
  );
};

export default RentalRoomDetail;
