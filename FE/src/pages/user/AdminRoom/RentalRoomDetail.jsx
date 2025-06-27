import { useState } from 'react';
import { MapPin, Phone, Star, Heart, Share2, Wifi, Car, Home, Zap, Wind, Tv, Camera, MessageCircle, ThumbsUp, Calendar, CheckCircle, X } from 'lucide-react';

const amenities = [
  { icon: Wind, name: 'Điều hòa' },
  { icon: Wifi, name: 'Wifi' },
  { icon: Zap, name: 'Bếp từ' },
  { icon: Home, name: 'Máy giặt' },
  { icon: Home, name: 'Tủ lạnh' },
  { icon: Tv, name: 'Tivi' }
];

const reviews = [
  {
    id: 1,
    name: 'Nguyễn Minh Anh',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    rating: 5,
    date: '2 tuần trước',
    comment: 'Phòng rất đẹp, sạch sẽ và tiện nghi đầy đủ. Chủ nhà rất thân thiện và hỗ trợ nhiệt tình. Tôi sẽ ở lại lâu dài.'
  },
  {
    id: 2,
    name: 'Trần Văn Bình',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    rating: 4,
    date: '1 tháng trước',
    comment: 'Vị trí thuận tiện, gần trung tâm. Phòng khá ổn nhưng cần cải thiện thêm về âm thanh cách âm.'
  },
  {
    id: 3,
    name: 'Lê Thị Cẩm',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    rating: 5,
    date: '1 tháng trước',
    comment: 'Phòng tuyệt vời! Nội thất hiện đại, wifi mạnh, có chỗ để xe an toàn. Rất hài lòng với sự lựa chọn này.'
  }
];

