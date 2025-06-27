import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FilterSection from "../../components/FilterSection";
import ListingCard from "../../components/ListingCard";
import { getHousesByCategory } from "../../api/homePage/request"; 

const HousesByCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  useEffect(() => {
    const fetchCategoryHouses = async () => {
      try {
        setLoading(true);
        const res = await getHousesByCategory(categoryId);
        console.log("HousesByCategory response:", res);
        const houses = res?.data || [];
        if (houses.length === 0) {
          navigate("/404", { replace: true });
          return;
        }
        setListings(res?.data || []);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách nhà.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryHouses();
  }, [categoryId, navigate]);


  const formatListingData = (houses) => {
    return houses.map((house) => ({
      id: house.MaNha,
      title: house.TieuDe,
      price: house.Gia,
      area: house.DienTich,
      district: house.Quan_Huyen,
      city: house.Tinh_TP,
      address: house.DiaChi,
      description: house.MoTaChiTiet,
      postedTime: formatPostedTime(house.NgayDang),
      contact: house.user?.SDT || "",
      posterName: house.user?.HoTen || "",
      type: house.category?.name || "",
      image: house.HinhAnh || getFirstImage(house.images),
    }));
  };

  const formatPostedTime = (dateString) => {
    const now = new Date();
    const postedDate = new Date(dateString);
    const diffInDays = Math.floor((now - postedDate) / (1000 * 60 * 60 * 24));

    if (diffInDays < 1) {
      const diffInMinutes = Math.floor((now - postedDate) / (1000 * 60));
      if (diffInMinutes < 15) return "Hôm nay";
      return `${diffInMinutes} phút trước`;
    }

    if (diffInDays === 1) return "1 ngày trước";
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`;
    return `${Math.floor(diffInDays / 30)} tháng trước`;
  };

  const getFirstImage = (images) => {
    if (!images || images.length === 0) return "";
    return images[0].DuongDanHinh;
  };

 
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return formatListingData(listings.slice(startIndex, endIndex));
  };


  const totalPages = Math.ceil(listings.length / itemsPerPage);


  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formattedListings = getPaginatedData();

  if (loading)
    return <div className="py-8 text-center">Đang tải dữ liệu...</div>;
  if (error)
    return <div className="py-8 text-center text-red-500">Lỗi: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full md:w-2/3">
          <h2 className="mb-4 text-xl font-bold uppercase">
            {listings[0]?.category?.name || "Không có danh mục"}
          </h2>
          
          <ListingCard listings={formattedListings} />
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`rounded-l-md px-3 py-2 ${
                    currentPage === 1 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  &laquo; Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-2 ${
                      currentPage === page 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`rounded-r-md px-3 py-2 ${
                    currentPage === totalPages 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Sau &raquo;
                </button>
              </nav>
            </div>
          )}
        </div>
        
        <div className="w-full md:w-1/3">
          <FilterSection />
        </div>
      </div>
    </div>
  );
};

export default HousesByCategory;