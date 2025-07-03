import React, { useState } from 'react';
import { MapPin, Home, Building2, Layers, DollarSign, Maximize, Star, Heart, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoomListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [favorites, setFavorites] = useState(new Set());

  const building = {
    name: "Chung cư mini HOME CONVENIENT",
    address: "180 Cao Lỗ Phường 4 Quận 8 TP.HCM",
    description: "Tòa nhà mới xây gồm 5 tầng, 20 phòng hiện đại, an ninh 24/7, có chỗ để xe, thang máy, gần chợ và siêu thị.",
    image: "http://4.bp.blogspot.com/-l6K2NpDjDnA/VPpm87afMRI/AAAAAAAAAGc/eRP_2hZAkas/s1600/chung-cu-mini-ha-noi.jpg",
  };

  const rooms = [
    { id: 1, name: "Phòng 101", floor: 1, price: 3500000, area: 20, address: building.address, description: "Phòng tầng trệt, thuận tiện, sạch sẽ.", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400", rating: 4.5, amenities: ["Wifi", "Điều hòa"], available: true, type: "sinh-vien" },
    { id: 2, name: "Phòng 102", floor: 1, price: 3700000, area: 22, address: building.address, description: "Phòng rộng rãi, có cửa sổ lớn.", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400", rating: 4.4, amenities: ["Wifi", "Bảo vệ"], available: false, type: "sinh-vien" },
    { id: 3, name: "Phòng 103", floor: 1, price: 3200000, area: 18, address: building.address, description: "Phòng nhỏ tiết kiệm, đầy đủ tiện nghi cơ bản.", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400", rating: 4.2, amenities: ["Wifi"], available: true, type: "sinh-vien" },
    { id: 4, name: "Phòng 104", floor: 1, price: 3800000, area: 21, address: building.address, description: "Phòng có gác lửng, phù hợp cho cặp đôi.", image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", rating: 4.3, amenities: ["Wifi", "Điều hòa"], available: true, type: "sinh-vien" },
    { id: 5, name: "Phòng 201", floor: 2, price: 4200000, area: 25, address: building.address, description: "Phòng thoáng mát, view đẹp.", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400", rating: 4.6, amenities: ["Điều hòa", "Sân phơi"], available: true, type: "cao-cap" },
    { id: 6, name: "Phòng 202", floor: 2, price: 4000000, area: 24, address: building.address, description: "Phòng có ban công riêng.", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400", rating: 4.3, amenities: ["Giặt ủi", "Wifi"], available: true, type: "cao-cap" },
    { id: 7, name: "Phòng 203", floor: 2, price: 4500000, area: 26, address: building.address, description: "Phòng thiết kế hiện đại, nội thất mới.", image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", rating: 4.7, amenities: ["Điều hòa", "Tủ lạnh"], available: true, type: "cao-cap" },
    { id: 8, name: "Phòng 204", floor: 2, price: 3900000, area: 23, address: building.address, description: "Phòng yên tĩnh, cách âm tốt.", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400", rating: 4.4, amenities: ["Wifi", "Bảo vệ"], available: false, type: "cao-cap" },
    { id: 9, name: "Phòng 301", floor: 3, price: 4600000, area: 28, address: building.address, description: "Phòng trang bị nội thất cao cấp.", image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", rating: 4.8, amenities: ["Nội thất đầy đủ", "Bảo vệ"], available: true, type: "cao-cap" },
    { id: 10, name: "Phòng 302", floor: 3, price: 4800000, area: 30, address: building.address, description: "Phòng studio, view thành phố.", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400", rating: 4.9, amenities: ["Máy giặt", "Bếp"], available: true, type: "cao-cap" },
    { id: 11, name: "Phòng 303", floor: 3, price: 4300000, area: 26, address: building.address, description: "Phòng góc, 2 cửa sổ lớn.", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400", rating: 4.5, amenities: ["Điều hòa", "Wifi"], available: false, type: "cao-cap" },
    { id: 12, name: "Phòng 304", floor: 3, price: 4400000, area: 27, address: building.address, description: "Phòng thiết kế tối giản, sang trọng.", image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", rating: 4.6, amenities: ["Smart TV", "Điều hòa"], available: true, type: "cao-cap" },
    { id: 13, name: "Phòng 401", floor: 4, price: 5000000, area: 32, address: building.address, description: "Phòng penthouse nhỏ, view đẹp.", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400", rating: 4.9, amenities: ["Ban công", "Bếp"], available: true, type: "cao-cap" },
    { id: 14, name: "Phòng 402", floor: 4, price: 5200000, area: 35, address: building.address, description: "Phòng đôi rộng rãi, đầy đủ tiện nghi.", image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400", rating: 4.8, amenities: ["Máy giặt", "Bếp"], available: true, type: "cao-cap" },
    { id: 15, name: "Phòng 403", floor: 4, price: 4700000, area: 30, address: building.address, description: "Phòng góc 2 mặt thoáng, ánh sáng tự nhiên.", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400", rating: 4.7, amenities: ["Điều hòa", "Wifi"], available: true, type: "cao-cap" },
    { id: 16, name: "Phòng 501", floor: 5, price: 5500000, area: 40, address: building.address, description: "Penthouse cao cấp với đầy đủ tiện nghi.", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400", rating: 5.0, amenities: ["Bếp", "Máy giặt", "Smart TV"], available: false, type: "cao-cap" },
  ];

  const toggleFavorite = (roomId) => {
    const newFavorites = new Set(favorites);
    newFavorites.has(roomId) ? newFavorites.delete(roomId) : newFavorites.add(roomId);
    setFavorites(newFavorites);
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const filteredRooms = rooms.filter(room =>
    (room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     room.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedFilter === 'all' || room.type === selectedFilter)
  );

  const groupedByFloor = filteredRooms.reduce((acc, room) => {
    if (!acc[room.floor]) acc[room.floor] = [];
    acc[room.floor].push(room);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tòa nhà */}
      <div className="relative">
        <img src={building.image} alt="Chung cư" className="w-full h-72 object-cover" />
        <div className="absolute inset-0  bg-opacity-40 flex items-center justify-center">
          <div className="text-emerald-500 text-center">
            <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
              <Building2 className="w-8 h-8" />
              {building.name}
            </h1>
            <p className="text-s text-black flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4" /> {building.address}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 text-gray-700">
          <p className="text-lg">{building.description}</p>
        </div>

        {/* Tìm kiếm + Lọc */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm phòng theo tên hoặc tiện ích..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">Tất cả loại phòng</option>
              <option value="cao-cap">Cao cấp</option>
              <option value="sinh-vien">Sinh viên</option>
            </select>
          </div>
        </div>

        {/* Thống kê phòng */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              <Home className="text-blue-500 w-5 h-5" />
              <span className="font-medium">Tổng số phòng: <span className="text-blue-600">{rooms.length}</span></span>
            </div>
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              <Layers className="text-green-500 w-5 h-5" />
              <span className="font-medium">Số tầng: <span className="text-green-600">5</span></span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="text-purple-500 w-5 h-5" />
              <span className="font-medium">Giá từ: <span className="text-purple-600">{formatPrice(3200000)} - {formatPrice(5500000)}</span></span>
            </div>
          </div>
        </div>

        {/* Danh sách theo tầng */}
        {Object.entries(groupedByFloor).sort().map(([floor, rooms]) => (
          <div key={floor} className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Tầng {floor}</h2>
              <span className="text-sm text-gray-500">{rooms.length} phòng</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rooms.map((room) => (
                <div key={room.id} className={`bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 ${!room.available ? 'opacity-75' : ''}`}>
                  <div className="relative">
                    <img src={room.image} alt={room.name} className="w-full h-48 object-cover rounded-t-xl" />
                    <button onClick={() => toggleFavorite(room.id)} className={`absolute top-3 right-3 p-2 rounded-full ${favorites.has(room.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'}`}>
                      <Heart className="w-5 h-5" fill={favorites.has(room.id) ? 'currentColor' : 'none'} />
                    </button>
                    {!room.available && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-xl">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">Hết phòng</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white bg-opacity-90 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">{room.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{room.name}</h3>
                    <div className="text-sm text-gray-600 mb-2 flex gap-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-green-600 font-medium">{formatPrice(room.price)}/tháng</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Maximize className="w-4 h-4" />
                        <span>{room.area}m²</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{room.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {room.amenities.slice(0, 3).map((a, i) => (
                        <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{a}</span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">+{room.amenities.length - 3}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link to="/RentHouse/RentalRoomDetail" className={`flex-1 py-2 px-4 rounded-lg text-white text-center font-semibold ${room.available ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}>
                        {room.available ? 'Xem chi tiết' : 'Hết phòng'}
                      </Link>
                      <button className={`px-4 py-2 border rounded-lg font-semibold ${room.available ? 'border-blue-600 text-blue-600 hover:bg-blue-50' : 'border-gray-300 text-gray-400 cursor-not-allowed'}`} disabled={!room.available}>
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