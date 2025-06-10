import React, { useState } from "react";
import {
  Heart,
  MapPin,
  Calendar,
  Square,
  Phone,
  Trash2,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";

const SavedListings = () => {
  // Dữ liệu mẫu cho các bài đăng đã lưu
  const [savedListings, setSavedListings] = useState([
    {
      id: 1,
      title:
        "Phòng trọ giá rẻ an toàn, an ninh kế bên khu CNC, ĐH FPT, Tài Chính Marketing chuẩn PCCC",
      price: 2.0,
      area: 20,
      district: "Quận Phú Nhuận",
      city: "Hồ Chí Minh",
      address: "Nguyễn Trọng Tuyển, P.8, Phú Nhuận",
      description:
        "Đầy đủ nội thất, có máy giặt riêng. Sạch sẽ, hiện đại, thoáng mát, có ban công. Khu vực an ninh cao, ra vào vân tay, bảo vệ.",
      postedTime: "3 ngày trước",
      savedTime: "2 ngày trước",
      contact: "0344773350",
      posterName: "Quỳnh Trang",
      type: "Phòng trọ",
      image: "src/assets/img-4597_1746276984.jpg",
    },
    {
      id: 2,
      title: "Căn hộ 1pn hiện đại tại Huỳnh Văn Bánh, Phú Nhuận",
      price: 11.0,
      area: 35,
      district: "Quận Phú Nhuận",
      city: "Hồ Chí Minh",
      address: "Huỳnh Văn Bánh, Phú Nhuận",
      description:
        "Căn hộ 1 phòng ngủ hiện đại, đầy đủ tiện nghi, gần trung tâm thành phố.",
      postedTime: "1 tuần trước",
      savedTime: "5 ngày trước",
      contact: "0912345678",
      posterName: "Minh Tuấn",
      type: "Căn hộ",
      image: "src/assets/img-4598_1746276976.jpg",
    },
    {
      id: 3,
      title: "Cho thuê căn hộ hiện đại ngay trung tâm Phú Nhuận",
      price: 7.9,
      area: 30,
      district: "Quận Phú Nhuận",
      city: "Hồ Chí Minh",
      address: "Trung tâm Phú Nhuận",
      description: "Căn hộ hiện đại, vị trí đắc địa, giao thông thuận tiện.",
      postedTime: "5 ngày trước",
      savedTime: "1 ngày trước",
      contact: "0987654321",
      posterName: "Thu Hằng",
      type: "Căn hộ",
      image: "src/assets/img-4599_1746276981.jpg",
    },
  ]);

  // Xóa bài đăng khỏi danh sách yêu thích
  const handleRemoveFromSaved = (id) => {
    setSavedListings((prev) => prev.filter((listing) => listing.id !== id));
  };

  // Nếu không có bài đăng nào được lưu
  if (savedListings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <Heart className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h2 className="mb-2 text-2xl font-bold text-gray-800">
              Chưa có bài đăng nào được lưu
            </h2>
            <p className="mb-6 text-gray-600">
              Bạn chưa lưu bài đăng nào. Hãy tìm kiếm và lưu những bài đăng yêu
              thích của bạn!
            </p>
            <button className="rounded-lg bg-amber-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-600">
              Khám phá bài đăng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Bài đăng đã lưu
          </h1>
          <p className="text-gray-600">
            Bạn đã lưu {savedListings.length} bài đăng
          </p>
        </div>

        {/* Filter/Sort Options */}
        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-3">
              <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none">
                <option>Tất cả loại hình</option>
                <option>Phòng trọ</option>
                <option>Căn hộ</option>
                <option>Nhà nguyên căn</option>
              </select>
              <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none">
                <option>Sắp xếp theo</option>
                <option>Lưu gần đây nhất</option>
                <option>Giá thấp đến cao</option>
                <option>Giá cao đến thấp</option>
                <option>Diện tích</option>
              </select>
            </div>
            <button
              onClick={() => setSavedListings([])}
              className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Xóa tất cả
            </button>
          </div>
        </div>

        {/* Saved Listings Grid */}
        <div className="grid grid-cols-1 gap-6 border-t border-gray-200 pt-6 lg:grid-cols-1">
          {savedListings.map((listing) => (
            <div
              key={listing.id}
              className="overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="min-h-48 w-full sm:w-1/3">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  {/* Header with remove button */}
                  <div className="mb-3 flex items-start justify-between">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600">
                        {listing.type}
                      </span>
                      {listing.price < 3 && (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                          Giá rẻ
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveFromSaved(listing.id)}
                      className="p-1 text-red-500 hover:text-red-600"
                      title="Bỏ lưu"
                    >
                      <Heart className="h-5 w-5 fill-current" />
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 line-clamp-2 cursor-pointer text-lg font-bold text-gray-800 hover:text-amber-600">
                    {listing.title}
                  </h3>

                  {/* Price */}
                  <div className="mb-3 text-2xl font-bold text-amber-600">
                    {listing.price} triệu/tháng
                  </div>

                  {/* Details */}
                  <div className="mb-3 flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Square className="h-4 w-4" />
                      <span>{listing.area} m²</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{listing.district}</span>
                    </div>
                  </div>

                  {/* Address */}
                  <p className="mb-3 flex items-center text-sm text-gray-600">
                    <MapPin className="mr-1 inline h-4 w-4" />
                    {listing.address}
                  </p>

                  {/* Description */}
                  <p className="mb-4 line-clamp-2 flex-1 text-sm text-gray-700">
                    {listing.description}
                  </p>

                  {/* Footer */}
                  <div className="flex-wrap items-center justify-between border-t border-gray-100 pt-4 sm:flex md:flex">
                    <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2 text-xs text-gray-500 sm:border-b-0 sm:pb-0 md:flex-col md:border-b-0 md:pb-0">
                      <div className="mb-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Lưu: {listing.savedTime}</span>
                      </div>
                      <div className="mb-1 flex items-center gap-1">
                        Đăng: {listing.postedTime}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 md:flex-row">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{listing.contact}</span>
                      </div>
                      <button className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600">
                        <Eye className="h-4 w-4" />
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-8 text-center">
          <Link to={'/'} className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50">
            Xem thêm bài đăng đã lưu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SavedListings;
