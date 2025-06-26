import { useState, useEffect } from "react";
import FilterSection from "../../components/FilterSection";
import ListingCard from "../../components/ListingCard";
import Banner from "../../components/Banner";
import {
  getHouses,
  getFeaturedHouses,
  getHousesWithFilter,
} from "@/api/homePage";

const Home = () => {
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  const handleApplyFilters = async (filters) => {
    setIsFilterLoading(true);
    setNoResults(false);
    setCurrentPage(1); 

    try {
      if (Object.keys(filters).length === 0) {
        const featuredOnly = allListings.filter(item => item.NoiBat === 1);
        setFilteredListings(featuredOnly);
        return;
      }
      const response = await getHousesWithFilter(filters);

      if (response.data && response.data.length > 0) {
        const featuredFromFilter = response.data.filter(item => item.NoiBat === 1);
        setFilteredListings(featuredFromFilter);
      } else {
        setNoResults(true);
        setFilteredListings([]);
      }
    } catch (error) {
      console.error("Lỗi khi lọc dữ liệu:", error);
      setError("Có lỗi xảy ra khi lọc dữ liệu");
    } finally {
      setIsFilterLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const housesResponse = await getHouses();
        const allHouses = housesResponse?.data || housesResponse || [];
        const featuredHouses = allHouses.filter(item => item.NoiBat === 1);
        
        setAllListings(allHouses);
        setFilteredListings(featuredHouses);

        const featuredResponse = await getFeaturedHouses();
        setFeaturedListings(featuredResponse?.data || featuredResponse || []);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      isFeatured: house.NoiBat || false,
    }));
  };

  const formatPostedTime = (dateString) => {
    const now = new Date();
    const postedDate = new Date(dateString);
    const diffInDays = Math.floor((now - postedDate) / (1000 * 60 * 60 * 24));

    if (diffInDays < 1) {
      const diffInMinutes = Math.floor((now - postedDate) / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInMinutes < 15) return "Hôm nay";
      if (diffInHours < 1) return `${diffInMinutes} phút trước`;
      return `${diffInHours} giờ trước`;
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
    return formatListingData(filteredListings.slice(startIndex, endIndex));
  };

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formattedFiltered = getPaginatedData();

  if (loading)
    return <div className="py-8 text-center">Đang tải dữ liệu...</div>;
  if (error)
    return <div className="py-8 text-center text-red-500">Lỗi: {error}</div>;

  return (
    <div>
      <Banner />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="w-full md:w-2/3">
            <div className="mb-6">
              <h2 className="mb-4 text-xl font-bold">
                {noResults ? "Không tìm thấy kết quả" : "Nhà đất nổi bật"}
              </h2>

              {isFilterLoading ? (
                <div className="py-4 text-center">Đang tải kết quả lọc...</div>
              ) : noResults ? (
                <div className="rounded-lg bg-yellow-100 p-4">
                  Không tìm thấy nhà nổi bật nào phù hợp với tiêu chí lọc của bạn
                </div>
              ) : (
                <>
                  <ListingCard listings={formattedFiltered} />
                  
                  {totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                      <nav className="inline-flex rounded-md shadow">
                        <button
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`rounded-l-md px-3 py-2 ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        >
                          &laquo; Trước
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-3 py-2 ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`rounded-r-md px-3 py-2 ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        >
                          Sau &raquo;
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/3">
            <FilterSection
              onApplyFilters={handleApplyFilters}
              isLoading={isFilterLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;