const RentalRoomDetail = () => {
  const [showContractModal, setShowContractModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    idNumber: '',
    startDate: '',
    duration: '1',
    termsAgreed: false
  });
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
    name: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitContract = (e) => {
    e.preventDefault();
    console.log('Contract data:', formData);
    setShowContractModal(false);
    alert('Đăng ký thuê phòng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    console.log('Review data:', reviewForm);
    setShowReviewModal(false);
    alert('Cảm ơn bạn đã đánh giá!');
    setReviewForm({ rating: 5, comment: '', name: '' });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} size={16} className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Navigation */}
        <nav className="flex items-center justify-between mb-8">
          <div className="text-sm text-gray-600">
            <span className="hover:text-blue-600 cursor-pointer">Trang chủ</span>
            <span className="mx-2">/</span>
            <span className="hover:text-blue-600 cursor-pointer">Danh sách phòng</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-800">Chi tiết phòng</span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setLiked(!liked)}
              className={`p-2 rounded-full border transition-all ${liked ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
            >
              <Heart size={20} className={liked ? 'fill-current' : ''} />
            </button>
            <button className="p-2 rounded-full border bg-white border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
              <Share2 size={20} />
            </button>
          </div>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative">
              <div className="grid grid-cols-4 gap-2 h-96">
                <div className="col-span-2 row-span-2">
                  <img 
                    src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop" 
                    alt="Main room" 
                    className="w-full h-full object-cover rounded-l-2xl"
                  />
                </div>
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&h=200&fit=crop" 
                    alt="Kitchen" 
                    className="w-full h-full object-cover rounded-tr-2xl"
                  />
                </div>
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=200&fit=crop" 
                    alt="Bathroom" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop" 
                    alt="Bedroom" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=300&h=200&fit=crop" 
                    alt="Living room" 
                    className="w-full h-full object-cover rounded-br-2xl"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-br-2xl flex items-center justify-center">
                    <button className="text-white flex items-center gap-2 hover:underline">
                      <Camera size={20} />
                      <span>Xem thêm ảnh</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Details */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-3">Phòng cao cấp trung tâm Quận 1</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {renderStars(5)}
                      <span className="ml-2 text-gray-600 font-medium">4.8 (127 đánh giá)</span>
                    </div>
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      ✓ Có sẵn ngay
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">8,000,000₫</div>
                  <div className="text-gray-500">/ tháng</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Mô tả chi tiết</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Phòng trọ cao cấp được thiết kế hiện đại với đầy đủ nội thất tiện nghi. Tọa lạc tại vị trí vàng trung tâm Quận 1, 
                  thuận tiện di chuyển đến các khu vực làm việc, mua sắm và giải trí. Phòng được trang bị đầy đủ điều hòa, wifi tốc độ cao, 
                  bếp từ hiện đại, máy giặt, tủ lạnh và TV thông minh. Tòa nhà có hệ thống an ninh 24/7, thang máy và khu vực để xe riêng biệt.
                </p>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Tiện nghi nổi bật</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                      <amenity.icon className="text-blue-600" size={24} />
                      <span className="font-medium text-gray-700">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Vị trí</h2>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <MapPin className="text-red-500 mt-1" size={24} />
                  <div>
                    <p className="font-medium text-gray-800">123 Nguyễn Huệ, Bến Nghé, Quận 1, TP.HCM</p>
                    <p className="text-gray-600 mt-1">Trung tâm thành phố • Gần Metro • Nhiều tiện ích xung quanh</p>
                    <button className="text-blue-600 hover:underline mt-2 font-medium">
                      Xem trên bản đồ →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Đánh giá từ khách thuê</h2>
                <button 
                  onClick={() => setShowReviewModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Viết đánh giá
                </button>
              </div>
              
              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <img 
                        src={review.avatar} 
                        alt={review.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-800">{review.name}</h4>
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-gray-500 text-sm">{review.date}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                            <ThumbsUp size={16} />
                            <span className="text-sm">Hữu ích (12)</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                            <MessageCircle size={16} />
                            <span className="text-sm">Trả lời</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Chi tiết đặt phòng</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Giá thuê hàng tháng</span>
                  <span className="font-semibold text-gray-800">8,000,000₫</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Phí dịch vụ</span>
                  <span className="font-semibold text-gray-800">500,000₫</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Tiền đặt cọc</span>
                  <span className="font-semibold text-gray-800">8,000,000₫</span>
                </div>
                <div className="flex justify-between items-center py-4 bg-blue-50 rounded-lg px-4">
                  <span className="font-bold text-gray-800">Tổng chi phí ban đầu</span>
                  <span className="font-bold text-2xl text-blue-600">16,500,000₫</span>
                </div>
              </div>

              <button
                onClick={() => setShowContractModal(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg mb-4"
              >
                Đặt phòng ngay
              </button>

              <div className="text-center mb-4">
                <p className="text-gray-500 text-sm mb-3">Hoặc liên hệ trực tiếp chủ nhà</p>
                <button className="w-full flex items-center justify-center gap-3 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-medium">
                  <Phone size={20} />
                  0901 234 567
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                <CheckCircle size={16} className="text-green-500" />
                <span>Miễn phí hủy trong 24h đầu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Modal */}
        {showContractModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Đăng ký thuê phòng</h3>
                <button 
                  onClick={() => setShowContractModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    name="fullName" 
                    required 
                    value={formData.fullName} 
                    onChange={handleInputChange} 
                    placeholder="Họ tên đầy đủ" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="Số điện thoại" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    name="sex" 
                    required 
                    value={formData.sex} 
                    onChange={handleInputChange} 
                    placeholder="Giới tính" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input 
                    type="tel" 
                    name="date" 
                    required 
                    value={formData.tel} 
                    onChange={handleInputChange} 
                    placeholder="Ngày sinh" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder="Email" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <input 
                  type="text" 
                  name="idNumber" 
                  required 
                  value={formData.idNumber} 
                  onChange={handleInputChange} 
                  placeholder="Số CMND/CCCD" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu thuê</label>
                    <input 
                      type="date" 
                      name="startDate" 
                      required 
                      value={formData.startDate} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thời hạn thuê</label>
                    <select 
                      name="duration" 
                      value={formData.duration} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="1">1 tháng</option>
                      <option value="3">3 tháng</option>
                      <option value="6">6 tháng</option>
                      <option value="12">12 tháng</option>
                    </select>
                  </div>
                </div>

                {/* <label className="flex items-start gap-3 text-sm">
                  <input 
                    type="checkbox" 
                    name="termsAgreed" 
                    checked={formData.termsAgreed} 
                    onChange={handleInputChange} 
                    className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">
                    Tôi đồng ý với <a href="#" className="text-blue-600 hover:underline font-medium">điều khoản thuê phòng</a> và 
                    <a href="#" className="text-blue-600 hover:underline font-medium"> chính sách bảo mật</a>
                  </span>
                </label> */}

                <button 
                  onClick={handleSubmitContract}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  Xác nhận đăng ký
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Viết đánh giá</h3>
                <button 
                  onClick={() => setShowReviewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên của bạn</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    value={reviewForm.name} 
                    onChange={handleReviewChange} 
                    placeholder="Nhập họ tên" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Đánh giá của bạn</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none"
                      >
                        <Star 
                          size={32} 
                          className={star <= reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nhận xét chi tiết</label>
                  <textarea 
                    name="comment" 
                    required 
                    value={reviewForm.comment} 
                    onChange={handleReviewChange} 
                    placeholder="Chia sẻ trải nghiệm của bạn về phòng trọ này..." 
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <button 
                  onClick={handleSubmitReview}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  Gửi đánh giá
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalRoomDetail;