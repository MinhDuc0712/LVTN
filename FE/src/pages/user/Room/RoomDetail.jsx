import { getHousesById, useAuthUser, useGetUtilitiesUS } from "@/api/homePage"; // Giả sử bạn đã tạo hàm này trong api
import avatar from "@/assets/avatar.jpg";
import {
  AlertTriangle,
  Bath,
  Bed,
  Calendar,
  DollarSign,
  Heart,
  Layers,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Square,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GoongMapLibre from "../../map";
import CommentsSection from "./CommentsSection";
const getDistrict = (DiaChi) => {
  if (!DiaChi) return { district: "" };
  const parts = DiaChi.split(",")
    .map((p) => p.trim())
    .reverse();

  let district = "";

  for (const part of parts) {
    if ((!district && part.startsWith("Quận")) || part.startsWith("Huyện")) {
      district = part;
    }
  }

  return { district };
};
function HouseDetail() {
  const { id } = useParams();
  const { data: user } = useAuthUser();
  const { data: utilities = [] } = useGetUtilitiesUS();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        setLoading(true);
        const houseData = await getHousesById(id);

        if (houseData && Object.keys(houseData).length > 0) {
          // const houseData = response.data; 
          setHouse(houseData);
          const firstImage =
            houseData.images?.[0]?.DuongDanHinh || "/default-house.jpg";
          setSelectedImage(firstImage);
        } else {
          setError("Không tìm thấy thông tin nhà");
        }
      } catch (err) {
        setError("Lỗi khi tải thông tin nhà: " + err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHouseDetails();
  }, [id]);

  if (loading) return <div className="py-20 text-center">Đang tải...</div>;
  if (error)
    return <div className="py-20 text-center text-red-500">{error}</div>;

  // Breadcrumbs
  const breadcrumbs = [
    { label: "Trang chủ", href: "/", current: false },
    {
      label: house.category.name,
      href: `/category/${house.category.MaDanhMuc}`,
      current: false,
    },
    { label: house.TieuDe, href: house.MaNha, current: true },
  ];

  // Format giá
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Format ngày
  const formatDate = (dateString) => {
    if (!dateString) return "Không rõ";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl p-6">
        {/* Breadcrumb */}
        <div className="mb-6 rounded-xl border border-white/20 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
          <nav className="flex flex-wrap items-center gap-2 text-sm">
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <a
                  href={item.href}
                  className={`transition-colors duration-200 ${
                    item.current
                      ? "font-medium text-gray-600"
                      : "text-blue-600 hover:text-amber-500 hover:underline"
                  }`}
                >
                  {item.label}
                </a>
                {index < breadcrumbs.length - 1 && (
                  <span className="text-gray-400">/</span>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-4">
          {/* Main Content - 3 columns */}
          <div className="space-y-8 xl:col-span-3">
            {/* Image Gallery */}
            <div className="rounded-2xl border border-white/20 bg-white p-6 shadow-lg">
              {/* Large Image */}
              <div className="group relative h-[500px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src={selectedImage}
                  alt="main"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "/default-house.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Image counter overlay */}
                {house.images && house.images.length > 0 && (
                  <div className="absolute top-4 right-4 rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                    {house.images.findIndex(
                      (img) => img.DuongDanHinh === selectedImage,
                    ) + 1}{" "}
                    / {house.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {house.images && house.images.length > 0 ? (
                <div className="mt-4 flex gap-3 overflow-x-auto p-2">
                  {house.images.map((image, i) => (
                    <div
                      key={i}
                      className={`relative flex-shrink-0 cursor-pointer p-1 transition-all duration-300 ${
                        selectedImage === image.DuongDanHinh
                          ? "scale-105 rounded-xl ring-1 ring-amber-400"
                          : "rounded-xl hover:scale-102 hover:ring-2 hover:ring-gray-300"
                      }`}
                      onClick={() => setSelectedImage(image.DuongDanHinh)}
                    >
                      <img
                        src={image.DuongDanHinh}
                        alt={`thumb-${i}`}
                        className="h-20 w-24 rounded-xl object-cover"
                        onError={(e) => {
                          e.target.src = "/default-house.jpg";
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 text-center text-gray-500">
                  Không có hình ảnh
                </div>
              )}
            </div>

            {/* Title Section */}
            <div className="rounded-2xl border border-white/20 bg-white p-6 shadow-lg">
              <h1 className="mb-4 bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-3xl leading-tight font-bold text-transparent">
                {house.TieuDe}
              </h1>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Giá thuê</p>
                    <p className="font-bold text-green-600">
                      {formatPrice(house.Gia)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-sky-50 p-3">
                  <Square className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Diện tích</p>
                    <p className="font-bold text-blue-600">
                      {house.DienTich} m²
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-violet-50 p-3">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Quận/Huyện</p>
                    {(() => {
                      const { district } = getDistrict(house.DiaChi);
                      return (
                        <div className="font-bold text-purple-600">
                          {district}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-3">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Ngày đăng</p>
                    <p className="font-bold text-orange-600">
                      {formatDate(house.NgayDang)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Sections */}
            <div className="space-y-6">
              {/* Chi tiết mô tả */}
              <div className="rounded-2xl border border-white/20 bg-white p-6 shadow-lg">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
                  <div className="h-6 w-1 rounded-full bg-gradient-to-b from-amber-400 to-orange-500"></div>
                  Chi tiết mô tả
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-base leading-relaxed text-gray-700">
                    <strong className="text-amber-600">Địa chỉ đầy đủ: </strong>
                    {house.DiaChi}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-blue-500" />
                      <span>Số phòng ngủ: {house.SoPhongNgu}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-blue-500" />
                      <span>Số phòng tắm: {house.SoPhongTam}</span>
                    </div>
                    {house.SoTang && (
                      <div className="flex items-center gap-2">
                        <Layers className="h-5 w-5 text-blue-500" />
                        <span>Số tầng: {house.SoTang}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <p className="mb-2 font-semibold text-gray-800">
                      Mô tả chi tiết:
                    </p>
                    <p className="whitespace-pre-line text-gray-700">
                      {house.MoTaChiTiet}
                    </p>
                  </div>
                  <div className="mt-6">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
                      <div className="h-5 w-1 rounded-full bg-gradient-to-b from-blue-400 to-purple-500"></div>
                      Tiện ích
                    </h3>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {utilities.map((util, index) => {
                        const hasUtility = house.utilities?.some(
                          (u) => u.MaTienIch === util.MaTienIch,
                        );

                        return (
                          <div
                            key={index}
                            className={`flex items-center gap-3 text-sm transition-colors duration-200 ${
                              hasUtility
                                ? "text-gray-700 hover:text-gray-900"
                                : "text-gray-400 italic"
                            }`}
                          >
                            <div
                              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                                hasUtility ? "bg-green-500" : "bg-gray-300"
                              }`}
                            >
                              {hasUtility ? (
                                <svg
                                  className="h-3 w-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              ) : null}
                            </div>

                            <span
                              className={
                                hasUtility ? "font-medium" : "font-normal"
                              }
                            >
                              {util.TenTienIch}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bản đồ */}
              <div className="rounded-2xl border border-white/20 bg-white p-6 shadow-lg">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Vị trí
                </h2>
                <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-sky-50 p-4">
                  <p className="leading-relaxed font-medium text-gray-700">
                    📍 {house.DiaChi}
                  </p>
                </div>
                <div className="mb-6 rounded bg-white p-4 shadow">
                  <h2 className="mb-2 text-lg font-bold">Bản đồ vị trí</h2>
                  <div className="h-[400px] w-full">
                    <GoongMapLibre address={house.DiaChi} />
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <CommentsSection house={house} user={user} />
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6 xl:col-span-1">
            {/* Contact Card */}
            {house.user && (
              <div className="sticky top-6 overflow-hidden rounded-2xl border border-white/20 bg-white shadow-lg">
                {/* Header với gradient */}
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative">
                    {/* Avatar */}
                    <div className="mb-4 flex justify-center">
                      <img
                        src={house.user.HinhDaiDien || avatar}
                        alt="avatar"
                        className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-lg"
                      />
                    </div>

                    {/* Name & Status */}
                    <div className="text-center">
                      <h2 className="mb-1 text-xl font-bold">
                        {house.user.HoTen}
                      </h2>
                      <div className="flex items-center justify-center gap-2 text-green-300">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
                        <span className="text-sm font-medium">
                          {house.user.TrangThai || "Đang hoạt động"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  {/* Stats */}
                  <div className="mb-6 flex justify-center gap-6 text-center">
                    <div>
                      <div className="text-lg font-bold text-gray-800">
                        {house.user.so_tin_dang || 0}{" "}
                      </div>
                      <div className="text-xs text-gray-500">Số tin đăng</div>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    {/* <div>
                      <div className="text-lg font-bold text-gray-800">
                        {house.user.NgayTao
                          ? formatDate(house.user.NgayTao)
                          : "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">Tham gia</div>
                    </div> */}
                  </div>

                  {/* Contact Buttons */}
                  <div className="mb-6 space-y-3">
                    <a
                      href={`tel:${house.user.SDT}`}
                      className="flex w-full transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl"
                    >
                      <Phone className="h-4 w-4" />
                      {house.user.SDT}
                    </a>

                    <a
                      href={`https://zalo.me/${house.user.SDT.replace(/^0/, "84")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Nhắn Zalo
                    </a>
                  </div>

                  {/* Actions */}
                  {/* <div className="flex justify-around border-t border-gray-100 pt-4">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`group flex flex-col items-center gap-1 transition-all duration-300 ${
                        isLiked
                          ? "text-red-500"
                          : "text-gray-500 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className={`h-5 w-5 transition-all duration-300 group-hover:scale-110 ${
                          isLiked ? "fill-current" : ""
                        }`}
                      />
                      <span className="text-xs font-medium">Lưu tin</span>
                    </button>

                    <button className="group flex flex-col items-center gap-1 text-gray-500 transition-all duration-300 hover:text-blue-500">
                      <Share2 className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                      <span className="text-xs font-medium">Chia sẻ</span>
                    </button>

                    <button className="group flex flex-col items-center gap-1 text-gray-500 transition-all duration-300 hover:text-orange-500">
                      <AlertTriangle className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                      <span className="text-xs font-medium">Báo xấu</span>
                    </button>
                  </div> */}

                  {/* Contact Info */}
                  <div className="mt-6 space-y-2 border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{house.user.HoTen}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{house.user.Email || "Chưa có email"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HouseDetail;
