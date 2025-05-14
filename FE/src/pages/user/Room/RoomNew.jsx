
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

function RoomNew() {
    const apartments = [
        {
            image: "src/assets/img-4597_1746276984.jpg",
            title: "Căn hộ 1pn hiện đại tại Huỳnh Văn Bánh, Phú Nhuận",
            price: "11 triệu/tháng",
            area: "35 m²",
            location: "Phú Nhuận, Hồ Chí Minh",
        },
        {
            image: "src/assets/img-4598_1746276976.jpg",
            title: "Căn hộ 2 phòng ngủ giá siêu iu thương tại ngay trung tâm Phú Nhuận",
            price: "8.3 triệu/tháng",
            area: "45 m²",
            location: "Phú Nhuận, Hồ Chí Minh",
        },
        {
            image: "src/assets/img-4599_1746276981.jpg",
            title: "Cho thuê căn hộ hiện đại ngay trung tâm Phú Nhuận",
            price: "7.9 triệu/tháng",
            area: "30 m²",
            location: "Phú Nhuận, Hồ Chí Minh",
        },
        {
            image: "src/assets/img-4598_1746276976.jpg",
            title: "Cho thuê dạng 1 phòng ngủ cửa sổ thoáng. Ngay trung tâm Phú Nhuận",
            price: "5.6 triệu/tháng",
            area: "25 m²",
            location: "Phú Nhuận, Hồ Chí Minh",
        },
        {
            image: "src/assets/img-4600_1746276972.jpg",
            title: "Căn hộ mới xây full nội thất giá tốt",
            price: "9 triệu/tháng",
            area: "40 m²",
            location: "Phú Nhuận, Hồ Chí Minh",
        },
    ];

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Tin đăng mới nhất
            </h2>

            <Swiper
                spaceBetween={20}
                navigation={true}
                modules={[Navigation]}
                breakpoints={{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 4 },
                }}
                className="mySwiper"
            >
                {apartments.map((apt, index) => (
                    <SwiperSlide key={index}>
                        <a href={`/room-detail.html?id=${index}`} className="block">
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:bg-amber-100 cursor-pointer flex flex-col h-full min-h-[420px]">
                            <img
                                src={apt.image}
                                alt={apt.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                    {apt.title}
                                </h3>
                                <div className="mt-auto text-gray-600 text-sm space-y-1">
                                    <p>Giá: {apt.price}</p>
                                    <p>Diện tích: {apt.area}</p>
                                    <p>Khu vực: {apt.location}</p>
                                </div>
                            </div>
                        </div>
                        </a>
                    </SwiperSlide>
                ))}
            </Swiper>

        </div>
    );
}

export default RoomNew;
