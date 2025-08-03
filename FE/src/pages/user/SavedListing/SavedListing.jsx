import {
  deleteFavoriteAPI,
  getFavoritesAPI,
  toggleFavoriteAPI,
} from "@/api/homePage";
import {
  Calendar,
  Eye,
  Heart,
  MapPin,
  Phone,
  Square,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const SavedListings = () => {
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatnumber = (number) => {
    if (number < 1_000_000) {
      return `${number.toLocaleString("vi-VN")} đồng/tháng`;
    } else {
      const trieu = number / 1_000_000;
      return trieu % 1 === 0
        ? `${trieu} triệu/tháng`
        : `${trieu.toFixed(1)} triệu/tháng`;
    }
  };
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await getFavoritesAPI();

        // console.log(response);

        const data = Array.isArray(response) ? response : response.data;
        if (data && Array.isArray(data)) {
          setSavedListings(data);
        } else {
          setSavedListings([]);
          toast.error("Dữ liệu không hợp lệ");
        }
      } catch (err) {
        toast.error("Lỗi kết nối API");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleRemoveFromSaved = async (favoriteId, houseId) => {
    try {
      const response = await toggleFavoriteAPI(favoriteId, "unlike");
      // console.log(response);
      if (response.message?.includes("xóa")) {
        setSavedListings((prev) =>
          prev.filter((listing) => listing.id !== houseId),
        );
        toast.success("Đã xoá khỏi danh sách yêu thích");
      } else {
        toast.error(response.message || "Không thể xoá yêu thích");
      }
    } catch (err) {
      toast.error(err.message || "Lỗi kết nối khi xoá yêu thích");
    }
  };

  const handleClearAll = async () => {
    try {
      for (const listing of savedListings) {
        await deleteFavoriteAPI(listing.favorite_id);
      }
      setSavedListings([]);
      toast.success("Danh sách yêu thích đã được xóa sạch");
    } catch (err) {
      toast.error(err.message || "Lỗi khi xóa tất cả nhà yêu thích");
    }
  };

  if (loading) return <div className="py-8 text-center">Đang tải...</div>;

  if (savedListings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 text-center">
        <Heart className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <h2 className="text-2xl font-bold">Chưa có bài đăng nào được lưu</h2>
        <p className="mb-4 text-gray-600">Hãy lưu bài đăng bạn yêu thích!</p>
        <Link
          to="/"
          className="rounded-lg bg-amber-500 px-6 py-2 text-white hover:bg-amber-600"
        >
          Khám phá bài đăng
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Bài đăng đã lưu</h1>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Xoá tất cả
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {savedListings.map((listing) => (
            <div
              key={listing.favorite_id}
              className="flex flex-col rounded-xl bg-white p-4 shadow sm:flex-row"
            >
              <div className="w-full sm:w-1/3">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="h-full w-full rounded-md object-cover"
                />
              </div>
              <div className="mt-4 flex-1 sm:mt-0 sm:ml-6">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-600">
                      {listing.type}
                    </span>
                    {listing.price < 3 && (
                      <span className="ml-2 rounded-full bg-green-100 px-2 py-1 text-sm text-green-600">
                        Giá rẻ
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      handleRemoveFromSaved(listing.favorite_id, listing.id)
                    }
                    className="text-red-500 hover:text-red-600"
                    title="Bỏ lưu"
                  >
                    <Heart className="h-5 w-5 fill-current" />
                  </button>
                </div>
                <h3 className="mt-2 text-lg font-bold text-gray-800">
                  {listing.title}
                </h3>
                <div className="mb-2 text-2xl font-bold text-amber-600">
                  {formatnumber(listing.price)}
                </div>
                <div className="mb-2 flex gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Square className="h-4 w-4" />
                    {listing.area} m²
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {listing.district}
                  </div>
                </div>
                <p className="mb-2 flex items-center text-sm text-gray-600">
                  <MapPin className="mr-1 h-4 w-4" />
                  {listing.address}
                </p>
                <p className="mb-2 text-sm text-gray-700">
                  {listing.description}
                </p>
                <div className="mt-2 flex items-center justify-between border-t pt-2 text-sm text-gray-500">
                  <div className="flex flex-col">
                    <span>
                      <Calendar className="inline h-4 w-4" /> Lưu:{" "}
                      {listing.saved_at}
                    </span>
                    <span>Đăng: {listing.posted_at}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {listing.contact}
                    </span>
                    <Link
                      to={`/room/${listing.id}`}
                      className="flex items-center gap-1 rounded bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
                    >
                      <Eye className="h-4 w-4" /> Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedListings;
