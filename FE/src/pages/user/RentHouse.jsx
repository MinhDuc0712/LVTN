import React, { useEffect, useState } from "react";
import {
  MapPin,
  Home,
  Building2,
  Layers,
  DollarSign,
  Maximize,
  Star,
  Heart,
  Search,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getRoomUserAPI } from "../../api/homePage";

const RoomListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [favorites, setFavorites] = useState(new Set());
  const [rooms, setRooms] = useState([]);

  const building = {
    name: "Chung cư mini HOME CONVENIENT",
    address: "180 Cao Lỗ Phường 4 Quận 8 TP.HCM",
    description:
      "Tòa nhà mới xây gồm 5 tầng, 20 phòng hiện đại, an ninh 24/7, có chỗ để xe, thang máy, gần chợ và siêu thị.",
    image:
      "http://4.bp.blogspot.com/-l6K2NpDjDnA/VPpm87afMRI/AAAAAAAAAGc/eRP_2hZAkas/s1600/chung-cu-mini-ha-noi.jpg",
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRoomUserAPI();
        // console.log("Dữ liệu phòng:", data);
        const formatted = data.map((r) => ({
          id: r.id,
          name: r.ten_phong,
          area: r.dien_tich,
          description: r.mo_ta,
          floor: r.tang,
          price: Number(r.gia),
          available: r.trang_thai === "trong",
          image: r.images?.[0]?.image_path ?? "",
          rating: 4.5,
          amenities: [],
        }));
        setRooms(formatted);
        console.log("Phòng đã định dạng:", formatted);
      } catch (err) {
        console.error("Lỗi tải phòng:", err);
      }
    };
    fetchRooms();
  }, []);

  const toggleFavorite = (roomId) => {
    const newFavorites = new Set(favorites);
    newFavorites.has(roomId)
      ? newFavorites.delete(roomId)
      : newFavorites.add(roomId);
    setFavorites(newFavorites);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const filteredRooms = rooms.filter(
    (room) =>
      (room.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedFilter === "all" || room.type === selectedFilter),
  );

  const groupedByFloor = filteredRooms.reduce((acc, room) => {
    if (!acc[room.floor]) acc[room.floor] = [];
    acc[room.floor].push(room);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <img
          src={building.image}
          alt="Chung cư"
          className="h-72 w-full object-cover"
        />
        <div className="bg-opacity-40 absolute inset-0 flex items-center justify-center">
          <div className="text-center text-emerald-500">
            <h1 className="mb-2 flex items-center justify-center gap-2 text-4xl font-bold">
              <Building2 className="h-8 w-8" /> {building.name}
            </h1>
            <p className="text-s flex items-center justify-center gap-2 text-black">
              <MapPin className="h-4 w-4" /> {building.address}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 text-gray-700">
          <p className="text-lg">{building.description}</p>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Tìm phòng theo tên hoặc tiện ích..."
              className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="rounded-lg border border-gray-300 px-4 py-3"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">Tất cả loại phòng</option>
              <option value="cao-cap">Cao cấp</option>
              <option value="sinh-vien">Sinh viên</option>
            </select>
          </div>
        </div>

        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <div className="flex flex-wrap items-center justify-between">
            <div className="mb-2 flex items-center gap-2 sm:mb-0">
              <Home className="h-5 w-5 text-blue-500" />
              <span className="font-medium">
                Tổng số phòng:{" "}
                <span className="text-blue-600">{rooms.length}</span>
              </span>
            </div>
            <div className="mb-2 flex items-center gap-2 sm:mb-0">
              <Layers className="h-5 w-5 text-green-500" />
              <span className="font-medium">
                Số tầng: <span className="text-green-600">{rooms?.[rooms.length-1]?.floor}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-500" />
              <span className="font-medium">
                Giá từ:{" "}
                <span className="text-purple-600">
                  {formatPrice(Math.min(...rooms.map((r) => r.price)))}- {formatPrice(Math.max(...rooms.map((r) => r.price)))}
                </span>
              </span>
            </div>
          </div>
        </div>

        {Object.entries(groupedByFloor)
          .sort()
          .map(([floor, rooms]) => (
            <div key={floor} className="mb-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  Tầng {floor}
                </h2>
                <span className="text-sm text-gray-500">
                  {rooms.length} phòng
                </span>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className={`rounded-xl bg-white shadow transition-all duration-300 hover:shadow-lg ${!room.available ? "opacity-75" : ""}`}
                  >
                    <div className="relative">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="h-48 w-full rounded-t-xl object-cover"
                      />
                      <button
                        onClick={() => toggleFavorite(room.id)}
                        className={`absolute top-3 right-3 rounded-full p-2 ${favorites.has(room.id) ? "bg-red-500 text-white" : "bg-white text-gray-400 hover:text-red-500"}`}
                      >
                        <Heart
                          className="h-5 w-5"
                          fill={
                            favorites.has(room.id) ? "currentColor" : "none"
                          }
                        />
                      </button>
                      {!room.available && (
                        <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-t-xl bg-black">
                          <span className="rounded-full bg-red-500 px-3 py-1 text-sm text-white">
                            Hết phòng
                          </span>
                        </div>
                      )}
                      <div className="bg-opacity-90 absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white px-2 py-1">
                        <Star className="h-4 w-4 fill-current text-yellow-400" />
                        <span className="text-sm font-semibold">
                          {room.rating}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="mb-1 text-lg font-semibold text-gray-800">
                        {room.name}
                      </h3>
                      <div className="mb-2 flex gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-medium text-green-600">
                            {formatPrice(room.price)}/tháng
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Maximize className="h-4 w-4" />
                          <span>{room.area}m²</span>
                        </div>
                      </div>
                      <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                        {room.description}
                      </p>
                      <div className="mb-3 flex flex-wrap gap-2">
                        {room.amenities.slice(0, 3).map((a, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700"
                          >
                            {a}
                          </span>
                        ))}
                        {room.amenities.length > 3 && (
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                            +{room.amenities.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/RentHouse/RentalRoomDetail/${room.id}`}
                          className={`flex-1 rounded-lg px-4 py-2 text-center font-semibold text-white ${room.available ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-gray-300"}`}
                        >
                          {room.available ? "Xem chi tiết" : "Hết phòng"}
                        </Link>
                        <button
                          className={`rounded-lg border px-4 py-2 font-semibold ${room.available ? "border-blue-600 text-blue-600 hover:bg-blue-50" : "cursor-not-allowed border-gray-300 text-gray-400"}`}
                          disabled={!room.available}
                        >
                          Liên hệ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RoomListing;
