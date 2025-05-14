
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom'; 
function UserPost() {

    return (
        <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen p-4 md:p-6">
            
                <Sidebar />
    

            <div className="w-full md:w-3/4 p-4 md:p-6 bg-white rounded-lg shadow-lg overflow-auto">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-700">Đăng tin cho thuê</h1>

                <div className="border-b mb-6">
                    <button className="mr-4 ">Thông tin mô tả </button>
                </div>

                <div className="bg-white p-4 rounded shadow mb-6">
                    <h2 className="text-lg font-bold mb-2">Loại danh mục</h2>
                    <label className="block mb-2">Loại chuyên mục <span className="text-red-600">(*)</span></label>
                    <select className="w-full p-2 border rounded">
                        <option>-- Chọn loại chuyên mục --</option>
                    </select>
                </div>

                <div className="bg-white p-4 rounded shadow mb-6">
                    <h2 className="text-lg font-bold mb-2">Khu vực</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            ['Tỉnh/Thành phố', '-- Chọn Tỉnh/TP --'],
                            ['Quận/Huyện', '-- Chọn quận huyện --'],
                            ['Phường/Xã', '-- Chọn phường xã --'],
                            ['Đường/Phố', '-- Chọn đường phố --'],
                        ].map(([labelText, optionText], i) => (
                            <div key={i}>
                                <label className="block mb-2">{labelText} <span className="text-red-600">(*)</span></label>
                                <select className="w-full p-2 border rounded">
                                    <option>{optionText}</option>
                                </select>
                            </div>
                        ))}
                        <div>
                            <label className="block mb-2">Số nhà <span className="text-red-600">(*)</span></label>
                            <input type="text" className="w-full p-2 border rounded" placeholder="Nhập số nhà" />
                        </div>
                        <div>
                            <label className="block mb-2">Địa chỉ <span className="text-red-600">(*)</span></label>
                            <input type="text" className="w-full p-2 border rounded" placeholder="Nhập địa chỉ" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded shadow mb-6">
                    <h2 className="text-lg font-bold mb-2">Thông tin mô tả</h2>

                    <div className="mb-4">
                        <label className="block font-semibold mb-1">
                            Tiêu đề <span className="text-red-600">(*)</span>
                        </label>
                        <textarea className="w-full p-2 border rounded" rows="2" placeholder="Nhập tiêu đề" />
                        <p className="text-sm text-gray-500">(Tối thiểu 30 ký tự, tối đa 100 ký tự)</p>
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold mb-1">
                            Nội dung mô tả <span className="text-red-600">(*)</span>
                        </label>
                        <textarea className="w-full p-2 border rounded" rows="6" placeholder="Nhập nội dung mô tả chi tiết" />
                        <p className="text-sm text-gray-500">(Tối thiểu 50 ký tự, tối đa 5000 ký tự)</p>
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold mb-1">
                            Giá cho thuê <span className="text-red-600">(*)</span>
                        </label>
                        <div className="flex">
                            <input type="number" className="w-full sm:w-auto flex-grow p-2 border rounded-l" placeholder="Nhập giá, ví dụ: 1000000" />
                            <span className="p-2 border border-l-0 rounded-r bg-gray-100">đồng/tháng</span>
                        </div>
                        <p className="text-sm text-gray-500">Nhập đầy đủ số, ví dụ 1 triệu thì nhập là 1000000</p>
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold mb-1">
                            Diện tích <span className="text-red-600">(*)</span>
                        </label>
                        <div className="flex">
                            <input type="number" className="w-full sm:w-auto flex-grow p-2 border rounded-l" placeholder="Nhập diện tích" />
                            <span className="p-2 border border-l-0 rounded-r bg-gray-100">m²</span>
                        </div>
                    </div>
                </div>

                {/* Đặc điểm nổi bật */}
                <div className="bg-white p-4 rounded shadow mb-6">
                    <h2 className="text-lg font-bold mb-4">Đặc điểm nổi bật</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm">
                        {[
                            'Đầy đủ nội thất',
                            'Có máy lạnh',
                            'Có thang máy',
                            'Có bảo vệ 24/24',
                            'Có gác',
                            'Có máy giặt',
                            'Không chung chủ',
                            'Có hầm để xe',
                            'Có kệ bếp',
                            'Có tủ lạnh',
                            'Giờ giấc tự do',
                        ].map((label, idx) => (
                            <label key={idx} className="flex items-center space-x-2">
                                <input type="checkbox" className="accent-blue-500" />
                                <span>{label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Hình ảnh */}
                <div className="bg-white p-4 rounded shadow mb-6">
                    <h2 className="text-lg font-bold mb-4">Hình ảnh</h2>
                    <div className="border-2 border-dashed border-blue-400 p-6 rounded-lg flex flex-col items-center justify-center bg-blue-50 cursor-pointer hover:bg-blue-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <p className="text-blue-600 font-medium">Tải ảnh từ thiết bị</p>
                        <input type="file" multiple className="hidden" />
                    </div>
                    <ul className="text-xs text-gray-500 mt-4 list-disc list-inside">
                        <li>Tải lên tối đa 20 ảnh trong một bài đăng</li>
                        <li>Dung lượng ảnh tối đa 10MB</li>
                        <li>Hình ảnh phải liên quan đến phòng trọ, nhà cho thuê</li>
                        <li>Không chèn văn bản, số điện thoại lên ảnh</li>
                    </ul>
                </div>

                {/* Thông tin liên hệ */}
                <div className="bg-white p-4 rounded shadow mb-6">
                    <h2 className="text-lg font-bold mb-4">Thông tin liên hệ</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">Họ Tên</label>
                            <input type="text" placeholder="Nhập họ tên" defaultValue="Quỳnh Trang" className="w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Số điện thoại</label>
                            <input type="text" placeholder="Nhập số điện thoại" defaultValue="0344773350" className="w-full p-2 border rounded" />
                        </div>
                    </div>
                </div>

                {/* Nút tiếp tục */}
                <div className="text-center">
                    <Link to="/post/paymentpost">
                    <button className="w-full md:w-1/2 bg-[#ff1e56] hover:bg-[#e60042] text-white font-semibold py-3 rounded-full transition duration-300">
                        Tiếp tục →
                    </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default UserPost;
