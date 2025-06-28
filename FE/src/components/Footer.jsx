
const Footer = () => {
  return (
    <footer className="bg-[#ffce3f]/50 w-full py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 text-center">
          {/* Phòng trọ, nhà trọ */}
          <div className="space-y-2">
            <h3 className="text-black text-sm font-bold uppercase mb-2">Phòng trọ, nhà trọ</h3>
            <ul className="space-y-1">
              {['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Bình Dương', 'Đồng Nai', 'Vũng Tàu', 'Khánh Hòa'].map((city) => (
                <li key={city}>
                  <a href="#" className="text-black text-sm hover:underline">Phòng trọ {city}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Thuê nhà nguyên căn */}
          <div className="space-y-2">
            <h3 className="text-black text-sm font-bold uppercase mb-2">Thuê nhà nguyên căn</h3>
            <ul className="space-y-1">
              {['Hồ Chí Minh', 'Hà Nội', 'Bình Dương', 'Đà Nẵng', 'Đồng Nai', 'Cần Thơ', 'Khánh Hòa'].map((city) => (
                <li key={city}>
                  <a href="#" className="text-black text-sm hover:underline">Thuê nhà {city}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cho thuê căn hộ */}
          <div className="space-y-2">
            <h3 className="text-black text-sm font-bold uppercase mb-2">Cho thuê căn hộ</h3>
            <ul className="space-y-1">
              {['Hồ Chí Minh', 'Hà Nội', 'Bình Dương', 'Đà Nẵng', 'Hải Phòng', 'Khánh Hòa'].map((city) => (
                <li key={city}>
                  <a href="#" className="text-black text-sm hover:underline">Thuê căn hộ {city}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* LBKCorp System */}
        <div className="border-t border-b border-gray-300 py-6 mb-8">
          <div className="text-center text-gray-700 mb-4">Cùng hệ thống LBKCorp:</div>
          <div className="flex flex-wrap justify-center gap-4">
            {['logo1', 'logo2', 'logo3', 'logo4'].map((logo) => (
              <div key={logo} className="bg-white rounded-md p-3 w-36 h-12 flex items-center justify-center">
                {/* Placeholder for logo */}
                <div className="text-xs text-gray-500">{logo}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-gray-800 text-sm font-bold uppercase mb-3">Về HOME </h3>
            <ul className="space-y-2">
              {['Giới thiệu', 'Quy chế hoạt động', 'Quy định sử dụng', 'Chính sách bảo mật', 'Liên hệ'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-black text-sm hover:underline">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* For Customers */}
          <div>
            <h3 className="text-gray-800 text-sm font-bold uppercase mb-3">Dành cho khách hàng</h3>
            <ul className="space-y-2">
              {['Câu hỏi thường gặp', 'Hướng dẫn đăng tin', 'Bảng giá dịch vụ', 'Quy định đăng tin', 'Giải quyết khiếu nại'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-black text-sm hover:underline">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-gray-800 text-sm font-bold uppercase mb-3">Phương thức thanh toán</h3>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded p-1 border border-gray-200 flex items-center justify-center h-10">
                  {/* Payment logo placeholder */}
                  <span className="text-xs">Pay {i+1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-gray-800 text-sm font-bold uppercase mb-3">Theo dõi HOME</h3>
            <div className="flex gap-3">
              {['facebook', 'youtube', 'twitter', 'linkedin', 'tiktok'].map((social) => (
                <a key={social} href="#" className="size-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                  {/* Social icon placeholder */}
                  <span className="text-xs">{social[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Company Info */}
        {/* <div className="border-t border-gray-300 pt-6">
          <h3 className="text-gray-800 text-sm font-bold uppercase mb-3">CÔNG TY TNHH LBKCORP</h3>
          <p className="text-gray-700 text-xs mb-2">
            Căn 02.34, Lầu 2, Tháp 3, The Sun Avenue, Số 28 Mai Chí Thọ, Phường An Phú, Thành phố Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam.
          </p>
          <p className="text-gray-700 text-xs">
            Tổng đài CSKH: <span className="text-red-500">0909 316 890</span> - Email: cskh.phongtro123@gmail.com - Giấy phép đăng ký kinh doanh số 0313588502 do Sở kế hoạch và Đầu tư Tp.HCM cấp ngày 24 tháng 12 năm 2015.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="h-12 w-32 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-xs">Certificate 1</span>
            </div>
            <div className="h-12 w-32 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-xs">Certificate 2</span>
            </div>
          </div>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;