import {
  AreaChart,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Eye,
  Heart,
  MapPin,
  Square,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";

function RoomSameArea() {
  const [likedRooms, setLikedRooms] = useState(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4); // Default for large screens

  const apartments = [
    // Your apartment data remains unchanged
    {
      id: 1,
      image: "/src/assets/img-4597_1746276984.jpg",
      title: "Căn hộ 1pn hiện đại tại Huỳnh Văn Bánh, Phú Nhuận",
      price: "11 triệu/tháng",
      area: "35 m²",
      location: "Phú Nhuận, Hồ Chí Minh",
      rating: 4.8,
      views: 1248,
      isNew: true,
      discount: "10%",
    },
    {
      id: 2,
      image: "/src/assets/img-4598_1746276976.jpg",
      title:
        "Căn hộ 2 phòng ngủ giá siêu iu thương tại ngay trung tâm Phú Nhuận",
      price: "8.3 triệu/tháng",
      area: "45 m²",
      location: "Phú Nhuận, Hồ Chí Minh",
      rating: 4.9,
      views: 892,
      isNew: false,
      discount: null,
    },
    {
      id: 3,
      image: "/src/assets/img-4599_1746276981.jpg",
      title: "Cho thuê căn hộ hiện đại ngay trung tâm Phú Nhuận",
      price: "7.9 triệu/tháng",
      area: "30 m²",
      location: "Phú Nhuận, Hồ Chí Minh",
      rating: 4.7,
      views: 567,
      isNew: true,
      discount: "5%",
    },
    {
      id: 4,
      image: "/src/assets/img-4598_1746276976.jpg",
      title:
        "Cho thuê dạng 1 phòng ngủ cửa sổ thoáng. Ngay trung tâm Phú Nhuận",
      price: "5.6 triệu/tháng",
      area: "25 m²",
      location: "Phú Nhuận, Hồ Chí Minh",
      rating: 4.6,
      views: 334,
      isNew: false,
      discount: null,
    },
    {
      id: 5,
      image: "/src/assets/img-4600_1746276972.jpg",
      title: "Căn hộ mới xây full nội thất giá tốt",
      price: "9 triệu/tháng",
      area: "40 m²",
      location: "Phú Nhuận, Hồ Chí Minh",
      rating: 4.8,
      views: 721,
      isNew: true,
      discount: "15%",
    },
    {
      id: 6,
      image: "/src/assets/img-4600_1746276972.jpg",
      title: "Studio cao cấp view đẹp giá hấp dẫn",
      price: "6.8 triệu/tháng",
      area: "28 m²",
      location: "Phú Nhuận, Hồ Chí Minh",
      rating: 4.5,
      views: 445,
      isNew: false,
      discount: null,
    },
  ];

  // Function to determine items per page based on screen width
  const updateItemsPerPage = () => {
    if (window.innerWidth < 640) {
      setItemsPerPage(1); // Mobile: 1 item
    } else if (window.innerWidth < 1024) {
      setItemsPerPage(2); // Tablet: 2 items
    } else if (window.innerWidth < 1280) {
      setItemsPerPage(3); // Larger tablet/small desktop: 3 items
    } else {
      setItemsPerPage(4); // Desktop: 4 items
    }
    setCurrentSlide(0); // Reset to first slide on resize
  };

  // Set initial items per page and listen for window resize
  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const totalSlides = Math.ceil(apartments.length / itemsPerPage);

  const toggleLike = (roomId) => {
    const newLikedRooms = new Set(likedRooms);
    if (newLikedRooms.has(roomId)) {
      newLikedRooms.delete(roomId);
    } else {
      newLikedRooms.add(roomId);
    }
    setLikedRooms(newLikedRooms);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // const getCurrentItems = () => {
  //     const startIndex = currentSlide * itemsPerPage;
  //     return apartments.slice(startIndex, startIndex + itemsPerPage);
  // };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white py-12">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <AreaChart className="h-6 w-6 text-amber-500" />
              <h2 className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-3xl font-bold text-transparent">
                Tin đăng cùng khu vực
              </h2>
            </div>
            <p className="text-gray-600">
              Khám phá những căn hộ mới được đăng tại khu vực này
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="rounded-full border border-gray-200 bg-white p-3 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="rounded-full border border-gray-200 bg-white p-3 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={currentSlide === totalSlides - 1}
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Apartments Grid */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {apartments
                    .slice(
                      slideIndex * itemsPerPage,
                      (slideIndex + 1) * itemsPerPage,
                    )
                    .map((apt) => (
                      <div
                        key={apt.id}
                        className="group transform overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-amber-200 hover:shadow-2xl"
                      >
                        {/* Image Container */}
                        <div className="relative overflow-hidden">
                          <img
                            src={apt.image}
                            alt={apt.title}
                            className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <div className="absolute top-3 left-3 flex gap-2">
                            {apt.isNew && (
                              <span className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
                                MỚI
                              </span>
                            )}
                            {apt.discount && (
                              <span className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
                                -{apt.discount}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleLike(apt.id);
                            }}
                            className="group/heart absolute top-3 right-3 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white"
                          >
                            <Heart
                              className={`h-4 w-4 transition-all duration-300 group-hover/heart:scale-110 ${
                                likedRooms.has(apt.id)
                                  ? "fill-current text-red-500"
                                  : "text-gray-600"
                              }`}
                            />
                          </button>
                          <div className="absolute bottom-3 left-3 flex gap-2">
                            <div className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 shadow-sm backdrop-blur-sm">
                              <Star className="h-3 w-3 fill-current text-yellow-400" />
                              <span className="text-xs font-medium text-gray-700">
                                {apt.rating}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 shadow-sm backdrop-blur-sm">
                              <Eye className="h-3 w-3 text-gray-500" />
                              <span className="text-xs font-medium text-gray-700">
                                {apt.views}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="mb-3 line-clamp-2 leading-tight font-bold text-gray-900 transition-colors duration-300 group-hover:text-amber-600">
                            {apt.title}
                          </h3>
                          <div className="mb-4 flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="text-xl font-bold text-green-600">
                              {apt.price}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Square className="h-4 w-4 text-blue-500" />
                              <span>
                                Diện tích: <strong>{apt.area}</strong>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-red-500" />
                              <span className="line-clamp-1">
                                {apt.location}
                              </span>
                            </div>
                          </div>
                          <button className="mt-4 w-full transform rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-amber-600 hover:to-orange-600 hover:shadow-xl">
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-gradient-to-r from-amber-500 to-orange-500"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-8 text-center">
          <button className="transform rounded-full border-2 border-gray-200 bg-white px-8 py-3 font-semibold text-gray-800 shadow-lg transition-all duration-300 hover:scale-105 hover:border-amber-300 hover:bg-gray-50 hover:shadow-xl">
            Xem tất cả tin đăng
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomSameArea;
