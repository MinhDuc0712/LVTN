import { useState } from 'react';
import { Check, Star, Home, List, Sparkles } from 'lucide-react';

export default function PricingTable() {
  const [duration, setDuration] = useState(3);

  const pricingPlans = [
    {
      name: 'Tin VIP',
      color: 'bg-gradient-to-r from-pink-500 to-red-500',
      textColor: 'text-white',
      dailyPrice: 30000,
      icon: <Sparkles className="w-6 h-6" />,
      features: [
        'Hiển thị trên trang chủ',
        'Màu sắc nổi bật',
        'Không cần chờ phê duyệt',
        'Ưu tiên hiển thị cao'
      ],
      description: 'Tin đăng sẽ hiển thị lên trang đầu và không phải chờ phê duyệt.',
      popular: true
    },
    {
      name: 'Tin thường',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      textColor: 'text-white',
      dailyPrice: 5000, // Đã đổi từ 2000 lên 5000
      icon: <List className="w-6 h-6" />,
      features: [
        'Hiển thị trong danh mục',
        'Màu sắc mặc định',
        'Cần chờ phê duyệt',
        'Giá cả phải chăng'
      ],
      description: 'Tin đăng sẽ hiển thị trong danh mục và phải chờ phê duyệt mới được hiển thị.'
    }
  ];

  const calculatePrice = (plan, days) => {
    return plan.dailyPrice * days;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Bảng giá dịch vụ</h1>
          <p className="text-gray-600 mb-8">Chọn gói phù hợp với nhu cầu của bạn</p>
          
          {/* Duration Selector */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-2 shadow-md">
              <div className="flex space-x-2">
                {[3, 7, 30].map((days) => (
                  <button
                    key={days}
                    onClick={() => setDuration(days)}
                    className={`px-6 py-3 rounded-md font-medium transition-colors ${
                      duration === days
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {days === 3 ? '3 ngày' : days === 7 ? '1 tuần' : '1 tháng'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${
                plan.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 text-sm font-medium">
                  <Star className="inline w-4 h-4 mr-1" /> Được ưa chuộng nhất
                </div>
              )}
              
              {/* Header */}
              <div className={`${plan.color} ${plan.textColor} p-8 text-center ${plan.popular ? 'pt-12' : ''}`}>
                <div className="flex justify-center mb-4">
                  {plan.icon}
                </div>
                <h3 className="font-bold text-2xl mb-4">{plan.name}</h3>
                
                {/* Price */}
                <div className="mb-4">
                  <div className="text-4xl font-bold mb-2">
                    {formatPrice(calculatePrice(plan, duration))}
                  </div>
                  <div className="text-lg opacity-90">
                    {formatPrice(plan.dailyPrice)}/ngày × {duration} ngày
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="p-8">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-600 italic">
                    {plan.description}
                  </p>
                </div>
                
                <button 
                  className={`w-full font-medium py-3 px-6 rounded-lg transition-colors ${
                    plan.popular 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                      : 'bg-gray-800 hover:bg-gray-900 text-white'
                  }`}
                >
                  Chọn gói này
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-800 text-white p-6">
            <h3 className="text-xl font-bold text-center">So sánh chi tiết</h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left py-4 px-4 font-semibold">Tính năng</th>
                    <th className="text-center py-4 px-4 font-semibold text-blue-600">Tin VIP</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-600">Tin thường</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-4 px-4">Vị trí hiển thị</td>
                    <td className="py-4 px-4 text-center">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        <Home className="inline w-4 h-4 mr-1" /> Trang chủ
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        <List className="inline w-4 h-4 mr-1" /> Trong danh mục
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Thời gian phê duyệt</td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-green-600 font-medium">
                        <Check className="inline w-4 h-4 mr-1" /> Tức thì
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-orange-600 font-medium">Cần chờ duyệt</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Giá mỗi ngày</td>
                    <td className="py-4 px-4 text-center font-bold text-blue-600">30.000đ</td>
                    <td className="py-4 px-4 text-center font-bold text-gray-600">5.000đ</td> {/* Đã cập nhật giá */}
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Độ ưu tiên</td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        {[...Array(2)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        {[...Array(3)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-gray-300" />
                        ))}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 bg-blue-50 p-6 rounded-lg">
          <p className="text-blue-800 font-medium mb-2">
            <Check className="inline w-4 h-4 mr-1" /> Lưu ý quan trọng
          </p>
          <p className="text-blue-700 text-sm">
            Tối thiểu đăng tin ít nhất 3 ngày. Tin VIP sẽ được hiển thị ngay lập tức không cần chờ phê duyệt.
          </p>
        </div>
      </div>
    </div>
  );
}