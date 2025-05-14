
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Link } from 'react-router-dom';

import RoomSameArea from './RoomSameArea.jsx'
import RoomNew from './RoomNew.jsx'
function Detail() {
  const [selectedImage, setSelectedImage] = useState("src/assets/img-4597_1746276984.jpg");

  const thumbnails = [
    "src/assets/img-4597_1746276984.jpg",
    "src/assets/img-4598_1746276976.jpg",
    "src/assets/img-4599_1746276981.jpg",
    "src/assets/img-4599_1746276981.jpg",
    "src/assets/img-4600_1746276972.jpg",
  ];
  return (

    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6 ">
        <div >
          <a href="#" className="cursor-pointer">
            <span className="hover:text-amber-500 ">Cho thue can ho dich vo</span>
            <span> / </span>
          </a>
          <a href="" className=" cursor-pointer">
            <span className="hover:text-amber-500">Ho Chi Minh</span>
            <span> / </span>
          </a>
          <a href="" className="cursor-pointer">
            <span className="hover:text-amber-500"> Quan Phu Nhuan</span>
            <span> / </span>
          </a>
          <a href="" >
            <span>Phòng trọ giá rẻ an toàn, an ninh kế bên khu CNC, ĐH FPT, Tài Chính Marketing chuẩn PCCC</span>
          </a>
        </div>
        {/* Image Gallery */}
        <div className="space-y-3">
          {/* Large Image */}
          <div className="w-full h-[400px] bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
            <img
              src={selectedImage}
              alt="main"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Thumbnails Slider */}
          <Swiper
            slidesPerView={3}  // Hiển thị 3 hình nhỏ cùng lúc
            spaceBetween={10}
            navigation={true} // Thêm nút điều hướng
            modules={[Navigation]}
            className="mySwiper"
          >
            {thumbnails.map((src, i) => (
              <SwiperSlide key={i}>
                <img
                  src={src}
                  alt={`thumb-${i}`}
                  className="rounded-lg object-cover w-full h-32 cursor-pointer hover:ring-2 hover:ring-blue-400"
                  onClick={() => setSelectedImage(src)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* Title */}
        <h1 className="text-3xl font-bold text-amber-500">
          Phòng trọ giá rẻ an toàn, an ninh kế bên khu CNC, ĐH FPT, Tài Chính Marketing chuẩn PCCC
        </h1>


        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4 text-lg font-semibold text-gray-700">
          <div ><strong>Giá:</strong > 2.000.000 VNĐ/tháng</div>
          <div><strong>Diện tích:</strong> 20 m²</div>
          <div><strong>Địa chỉ:</strong> Đường XYZ, Quận 9, TP.HCM</div>
          <div><strong>Ngày đăng:</strong> 03/05/2025</div>
        </div>
        {/* Description */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">Chi tiết mô tả</h2>
          <p className="text-gray-700 leading-relaxed">
            Nguyễn Trọng Tuyển, p8, Phú Nhuận.

            Giá: 8.300.000

            ️Tiện nghi:

            - Đầy đủ nội thất, có máy giặt riêng

            - Sạch sẽ, hiện đại, thoáng mát, có ban công

            - Khu vực an ninh cao, ra vào vân tay, bảo vệ.


          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">Nổi bật </h2>
          <p className="text-gray-700 leading-relaxed">
            Gần bệnh viện, có máy, giặt bếp, ban công
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">Bản đồ  </h2>
          <p className="text-gray-700 leading-relaxed">
            Địa chỉ: Nguyễn Trọng Tuyển, Phường 8, Quận Phú Nhuận, Hồ Chí Minh
          </p>

        </div>

        {/* Poster Info */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">Thông tin liên hệ</h2>
          <div className="text-gray-700 space-y-1">
            <div><strong>Người đăng:</strong> Quỳnh Trang </div>
            <div><strong>Số điện thoại:</strong> 0344 773 350 </div>
            <div><strong>Email:</strong> Quynhtrang@gmail.com </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          {/* Avatar */}
          <img
            src="src/assets/avatar.jpg"
            alt="avatar"
            className="w-20 h-20 mx-auto rounded-full border-4 border-white shadow -mt-12 mb-3 object-cover"
          />

          {/* Name */}
          <h2 className="text-lg font-semibold">Quỳnh Trang </h2>
          <p className="text-green-500 text-sm flex justify-center items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block" /> Đang hoạt động
          </p>

          {/* Info line */}
          <p className="text-gray-500 text-sm mt-1">6 tin đăng ・Tham gia từ: 19/04/2025</p>

          {/* Phone button */}
          <button className="w-full mt-4 bg-green-500 text-white py-2 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-600">
            📞 0344773350
          </button>

          {/* Zalo button */}
          <button className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 mt-2">
            💬 Nhắn Zalo
          </button>

          {/* Actions */}
          <div className="flex justify-around mt-4 text-sm text-gray-600">
            <button className="hover:text-black flex flex-col items-center">
              <span className="text-3xl">♡</span>
              <span className="text-sm">Lưu tin</span>
            </button>
            <button className="hover:text-black flex flex-col items-center">
              <span className="text-2xl">🔗</span>
              <span className="text-sm mt-1">Chia sẻ</span>
            </button>
            <button className="hover:text-black flex flex-col items-center">
              <span className="text-2xl">⚠️</span>
              <span className="text-sm mt-1">Báo xấu</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8 px-4 max-w-7xl mx-auto">
        <RoomSameArea />
        <RoomNew />
      </div>
    </div>
  );
}
export default Detail

