import React from "react";
import FilterSection from "../../components/FilterSection";
import ListingCard from "../../components/ListingCard";
import Banner from "../../components/Banner";

const Home = () => {
  const listings = [
    {
      id: 1,
      title: "PHONG TRO GIA RE BAY BU TIEN NGHI PCCC NGAY CHG",
      price: 2.3,
      area: 18,
      district: "Quận 3",
      city: "Hồ Chí Minh",
      description:
        "Phong tro gia re day du tién nghi Pccc ngay chgRa vao van tay Khang chung chii24/24Pece day di",
      postedTime: "Hôm nay",
      contact: "1922379164",
      type: "Phòng trọ",
    },
    {
      id: 2,
      title: "CHO THUE NHA NGUYEN CAN",
      price: 13,
      area: 45,
      district: "Quận 1",
      city: "Hồ Chí Minh",
      description: "Can h6 2 phong ngu, 1 WCsach sé, gm cting, gia hgp ly",
      postedTime: "Hôm nay",
      contact: "0912345678",
      type: "Nhà nguyên căn",
    },
    // Thêm các listing khác ở đây
  ];
  return (
    <div>
        <Banner />
      <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        

        {/* Nội dung chính nằm bên phải */}
        <div className="w-full md:w-2/3">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Đề xuất </h2>
            <ListingCard listings={listings.slice(0, 6)} />
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Phòng trọ giá rẻ</h2>
            {/* <ListingGrid listings={listings.filter(l => l.price < 3).slice(0, 6)} /> */}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Căn hộ cao cấp</h2>
            {/* <ListingGrid listings={listings.filter(l => l.price > 5).slice(0, 6)} /> */}
          </div>
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
