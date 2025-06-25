import React, { useEffect, useState } from "react";
import { Heart, MapPin, Square, Phone, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getFavoritesAPI,
  addFavoriteAPI,
  toggleFavoriteAPI,
} from "@/api/homePage";
import { toast } from "react-toastify";

const formatnumber = (num) => new Intl.NumberFormat("vi-VN").format(num);

const ListingCard = ({ listings }) => {
  const [favoritesStatus, setFavoritesStatus] = useState({});

useEffect(() => {
  const fetchFavorites = async () => {
    try {
      const token = sessionStorage.getItem("token"); // Hoặc kiểm tra qua context
      if (!token) return; // Chưa đăng nhập → bỏ qua, không gọi API

      const response = await getFavoritesAPI();
      const data = Array.isArray(response) ? response : response.data;

      const statusMap = {};
      data.forEach((item) => {
        statusMap[item.id] = {
          isLiked: true,
          favoriteId: item.favorite_id,
        };
      });

      setFavoritesStatus(statusMap);
    } catch (error) {
      console.error("Lỗi tải danh sách yêu thích:", error);
      // Không hiện toast nếu là lỗi 401
      if (error.response?.status !== 401) {
        toast.error("Lỗi khi tải danh sách yêu thích");
      }
    }
  };

  if (listings.length > 0) {
    fetchFavorites();
  }
}, [listings]);



  const handleToggleFavorite = async (houseId) => {
  const current = favoritesStatus[houseId];
  try {
    if (current?.isLiked) {
      const response = await toggleFavoriteAPI(current.favoriteId, "unlike");
      if (response.message?.includes("xóa")) {
        const updated = { ...favoritesStatus };
        delete updated[houseId];
        setFavoritesStatus(updated);
        toast.success("Đã bỏ yêu thích");
      }
    } else {
      const response = await addFavoriteAPI(houseId);
      setFavoritesStatus((prev) => ({
        ...prev,
        [houseId]: {
          isLiked: true,
          favoriteId: response.data.favorite_id,
        },
      }));
      toast.success("Đã thêm vào yêu thích");
    }
  } catch (err) {
    toast.error(err.message || "Lỗi khi xử lý yêu thích");
  }
};


  return (
    <div className="grid grid-cols-1 gap-6">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="overflow-hidden rounded-xl bg-white shadow"
        >
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-1/3">
              <img
                src={listing.image}
                alt={listing.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-2">
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600">
                    {listing.type}
                  </span>
                  {listing.price < 3 && (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-600">
                      Giá rẻ
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleToggleFavorite(listing.id)}
                  className={`p-1 ${favoritesStatus[listing.id]?.isLiked ? "text-red-500" : "text-gray-300"} hover:text-red-600`}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      favoritesStatus[listing.id]?.isLiked
                        ? "fill-current text-red-500"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              </div>
              <Link
                to={`/room/${listing.id}`}
                className="text-lg font-bold text-gray-800 hover:text-amber-600"
              >
                {listing.title}
              </Link>
              <div className="mb-2 text-2xl font-bold text-amber-600">
                {formatnumber(listing.price)} triệu/tháng
              </div>
              <div className="mb-2 flex gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Square className="h-4 w-4" />
                  {listing.area} m²
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {listing.district}, {listing.city}
                </div>
              </div>
              <p className="text-sm text-gray-600">
                <MapPin className="mr-1 inline h-4 w-4" />
                {listing.address}
              </p>
              <p className="mb-4 text-sm text-gray-700">
                {listing.description}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div>
                  <span>Đăng: {listing.postedTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {listing.contact}
                  <Link
                    to={`/room/${listing.id}`}
                    className="ml-4 flex items-center gap-1 rounded bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
                  >
                    <Eye className="h-4 w-4" />
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListingCard;
