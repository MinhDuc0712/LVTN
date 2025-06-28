import { deleteFavoriteAPI, getFavoritesAPI, toggleFavoriteAPI } from "@/api/homePage";
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
        toast.error( "Lỗi kết nối API");
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
          prev.filter((listing) => listing.id !== houseId)
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
        <Link to="/" className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600">
          Khám phá bài đăng
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex justify-between items-center mb-6">
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
            <div key={listing.favorite_id} className="rounded-xl bg-white shadow p-4 flex flex-col sm:flex-row">
              <div className="w-full sm:w-1/3">
                <img src={listing.image} alt={listing.title} className="w-full h-full object-cover rounded-md" />
              </div>
              <div className="flex-1 sm:ml-6 mt-4 sm:mt-0">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{listing.type}</span>
                    {listing.price < 3 && (
                      <span className="ml-2 text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">Giá rẻ</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveFromSaved(listing.favorite_id, listing.id)}
                    className="text-red-500 hover:text-red-600"
                    title="Bỏ lưu"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>
                <h3 className="mt-2 text-lg font-bold text-gray-800">{listing.title}</h3>
                <div className="text-amber-600 font-bold text-2xl mb-2">{listing.price} triệu/tháng</div>
                <div className="text-sm text-gray-600 flex gap-4 mb-2">
                  <div className="flex items-center gap-1"><Square className="w-4 h-4" />{listing.area} m²</div>
                  <div className="flex items-center gap-1"><MapPin className="w-4 h-4" />{listing.district}</div>
                </div>
                <p className="text-sm text-gray-600 mb-2 flex items-center"><MapPin className="w-4 h-4 mr-1" />{listing.address}</p>
                <p className="text-sm text-gray-700 mb-2">{listing.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mt-2 border-t pt-2">
                  <div className="flex flex-col">
                    <span><Calendar className="inline w-4 h-4" /> Lưu: {listing.saved_at}</span>
                    <span>Đăng: {listing.posted_at}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Phone className="w-4 h-4" />{listing.contact}</span>
                    <Link to={`/room/${listing.id}`} className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 flex items-center gap-1">
                      <Eye className="w-4 h-4" /> Xem chi tiết
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
