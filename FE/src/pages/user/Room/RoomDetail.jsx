import { useState } from "react";
import {
  Heart,
  Share2,
  AlertTriangle,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  DollarSign,
  Square,
  User,
  Mail,
} from "lucide-react";
import RoomSameArea from "./RoomSameArea.jsx";
import RoomNew from "./RoomNew.jsx";
import CommentsSection from "./CommentsSection.jsx";

function Detail() {
  const mockHouse = { MaNha: 1 }; // 🧪 ID nhà thật có trong DB
  const mockUser = { MaNguoiDung: 1, HoTen: "Bạn", HinhDaiDien: null };
//   const house = fetchedHouse; // ví dụ từ useEffect
// const user = currentUser; 
  const [selectedImage, setSelectedImage] = useState(
    "/src/assets/img-4597_1746276984.jpg",
  );
  const [isLiked, setIsLiked] = useState(false);

  const thumbnails = [
    "/src/assets/img-4597_1746276984.jpg",
    "/src/assets/img-4598_1746276976.jpg",
    "/src/assets/img-4599_1746276981.jpg",
    "/src/assets/img-4599_1746276981.jpg",
    "/src/assets/img-4600_1746276972.jpg",
  ];

  const breadcrumbs = [
    { label: "Cho thuê căn hộ dịch vụ", href: "#" },
    { label: "Hồ Chí Minh", href: "#" },
    { label: "Quận Phú Nhuận", href: "#" },
    { label: "Phòng trọ giá rẻ...", href: "#", current: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl p-6">
        {/* Breadcrumb với gradient background */}
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
            {/* Image Gallery với hiệu ứng đẹp */}
            <div className="rounded-2xl border border-white/20 bg-white p-6 shadow-lg">
              {/* Large Image */}
              <div className="group relative h-[500px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src={selectedImage}
                  alt="main"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Image counter overlay */}
                <div className="absolute top-4 right-4 rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                  1 / {thumbnails.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {thumbnails.map((src, i) => (
                  <div
                    key={i}
                    className={`relative flex-shrink-0 cursor-pointer transition-all duration-300 ${
                      selectedImage === src
                        ? "scale-105 ring-1 ring-amber-400 rounded-xl"
                        : "hover:scale-102 hover:ring-2 hover:ring-gray-300 rounded-xl"
                    }`}
                    onClick={() => setSelectedImage(src)}
                  >
                    <img
                      src={src}
                      alt={`thumb-${i}`}
                      className="h-20 w-24 rounded-xl object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Title Section */}
            <div className="rounded-2xl border border-white/20 bg-white p-6 shadow-lg">
              <h1 className="mb-4 bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-3xl leading-tight font-bold text-transparent">
                Phòng trọ giá rẻ an toàn, an ninh kế bên khu CNC, ĐH FPT, Tài
                Chính Marketing chuẩn PCCC
              </h1>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Giá thuê</p>
                    <p className="font-bold text-green-600">2.000.000 VNĐ</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-sky-50 p-3">
                  <Square className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Diện tích</p>
                    <p className="font-bold text-blue-600">20 m²</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-violet-50 p-3">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Quận</p>
                    <p className="font-bold text-purple-600">Phú Nhuận</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-3">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Ngày đăng</p>
                    <p className="font-bold text-orange-600">03/05/2025</p>
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
                    <strong className="text-amber-600">Địa chỉ:</strong> Nguyễn
                    Trọng Tuyển, p8, Phú Nhuận.
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    <strong className="text-green-600">Giá:</strong> 8.300.000
                    VNĐ/tháng
                  </p>
                  <div className="mt-4">
                    <p className="mb-2 font-semibold text-gray-800">
                      🏠 Tiện nghi:
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-green-500">✓</span>
                        <span>Đầy đủ nội thất, có máy giặt riêng</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-green-500">✓</span>
                        <span>Sạch sẽ, hiện đại, thoáng mát, có ban công</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-green-500">✓</span>
                        <span>Khu vực an ninh cao, ra vào vân tay, bảo vệ</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Nổi bật */}
              <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
                  <div className="h-6 w-1 rounded-full bg-gradient-to-b from-amber-400 to-orange-500"></div>
                  ⭐ Điểm nổi bật
                </h2>
                <p className="leading-relaxed text-gray-700">
                  Gần bệnh viện, có máy giặt, bếp, ban công
                </p>
              </div>

              {/* Bản đồ */}
              <div className="rounded-2xl border border-white/20 bg-white p-6 shadow-lg">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Vị trí
                </h2>
                <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-sky-50 p-4">
                  <p className="leading-relaxed font-medium text-gray-700">
                    📍 Nguyễn Trọng Tuyển, Phường 8, Quận Phú Nhuận, Hồ Chí Minh
                  </p>
                </div>
              </div>
            </div>

            {/* Comments Section - Now a separate component */}
            {/* <CommentsSection house={houseData} user={currentUser}/> */}
            <CommentsSection house={mockHouse} user={mockUser} />

            {/* <CommentsSection /> */}
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6 xl:col-span-1">
            {/* Contact Card */}
            <div className="sticky top-6 overflow-hidden rounded-2xl border border-white/20 bg-white shadow-lg">
              {/* Header với gradient */}
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative">
                  {/* Avatar */}
                  <div className="mb-4 flex justify-center">
                    <img
                      src="/src/assets/avatar.jpg"
                      alt="avatar"
                      className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-lg"
                    />
                  </div>

                  {/* Name & Status */}
                  <div className="text-center">
                    <h2 className="mb-1 text-xl font-bold">Quỳnh Trang</h2>
                    <div className="flex items-center justify-center gap-2 text-green-300">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
                      <span className="text-sm font-medium">
                        Đang hoạt động
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
                    <div className="text-lg font-bold text-gray-800">6</div>
                    <div className="text-xs text-gray-500">Tin đăng</div>
                  </div>
                  <div className="w-px bg-gray-200"></div>
                  <div>
                    <div className="text-lg font-bold text-gray-800">19/04</div>
                    <div className="text-xs text-gray-500">Tham gia</div>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="mb-6 space-y-3">
                  <button className="flex w-full transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl">
                    <Phone className="h-4 w-4" />
                    0344 773 350
                  </button>

                  <button className="flex w-full transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl">
                    <MessageCircle className="h-4 w-4" />
                    Nhắn Zalo
                  </button>
                </div>

                {/* Actions */}
                <div className="flex justify-around border-t border-gray-100 pt-4">
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
                </div>

                {/* Contact Info */}
                <div className="mt-6 space-y-2 border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Quỳnh Trang</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>Quynhtrang@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Rooms Section */}
        <div className="mt-12 space-y-8">
          <RoomSameArea />
          <RoomNew />
        </div>
      </div>
    </div>
  );
}

export default Detail;
