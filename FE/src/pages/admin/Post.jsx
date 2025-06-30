import Avatar from "@/assets/avatar.jpg";
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Eye,
  Filter,
  Home,
  Loader2,
  MapPin,
  MessageSquare,
  Search,
  Users,
  X
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  approveHouse,
  getAllHousesForAdmin,
  rejectHouse,
} from "../../api/homePage/request";
import SidebarWithNavbar from "./SidebarWithNavbar";

const PostModeration = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPost, setSelectedPost] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchAllPages = async () => {
      try {
        setLoading(true);
        let allData = [];
        let page = 1;
        let lastPage = 1;

        do {
          const params = {
            page,
            limit: 50,
          };

          if (filter !== "all") {
            params.status = getStatusValue(filter);
          }
          if (searchTerm) {
            params.search = searchTerm;
          }

          const response = await getAllHousesForAdmin(params);
          const housesData = Array.isArray(response.data) ? response.data : [];

          allData = [...allData, ...housesData];
          lastPage = response.pagination?.last_page || 1;
          page++;
        } while (page <= lastPage);

        setPosts(mapApiDataToPosts(allData));
      } catch (error) {
        console.error("Error fetching all pages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPages();
  }, [filter, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const openDetailModal = (post) => {
    setSelectedPost({
      ...post,
      images: post.image ? [post.image] : [],
    });
    setCurrentImageIndex(0);
    setShowDetailModal(true);
  };

  const openRejectModal = (post) => {
    setSelectedPost(post);
    setRejectReason("");
    setShowRejectModal(true);
  };
  const mapApiDataToPosts = (apiData) => {
    if (!Array.isArray(apiData)) {
      console.error("Expected array but got:", apiData);
      return [];
    }

    return apiData.map((house) => ({
      id: house.MaNha,
      title: house.TieuDe,
      description: house.MoTaChiTiet,
      price: house.Gia,
      location: house.DiaChi,
      category: house.category?.name || "Không xác định",
      author: house.user?.HoTen || "Ẩn danh",
      phone: house.user?.SDT || "Không có",
      email: house.user?.Email || "Không có",
      image: house.images?.[0]?.DuongDanHinh || house.HinhAnh,
      avatar: house.user?.HinhDaiDien,
      createdAt: house.NgayDang,
      status: getStatusKey(house.TrangThai),
      reason: house.LyDoTuChoi || null,
    }));
  };

  // Chuyển đổi giữa key FE và value BE
  const getStatusValue = (key) => {
    const statusMap = {
      waiting_payment: "Đang chờ thanh toán",
      pending: "Đang xử lý",
      approved: "Đã duyệt",
      rejected: "Đã từ chối",
      rented: "Đã cho thuê",
      hidden: "Đã ẩn",
      expired: "Tin hết hạn",
      deleted: "Đã xóa",
    };
    return statusMap[key] || key;
  };

  const getStatusKey = (value) => {
    const statusMap = {

      'Đang chờ thanh toán': 'waiting_payment',
      'Đang xử lý': 'pending',
      'Đã duyệt': 'approved',
      'Đã từ chối': 'rejected',
      'Đã cho thuê': 'rented',
      'Đã ẩn': 'hidden',
      'Tin hết hạn': 'expired',
      'Đã xóa': 'deleted'
    };
    return statusMap[value] || value;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleApprove = async (postId) => {
    try {
      await approveHouse(postId);
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? { ...post, status: "approved", reason: null }
            : post,
        ),
      );
    } catch (error) {
      console.error("Error approving post:", error);
    }
  };

  const handleReject = async (postId, reason) => {
    try {
      await rejectHouse(postId, reason);
      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, status: "rejected", reason } : post,
        ),
      );
      setShowRejectModal(false);
      setRejectReason("");
    } catch (error) {
      console.error("Error rejecting post:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "waiting_payment":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "waiting_payment":
        return "Chờ thanh toán";
      case "pending":
        return "Chờ duyệt";
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Từ chối";
      case "rented":
        return "Đã cho thuê";
      case "hidden":
        return "Đã ẩn";
      case "expired":
        return "Tin hết hạn";
      case "deleted":
        return "Đã xóa";
      default:
        return "Không xác định";
    }
  };

  const getCategoryIcon = (category) => {
    if (category.includes("phòng trọ") || category.includes("căn hộ")) {
      return <Home className="mr-1 h-3 w-3" />;
    }
    if (category.includes("ở ghép")) {
      return <Users className="mr-1 h-3 w-3" />;
    }
    return <MessageSquare className="mr-1 h-3 w-3" />;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % selectedPost.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + selectedPost.images.length) % selectedPost.images.length,
    );
  };

  // Logic phân trang
  const filteredPosts = posts.filter((post) => {
    const matchesFilter = filter === "all" || post.status === filter;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Tính toán số trang hiển thị
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      if (totalPages > 1) rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <SidebarWithNavbar>
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>
      </SidebarWithNavbar>
    );
  }

  return (
    <SidebarWithNavbar>
      <div className="mx-auto max-w-7xl p-6">
        <h1 className="mb-6 text-3xl font-bold text-blue-900">
          Kiểm duyệt bài đăng
        </h1>

        <div className="rounded-xl bg-white p-6 shadow-lg">
          {/* Header với bộ lọc */}
          <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold text-blue-800">
                Danh sách bài đăng ({filteredPosts.length})
              </h2>
              <div className="mt-2 flex gap-2">
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                  <div className="mr-1 h-2 w-2 rounded-full bg-yellow-400"></div>
                  Chờ duyệt (
                  {posts.filter((p) => p.status === "pending").length})
                </span>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  <div className="mr-1 h-2 w-2 rounded-full bg-green-400"></div>
                  Đã duyệt (
                  {posts.filter((p) => p.status === "approved").length})
                </span>
                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                  <div className="mr-1 h-2 w-2 rounded-full bg-red-400"></div>
                  Từ chối ({posts.filter((p) => p.status === "rejected").length}
                  )
                </span>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="all">Tất cả</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Đã duyệt</option>
                  <option value="rejected">Từ chối</option>
                  <option value="waiting_payment">Đang chờ thanh toán</option>
                </select>
              </div>

              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tiêu đề hoặc tác giả..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  className="rounded-md border border-gray-300 py-2 pr-4 pl-9 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Thông tin phân trang và số mục trên trang */}
          <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Hiển thị {startIndex + 1}-
                {Math.min(endIndex, filteredPosts.length)} của{" "}
                {filteredPosts.length} kết quả
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Hiển thị:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600">mục/trang</span>
              </div>
            </div>
          </div>

          {/* Bảng danh sách bài đăng */}
          {currentPosts.length === 0 ? (
            <p className="py-8 text-center text-gray-500">
              Không có bài đăng nào phù hợp với bộ lọc.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 rounded-lg border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Thông tin bài đăng
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Tác giả
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Giá & Địa điểm
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-2 py-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="h-16 w-16 rounded-lg border object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="line-clamp-2 text-sm font-medium text-blue-900">
                              {post.title}
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              ID: {post.id} • {formatDate(post.createdAt)}
                            </div>
                            <div className="mt-1">
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                {getCategoryIcon(post.category)}
                                {post.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 flex-shrink-0">
                            <img
                              src={post.avatar || Avatar}
                              alt={post.author}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-blue-900">
                              {post.author}
                            </div>
                            <div className="text-xs text-gray-500">
                              {post.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          {formatPrice(post.price)}
                        </div>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <MapPin className="mr-1 h-3 w-3" />
                          {post.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(post.status)}`}
                        >
                          <div
                            className={`mr-1 h-2 w-2 rounded-full ${
                              post.status === "pending"
                                ? "bg-yellow-400"
                                : post.status === "approved"
                                  ? "bg-green-400"
                                  : "bg-red-400"
                            }`}
                          ></div>
                          {getStatusText(post.status)}
                        </span>
                        {post.status === "rejected" && post.reason && (
                          <div className="mt-1 line-clamp-2 text-xs text-red-600">
                            <AlertCircle className="mr-1 inline h-3 w-3" />
                            {post.reason}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openDetailModal(post)}
                            className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-3 py-1 text-xs text-blue-600 transition-colors hover:bg-blue-200"
                          >
                            <Eye className="h-3 w-3" /> Xem
                          </button>
                          {post.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(post.id)}
                                className="inline-flex items-center gap-1 rounded-md bg-green-100 px-3 py-1 text-xs text-green-600 transition-colors hover:bg-green-200"
                              >
                                <Check className="h-3 w-3" /> Duyệt
                              </button>
                              <button
                                onClick={() => openRejectModal(post)}
                                className="inline-flex items-center gap-1 rounded-md bg-red-100 px-3 py-1 text-xs text-red-600 transition-colors hover:bg-red-200"
                              >
                                <X className="h-3 w-3" /> Từ chối
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                Trang {currentPage} của {totalPages}
              </div>

              <div className="flex items-center space-x-2">
                {/* Nút Previous */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? "cursor-not-allowed text-gray-400"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Trước
                </button>

                {/* Số trang */}
                <div className="flex items-center space-x-1">
                  {getVisiblePages().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === "..." ? (
                        <span className="px-3 py-2 text-sm text-gray-400">
                          ...
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Nút Next */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? "cursor-not-allowed text-gray-400"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Sau
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal xem chi tiết */}
        {showDetailModal && selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 backdrop-blur-sm">
            <div className="m-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-blue-900">
                  Chi tiết bài đăng
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Hình ảnh */}
                <div>
                  <div className="relative mb-4">
                    <img
                      src={selectedPost.image}
                      alt={`${selectedPost.title}`}
                      className="h-80 w-full rounded-lg object-cover"
                    />
                    {selectedPost.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="bg-opacity-50 hover:bg-opacity-70 absolute top-1/2 left-2 -translate-y-1/2 transform rounded-full bg-black p-2 text-white"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="bg-opacity-50 hover:bg-opacity-70 absolute top-1/2 right-2 -translate-y-1/2 transform rounded-full bg-black p-2 text-white"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <div className="bg-opacity-50 absolute bottom-2 left-1/2 -translate-x-1/2 transform rounded-full bg-black px-3 py-1 text-sm text-white">
                          {currentImageIndex + 1} / {selectedPost.images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {selectedPost.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {selectedPost.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className={`h-16 w-16 cursor-pointer rounded border-2 object-cover ${
                            index === currentImageIndex
                              ? "border-blue-500"
                              : "border-gray-200"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {/* Thông tin */}
                <div className="space-y-4">
                  <div>
                    <h2 className="mb-2 text-xl font-bold text-gray-900">
                      {selectedPost.title}
                    </h2>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(selectedPost.status)}`}
                    >
                      {getStatusText(selectedPost.status)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-lg">
                      <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-600">
                        {formatPrice(selectedPost.price)}/tháng
                      </span>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-gray-500" />
                      <span>{selectedPost.location}</span>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                      <span>
                        Đăng ngày: {formatDate(selectedPost.createdAt)}
                      </span>
                    </div>

                    <div className="border-t pt-3">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                        {getCategoryIcon(selectedPost.category)}
                        {selectedPost.category}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold">Mô tả:</h4>
                    <p className="leading-relaxed text-gray-700">
                      {selectedPost.description}
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="mb-3 font-semibold">Thông tin liên hệ:</h4>
                    <div className="mb-3 flex items-center space-x-3">
                      <img
                        src={selectedPost.avatar || Avatar}
                        alt={selectedPost.author}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {selectedPost.author}
                        </div>
                        <div className="text-sm text-gray-500">
                          {selectedPost.phone}
                        </div>
                        <div className="text-sm text-gray-500">
                          {selectedPost.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedPost.status === "rejected" &&
                    selectedPost.reason && (
                      <div className="border-t pt-4">
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                          <div className="flex items-start">
                            <AlertCircle className="mt-0.5 mr-2 h-5 w-5 text-red-500" />
                            <div>
                              <h5 className="mb-1 font-semibold text-red-800">
                                Lý do từ chối:
                              </h5>
                              <p className="text-red-700">
                                {selectedPost.reason}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {selectedPost.status === "pending" && (
                    <div className="border-t pt-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            handleApprove(selectedPost.id);
                            setShowDetailModal(false);
                          }}
                          className="flex-1 rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                        >
                          <Check className="mr-2 inline h-4 w-4" />
                          Phê duyệt
                        </button>
                        <button
                          onClick={() => {
                            setShowDetailModal(false);
                            openRejectModal(selectedPost);
                          }}
                          className="flex-1 rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                        >
                          <X className="mr-2 inline h-4 w-4" />
                          Từ chối
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal từ chối */}
        {showRejectModal && selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 backdrop-blur-sm">
            <div className="m-4 w-full max-w-md rounded-lg bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-red-700">
                Từ chối bài đăng
              </h3>
              <p className="mb-4 text-gray-600">
                Bạn có chắc chắn muốn từ chối bài đăng{" "}
                <strong>"{selectedPost.title}"</strong>?
              </p>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Lý do từ chối (tùy chọn)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Nhập lý do từ chối bài đăng này..."
                  className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleReject(selectedPost.id, rejectReason)}
                  className="flex-1 rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                >
                  Xác nhận từ chối
                </button>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason("");
                  }}
                  className="flex-1 rounded-md bg-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-400"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarWithNavbar>
  );
};

export default PostModeration;
