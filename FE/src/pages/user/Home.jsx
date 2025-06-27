// src/pages/Home.jsx
import { useState, useEffect } from "react";
import FilterSection from "../../components/FilterSection";
import ListingCard from "../../components/ListingCard";
import Banner from "../../components/Banner";
import { getHouses, getFeaturedHouses, getHousesWithFilter } from "@/api/homePage";
import { useFilter } from "@/context/FilterContext";

const Home = () => {
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const { filters } = useFilter();

  // Hàm xử lý lọc dữ liệu từ FilterSection
  const handleApplyFilters = async (sectionFilters) => {
    setIsFilterLoading(true);
    setNoResults(false);

    try {
      // Kết hợp filters từ Header và FilterSection
      const combinedFilters = { ...filters, ...sectionFilters };
      if (Object.keys(combinedFilters).length === 0) {
        setFilteredListings(allListings);
        return;
      }
      const response = await getHousesWithFilter(combinedFilters);

      if (response.data && response.data.length > 0) {
        setFilteredListings(response.data);
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

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const housesResponse = await getHouses();
        const allHouses = housesResponse?.data || housesResponse || [];
        setAllListings(allHouses);
        setFilteredListings(allHouses);

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

  // Format dữ liệu nhà
  const formatListingData = (houses) => {
    return houses.map((house) => ({
      id: house.MaNha,
      title: house.TieuDe,
      price: house.Gia,
      area: house.DienTich,
      // district: house.Quan_Huyen,
      // city: house.Tinh_TP,
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

  useEffect(() => {
    const applyHeaderFilters = async () => {
      if (Object.keys(filters).length > 0) {
        setIsFilterLoading(true);
        try {
          const response = await getHousesWithFilter(filters);
          if (response.data && response.data.length > 0) {
            setFilteredListings(response.data);
            setNoResults(false);
          } else {
            setNoResults(true);
            setFilteredListings([]);
          }
        } catch (error) {
          console.error("Lỗi khi áp dụng bộ lọc từ Header:", error);
          setError("Có lỗi xảy ra khi lọc dữ liệu");
        } finally {
          setIsFilterLoading(false);
        }
      } else {
        setFilteredListings(allListings);
        setNoResults(false);
      }
    };

    applyHeaderFilters();
  }, [filters, allListings]);

  const formattedFiltered = formatListingData(filteredListings);

  if (loading)
    return <div className="py-8 text-center">Đang tải dữ liệu...</div>;
  if (error)
    return <div className="py-8 text-center text-red-500">Lỗi: {error}</div>;

  return (
    <div>
      <Banner />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Nội dung chính */}
          <div className="w-full md:w-2/3">
            {/* Hiển thị nhà nổi bật */}
            <div className="mb-6">
              <h2 className="mb-4 text-xl font-bold">
                {noResults ? "Không tìm thấy kết quả" : "Danh sách nhà"}
              </h2>

              {isFilterLoading ? (
                <div className="py-4 text-center">Đang tải kết quả lọc...</div>
              ) : noResults ? (
                <div className="rounded-lg bg-yellow-100 p-4">
                  Không tìm thấy nhà nào phù hợp với tiêu chí lọc của bạn
                </div>
              ) : (
                <ListingCard listings={formattedFiltered} />
              )}
            </div>
          </div>

          {/* FilterSection */}
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