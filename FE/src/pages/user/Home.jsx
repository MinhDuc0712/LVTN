import React, { useState, useEffect } from "react";
import FilterSection from "../../components/FilterSection";
import ListingCard from "../../components/ListingCard";
import Banner from "../../components/Banner";
import { getHouses, getFeaturedHouses } from "../../api/homePage/request";

const Home = () => {
  const [listings, setListings] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        
        const housesResponse = await getHouses();
        setListings(housesResponse?.data || housesResponse || []);

        
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

  if (loading) return <div className="text-center py-8">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Lỗi: {error}</div>;


  const formatListingData = (houses) => {
    return houses.map(house => ({
      id: house.MaNha,
      title: house.TieuDe,
      price: house.Gia,
      area: house.DienTich,
      district: house.Quan_Huyen,
      city: house.Tinh_TP,
      address: house.DiaChi,
      description: house.MoTaChiTiet,
      postedTime: formatPostedTime(house.NgayDang),
      contact: house.user?.SDT || '',
      posterName: house.user?.HoTen || '',
      type: house.category?.TenDanhMuc || '',
      image: house.HinhAnh || getFirstImage(house.images),
      isFeatured: house.NoiBat
    }));
  };

  // Hàm format thời gian đăng
  const formatPostedTime = (dateString) => {
    const now = new Date();
    const postedDate = new Date(dateString);
    const diffInDays = Math.floor((now - postedDate) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Hôm nay';
    if (diffInDays === 1) return '1 ngày trước';
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`;
    return `${Math.floor(diffInDays / 30)} tháng trước`;
  };

  // Lấy ảnh đầu tiên nếu có
  const getFirstImage = (images) => {
    if (!images || images.length === 0) return '';
    return images[0].DuongDanHinh;
  };

  const formattedListings = formatListingData(listings);
  const formattedFeatured = formatListingData(featuredListings);

  return (
    <div>
      <Banner />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Nội dung chính nằm bên phải */}
          <div className="w-full md:w-2/3">
            {/* Hiển thị nhà nổi bật */}
            {formattedFeatured.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-4 uppercase text-xl font-bold">Nhà nổi bật</h2>
                <ListingCard listings={formattedFeatured} />
              </div>
            )}

            {/* Hiển thị tất cả nhà */}
            {/* <div className="mb-6">
              <h2 className="mb-4 text-xl font-bold">Đề xuất</h2>
              <ListingCard listings={formattedListings} />
            </div> */}
          </div>

          {/* FilterSection nằm bên trái */}
          <div className="w-full md:w-1/3">
            <FilterSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;