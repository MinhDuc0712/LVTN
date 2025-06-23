import { useEffect, useState } from "react";
import {
  Star,
  ThumbsUp,
  Send,
  MessageCircle,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import Avatar from "@/assets/avatar.jpg"
import { toast } from "react-toastify";
import {
  getRatingsByHouseAPI,
  postRatingAPI,
  toggleRatingLikeAPI,
  deleteRatingAPI,
} from "@/api/homePage";

function CommentsSection({ house, user }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        if (!house?.MaNha) return;
        setLoading(true);

        const res = await getRatingsByHouseAPI(house.MaNha, user?.MaNguoiDung);
        // console.log("Đánh giá:", res);

        const formatted = res.map((item) => ({
          id: item.MaDanhGia,
          user: item.user?.HoTen || item?.MaNguoiDung,
          avatar: item.user.HinhDaiDien,
          rating: item.SoSao,
          comment: item.NoiDung,
          date: item.ThoiGian,
          helpful: item.LuotThich || 0,
          liked: item.liked,
        }));

        setComments(formatted);
      } catch (err) {
        console.error("Lỗi khi tải đánh giá:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [house]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || newRating === 0) return;

    try {
      const payload = {
        MaNha: house?.MaNha,
        MaNguoiDung: user?.MaNguoiDung,
        SoSao: newRating,
        NoiDung: newComment,
      };
      // console.log("User data:", user);
      const res = await postRatingAPI(payload);

      const newEntry = {
        id: res.rating.MaDanhGia,
        user: user?.HoTen || "Bạn",
        avatar: user?.HinhDaiDien,
        rating: res.rating.SoSao,
        comment: res.rating.NoiDung,
        date: res.rating.ThoiGian,
        helpful: res.rating.LuotThich || 0,
        liked: false,
      };

      setComments([newEntry, ...comments]);
      setNewComment("");
      setNewRating(0);
      toast.success("Đánh giá đã được gửi thành công!");
    } catch (error) {
      // console.error("Lỗi gửi đánh giá:", error);
      toast.error("Gửi đánh giá thất bại.");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      // Giả sử có API xóa đánh giá
      await deleteRatingAPI(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Đánh giá đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi xóa đánh giá:", error);
      toast.error("Xóa đánh giá thất bại.");
    } finally {
      setOpenMenuId(null);
    }
  };

  const toggleCommentLike = async (commentId, isLiked) => {
    try {
      const action = isLiked ? "unlike" : "like";
      await toggleRatingLikeAPI(commentId, action);

      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                liked: !isLiked,
                helpful: isLiked ? c.helpful - 1 : c.helpful + 1,
              }
            : c,
        ),
      );
    } catch (err) {
      console.error("Lỗi khi thích đánh giá:", err);
      toast.error("Có lỗi xảy ra khi xử lý hành động thích.");
    }
  };

  const averageRating =
    comments.length > 0
      ? comments.reduce((sum, c) => sum + c.rating, 0) / comments.length
      : 0;

  const renderStars = (rating, interactive = false, size = "w-4 h-4") => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`${size} cursor-pointer transition-colors duration-200 ${
          index < (interactive ? hoverRating || newRating : rating)
            ? "fill-current text-yellow-400"
            : "text-gray-300"
        }`}
        onClick={interactive ? () => setNewRating(index + 1) : undefined}
        onMouseEnter={interactive ? () => setHoverRating(index + 1) : undefined}
        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
      />
    ));
  };

  return (
    <div className="rounded-2xl border border-white/20 bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
          <Star className="h-5 w-5 fill-current text-yellow-400" />
          Đánh giá & Nhận xét
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {renderStars(Math.round(averageRating))}
          </div>
          <span className="text-lg font-bold text-gray-800">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-sm text-gray-500">
            ({comments.length} đánh giá)
          </span>
        </div>
      </div>
      {/* Rating Distribution */}
      <div className="mb-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Rating bars */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = comments.filter((c) => c.rating === star).length;
              const percentage =
                comments.length > 0 ? (count / comments.length) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-8 text-sm font-medium">{star}</span>
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <div className="h-2 flex-1 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-yellow-400 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-sm text-gray-600">{count}</span>
                </div>
              );
            })}
          </div>
          {/* Rating summary */}
          <div className="rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 p-4">
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-yellow-600">
                {averageRating.toFixed(1)}
              </div>
              <div className="mb-2 flex justify-center">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-sm text-gray-600">
                Dựa trên {comments.length} đánh giá
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Viết đánh giá */}
      <div className="mb-6 border-t border-gray-100 pt-6">
        <h3 className="mb-4 font-semibold text-gray-800">
          Viết đánh giá của bạn
        </h3>

        {user ? (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Đánh giá của bạn
              </label>
              <div className="flex gap-1">
                {renderStars(0, true, "w-6 h-6")}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nhận xét
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về phòng trọ này..."
                className="w-full resize-none rounded-xl border border-gray-300 p-3 focus:border-transparent"
                rows="3"
              />
            </div>
            <button
              type="submit"
              disabled={!newComment.trim() || newRating === 0}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2 font-medium text-white transition-all duration-300 hover:from-amber-600 hover:to-orange-600 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400"
            >
              <Send className="h-4 w-4" />
              Gửi đánh giá
            </button>
          </form>
        ) : (
          <p className="rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
            Bạn cần{" "}
            <a
              href="/dang-nhap"
              className="font-semibold underline hover:text-orange-600"
            >
              đăng nhập
            </a>{" "}
            để gửi đánh giá.
          </p>
        )}
      </div>

      {/* Danh sách đánh giá */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">
          Tất cả đánh giá ({comments.length})
        </h3>
        {loading ? (
          <p>Đang tải đánh giá...</p>
        ) : (
          comments.slice(0, visibleCount).map((cmt) => (
            <div
              key={cmt.id}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex items-start gap-3">
                <img
                  src={cmt.avatar || Avatar}
                  alt={cmt.user}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-800">{cmt.user}</h4>
                      <span className="text-sm text-gray-500">{cmt.date}</span>
                    </div>
                    <div className="relative inline-block items-center">
                      <button
                        onClick={() => setOpenMenuId(cmt.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openMenuId === cmt.id && (
                        <div className="absolute right-0 z-50 mt-2 w-28 rounded border bg-white shadow">
                          <button
                            onClick={() => handleDelete(cmt.id)}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <Trash className="mr-2 h-4 w-4" /> Xóa
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    {renderStars(cmt.rating)}
                    <span className="text-sm font-medium text-gray-600">
                      {cmt.rating}/5
                    </span>
                  </div>
                  <p className="mb-3 leading-relaxed text-gray-700">
                    {cmt.comment}
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleCommentLike(cmt.id, cmt.liked)}
                      className={`flex items-center gap-1 text-sm transition-colors duration-200 ${
                        cmt.liked
                          ? "text-blue-600"
                          : "text-gray-500 hover:text-blue-600"
                      }`}
                    >
                      <ThumbsUp
                        className={`h-4 w-4 ${cmt.liked ? "fill-current" : ""}`}
                      />
                      Hữu ích ({cmt.helpful})
                    </button>
                    <button className="flex items-center gap-1 text-sm text-gray-500 transition-colors duration-200 hover:text-gray-700">
                      <MessageCircle className="h-4 w-4" />
                      Trả lời
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        {visibleCount < comments.length && (
          <div className="pt-4 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 5)}
              className="text-sm font-medium text-amber-600 transition-colors duration-200 hover:text-amber-700"
            >
              Xem thêm đánh giá
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentsSection;
