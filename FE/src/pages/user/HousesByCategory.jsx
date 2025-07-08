import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getHousesByCategory, getHousesWithFilter } from "@/api/homePage";
import FilterSection from "../../components/FilterSection";
import ListingCard from "../../components/ListingCard";
import { useFilter } from "@/context/FilterContext";

const HousesByCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [filteredListings, setFilteredListings] = useState([]);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const { filters } = useFilter();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const handleApplyFilters = async (sectionFilters) => {
    setIsFilterLoading(true);
    setNoResults(false);
    setCurrentPage(1);

    try {
      const combinedFilters = {
        ...filters,
        ...sectionFilters,
        category_id: categoryId,
      };
      if (Object.keys(combinedFilters).length === 0) {
        const featuredOnly = listings.filter((item) => item.NoiBat === 1);
        setFilteredListings(featuredOnly);
        return;
      }
      const response = await getHousesWithFilter(combinedFilters);
      // console.log("Filters gửi đi: ", combinedFilters);
      // console.log("Kết quả: ", response.data);

      if (response.data && response.data.length > 0) {
        const featuredFromFilter = response.data.filter(
          (item) => item.NoiBat === 1,
        );
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
      isFeatured: house.NoiBat || false,
    }));
  };

  const formatPostedTime = (dateString) => {
    const now = new Date();
    const postedDate = new Date(dateString);
    const diffInDays = Math.floor((now - postedDate) / (1000 * 60 * 60 * 24));

    // if (diffInDays === 0) return 'Hôm nay';
    //tính theo phút
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
    const dataToUse =
      filteredListings.length > 0 || noResults ? filteredListings : listings;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return formatListingData(dataToUse.slice(startIndex, endIndex));
  };

  const totalPages = Math.ceil(
    (filteredListings.length > 0 || noResults
      ? filteredListings.length
      : listings.length) / itemsPerPage,
  );

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
            {`${listings[0].category?.name}` || "Không có danh mục"}
          </h2>

          {noResults ? (
            <div className="rounded bg-yellow-100 p-4 text-gray-700">
              Không tìm thấy kết quả phù hợp với tiêu chí lọc.
            </div>
          ) : (
            <ListingCard listings={formattedListings} />
          )}

          {/* <ListingCard listings={formattedListings} /> */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`rounded-l-md px-3 py-2 ${
                    currentPage === 1
                      ? "cursor-not-allowed bg-gray-200 text-gray-500"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  &laquo; Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`rounded-r-md px-3 py-2 ${
                    currentPage === totalPages
                      ? "cursor-not-allowed bg-gray-200 text-gray-500"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Sau &raquo;
                </button>
              </nav>
            </div>
          )}
        </div>

        <div className="w-full md:w-1/3">
          <FilterSection
            onApplyFilters={handleApplyFilters}
            isLoading={isFilterLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default HousesByCategory;
