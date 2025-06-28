import { DollarSign, Filter, Heart, Home, MapPin, Search, Square, Star } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
const RoomListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [favorites, setFavorites] = useState(new Set());

  // Dữ liệu mẫu các phòng trọ
  const rooms = [
    {
      id: 1,
      name: "Phòng trọ cao cấp Quận 1",
      price: 8500000,
      area: 25,
      address: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
      description: "Phòng trọ hiện đại, đầy đủ tiện nghi, gần trung tâm thành phố. Có điều hòa, nóng lạnh, wifi miễn phí.",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      rating: 4.8,
      amenities: ["Điều hòa", "Wifi miễn phí", "Giặt ủi", "Bảo vệ 24/7"],
      available: true,
      type: "cao-cap"
    },
    {
      id: 2,
      name: "Phòng trọ sinh viên Quận 7",
      price: 3500000,
      area: 20,
      address: "456 Đường Huỳnh Tấn Phát, Quận 7, TP.HCM",
      description: "Phòng trọ giá rẻ dành cho sinh viên, gần trường đại học. Môi trường an ninh, sạch sẽ.",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      rating: 4.2,
      amenities: ["Wifi miễn phí", "Chỗ để xe", "Giờ giấc tự do"],
      available: true,
      type: "sinh-vien"
    },
    {
      id: 3,
      name: "Homestay gia đình Quận 3",
      price: 6000000,
      area: 30,
      address: "789 Đường Võ Văn Tần, Quận 3, TP.HCM",
      description: "Không gian ấm cúng như ở nhà, chủ nhà thân thiện. Phù hợp cho người đi làm lâu dài.",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      rating: 4.6,
      amenities: ["Bếp chung", "Sân phơi", "Điều hòa", "Wifi miễn phí"],
      available: false,
      type: "gia-dinh"
    },
    {
      id: 4,
      name: "Studio mini Quận 2",
      price: 7200000,
      area: 28,
      address: "321 Đường Thảo Điền, Quận 2, TP.HCM",
      description: "Studio hiện đại với thiết kế tối giản, đầy đủ nội thất. View đẹp, yên tĩnh.",
      image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop",
      rating: 4.9,
      amenities: ["Nội thất đầy đủ", "View đẹp", "Điều hòa", "Bảo vệ"],
      available: true,
      type: "cao-cap"
    },
    {
      id: 5,
      name: "Phòng trọ bình dân Quận 12",
      price: 2800000,
      area: 18,
      address: "654 Đường Tô Ký, Quận 12, TP.HCM",
      description: "Phòng trọ giá rẻ, phù hợp túi tiền sinh viên và người lao động. Giao thông thuận lợi.",
      image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop",
      rating: 3.8,
      amenities: ["Wifi", "Chỗ để xe", "Gần chợ"],
      available: true,
      type: "binh-dan"
    },
    {
      id: 6,
      name: "Căn hộ dịch vụ Quận 10",
      price: 9500000,
      area: 35,
      address: "987 Đường 3 Tháng 2, Quận 10, TP.HCM",
      description: "Căn hộ dịch vụ cao cấp với đầy đủ tiện ích. Dọn phòng hàng tuần, bảo vệ 24/7.",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop",
      rating: 4.7,
      amenities: ["Dọn phòng", "Gym", "Hồ bơi", "Bảo vệ 24/7"],
      available: true,
      type: "cao-cap"
    }
  ];

  const toggleFavorite = (roomId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(roomId)) {
      newFavorites.delete(roomId);
    } else {
      newFavorites.add(roomId);
    }
    setFavorites(newFavorites);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || room.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Home className="text-blue-600" />
              Nhà Trọ Tiện Nghi
            </h1>
            <div className="text-sm text-gray-600">
              {filteredRooms.length} phòng có sẵn
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên phòng hoặc địa chỉ..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="all">Tất cả loại phòng</option>
                <option value="cao-cap">Cao cấp</option>
                <option value="sinh-vien">Sinh viên</option>
                <option value="gia-dinh">Gia đình</option>
                <option value="binh-dan">Bình dân</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Room Cards */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${!room.available ? 'opacity-75' : ''
                }`}
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <button
                  onClick={() => toggleFavorite(room.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${favorites.has(room.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-400 hover:text-red-500'
                    }`}
                >
                  <Heart className="w-5 h-5" fill={favorites.has(room.id) ? 'currentColor' : 'none'} />
                </button>

                {!room.available && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-xl">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Hết phòng
                    </span>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white bg-opacity-90 px-2 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold">{room.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{room.name}</h3>

                <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold text-green-600">{formatPrice(room.price)}/tháng</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="w-4 h-4" />
                    <span>{room.area}m²</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{room.address}</span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {room.description}
                </p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.slice(0, 3).map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                  {room.amenities.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{room.amenities.length - 3} tiện ích
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {room.available ? (
                    <Link
                      to="/RentHouse/RentalRoomDetail"    
                      className="flex-1 py-2 px-4 rounded-lg font-semibold bg-blue-600 text-white
                 hover:bg-blue-700 transition-colors text-center"
                    >
                      Xem chi tiết
                    </Link>
                  ) : (
                    <button
                      className="flex-1 py-2 px-4 rounded-lg font-semibold bg-gray-300
                 text-gray-500 cursor-not-allowed"
                      disabled
                    >
                      Hết phòng
                    </button>
                  )}
                  <button
                    className={`px-4 py-2 border rounded-lg font-semibold transition-colors ${room.available
                        ? 'border-blue-600 text-blue-600 hover:bg-blue-50'
                        : 'border-gray-300 text-gray-400 cursor-not-allowed'
                      }`}
                    disabled={!room.available}
                  >
                    Liên hệ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Home className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy phòng nào</h3>
            <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomListing;