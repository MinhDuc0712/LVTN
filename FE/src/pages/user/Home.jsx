import React from "react";
import FilterSection from "../../components/FilterSection";
import ListingCard from "../../components/ListingCard";
import Banner from "../../components/Banner";

const Home = () => {
  const listings = [
    {
      id: 1,
      title:
        "Phòng trọ giá rẻ an toàn, an ninh kế bên khu CNC, ĐH FPT, Tài Chính Marketing chuẩn PCCC",
      price: 2.0,
      area: 20,
      district: "Quận Phú Nhuận",
      city: "Hồ Chí Minh",
      address: "Nguyễn Trọng Tuyển, P.8, Phú Nhuận",
      description:
        "Đầy đủ nội thất, có máy giặt riêng. Sạch sẽ, hiện đại, thoáng mát, có ban công. Khu vực an ninh cao, ra vào vân tay, bảo vệ.",
      postedTime: "3 ngày trước",
      contact: "0344773350",
      posterName: "Quỳnh Trang",
      type: "Phòng trọ",
      image: "src/assets/img-4597_1746276984.jpg",
    },
    {
      id: 2,
      title: "Căn hộ 1pn hiện đại tại Huỳnh Văn Bánh, Phú Nhuận",
      price: 11.0,
      area: 35,
      district: "Quận Phú Nhuận",
      city: "Hồ Chí Minh",
      address: "Huỳnh Văn Bánh, Phú Nhuận",
      description:
        "Căn hộ 1 phòng ngủ hiện đại, đầy đủ tiện nghi, gần trung tâm thành phố.",
      postedTime: "1 tuần trước",
      contact: "0912345678",
      posterName: "Minh Tuấn",
      type: "Căn hộ",
      image: "src/assets/img-4598_1746276976.jpg",
    },
    {
      id: 3,
      title: "Cho thuê căn hộ hiện đại ngay trung tâm Phú Nhuận",
      price: 7.9,
      area: 30,
      district: "Quận Phú Nhuận",
      city: "Hồ Chí Minh",
      address: "Trung tâm Phú Nhuận",
      description: "Căn hộ hiện đại, vị trí đắc địa, giao thông thuận tiện.",
      postedTime: "5 ngày trước",
      contact: "0987654321",
      posterName: "Thu Hằng",
      type: "Căn hộ",
      image: "src/assets/img-4599_1746276981.jpg",
    },
  ];
  return (
    <div>
      <Banner />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Nội dung chính nằm bên phải */}
          <div className="w-full md:w-2/3">
            <div className="mb-6">
              <h2 className="mb-4 text-xl font-bold">Đề xuất </h2>
              <ListingCard listings={listings.slice(0, 6)} />
            </div>

            {/* <div className="mb-6">
              <h2 className="mb-4 text-xl font-bold">Phòng trọ giá rẻ</h2>
              <ListingGrid listings={listings.filter(l => l.price < 3).slice(0, 6)} />
            </div>

            <div className="mb-6">
              <h2 className="mb-4 text-xl font-bold">Căn hộ cao cấp</h2>
              <ListingGrid listings={listings.filter(l => l.price > 5).slice(0, 6)} />
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
