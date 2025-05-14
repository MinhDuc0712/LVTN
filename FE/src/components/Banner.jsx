// components/BannerSlider.jsx
import React, { useState, useEffect } from "react";
import banner1 from "../assets/Banner.png";
import banner2 from "../assets/Banner1.png";

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Danh sách banner
  const banners = [
    {
      image: banner1,
      title: "Tìm phòng trọ ưng ý",
      subtitle: "Hơn 70.000+ phòng trọ chất lượng trên toàn quốc",
      buttonText: "Tìm phòng ngay",
    },
    {
      image: banner2,
      title: "Đăng tin miễn phí",
      subtitle: "Tiếp cận hàng ngàn người có nhu cầu",
      buttonText: "Đăng tin ngay",
    },
  ];

  // Tự động chuyển slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000); // Chuyển slide mỗi 5 giây

    return () => clearInterval(interval);
  }, [banners.length]);

  // Chuyển đến slide cụ thể
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative mb-6 h-50 w-full overflow-hidden shadow-xl sm:h-96 md:h-[500px] lg:h-[500px] xl:h-[520px]">
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={index} className="relative h-full w-full flex-shrink-0">
            {/* Hình ảnh banner */}
            <img
              src={banner.image}
              alt={`Banner ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="absolute right-0 bottom-4 left-0 flex justify-center space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full transition-colors ${
              index === currentSlide
                ? "bg-orange-500"
                : "bg-opacity-50 bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() =>
          setCurrentSlide(
            (prev) => (prev - 1 + banners.length) % banners.length,
          )
        }
        className="bg-opacity-50 hover:bg-opacity-75 absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-black p-2 text-white"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
        className="bg-opacity-50 hover:bg-opacity-75 absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-black p-2 text-white"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default BannerSlider;
