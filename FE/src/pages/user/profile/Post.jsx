
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGetUtilitiesUS } from "../../../api/homePage";
import { useGetCategoriesUS } from "../../../api/homePage";
// Hàm getStreetsFromGHTK đã chỉnh sửa
// const getStreetsFromGHTK = async (districtId) => {
//   try {
//     const response = await fetch(`http://localhost:3001/api/streets?district=${districtId}`);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log('Proxy response:', data);

//     return data.street || [];
//   } catch (error) {
//     console.error('Error fetching via proxy:', error);
//     return [];
//   }
// };
function UserPost() {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [streets, setStreets] = useState([]);

    const { data } = useGetCategoriesUS();
    const categories = data || [];
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [selectedStreet, setSelectedStreet] = useState('');
    const [isLoadingStreets, setIsLoadingStreets] = useState(false);

    const { data: utilitiesData } = useGetUtilitiesUS();
    const utilities = utilitiesData || [];

    

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch('https://provinces.open-api.vn/api/p/');
                const data = await response.json();
                setProvinces(data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };

        fetchProvinces();
    }, []);

    // Load districts when province is selected
    useEffect(() => {
        if (selectedProvince) {
            const fetchDistricts = async () => {
                try {
                    const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`);
                    const data = await response.json();
                    setDistricts(data.districts);
                    setSelectedDistrict('');
                    setWards([]);
                    setSelectedWard('');
                } catch (error) {
                    console.error('Error fetching districts:', error);
                }
            };

            fetchDistricts();
        }
    }, [selectedProvince]);

    // Load wards when district is selected
    useEffect(() => {
        if (selectedDistrict) {
            const fetchWards = async () => {
                try {
                    const response = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`);
                    const data = await response.json();
                    setWards(data.wards);
                    setSelectedWard('');
                } catch (error) {
                    console.error('Error fetching wards:', error);
                }
            };

            fetchWards();
        }
    }, [selectedDistrict]);

    // Load streets when district is selected
    // useEffect(() => {
    //   let isMounted = true;

    //   if (selectedDistrict) {
    //     setIsLoadingStreets(true);

    //     const fetchStreets = async () => {
    //       try {
    //         console.log('Fetching streets for district ID:', selectedDistrict);

    //         // Gọi API GHTK
    //         const streetsData = await getStreetsFromGHTK(selectedDistrict);
    //         console.log('Streets data received:', streetsData);

    //         if (isMounted) {
    //           setStreets(streetsData);
    //           setSelectedStreet('');
    //         }
    //       } catch (error) {
    //         console.error('Failed to fetch streets:', error);
    //       } finally {
    //         if (isMounted) {
    //           setIsLoadingStreets(false);
    //         }
    //       }
    //     };

    //     fetchStreets();
    //   } else {
    //     setStreets([]);
    //     setSelectedStreet('');
    //   }

    //   return () => {
    //     isMounted = false;
    //   };
    // }, [selectedDistrict]);
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
                    <label className="block mb-2">
                        Loại chuyên mục <span className="text-red-600">(*)</span>
                    </label>
                    <select
                        className="w-full p-2 border rounded"
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                    >
                        <option value="">-- Chọn loại chuyên mục --</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="bg-white p-4 rounded shadow mb-6">
                    <h2 className="text-lg font-bold mb-2">Khu vực</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Tỉnh/Thành phố */}
                        <div>
                            <label className="block mb-2">Tỉnh/Thành phố <span className="text-red-600">(*)</span></label>
                            <select
                                className="w-full p-2 border rounded"
                                value={selectedProvince}
                                onChange={(e) => setSelectedProvince(e.target.value)}
                            >
                                <option value="">-- Chọn Tỉnh/TP --</option>
                                {provinces.map(province => (
                                    <option key={province.code} value={province.code}>
                                        {province.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Quận/Huyện */}
                        <div>
                            <label className="block mb-2">Quận/Huyện <span className="text-red-600">(*)</span></label>
                            <select
                                className="w-full p-2 border rounded"
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                disabled={!selectedProvince}
                            >
                                <option value="">-- Chọn quận huyện --</option>
                                {districts.map(district => (
                                    <option key={district.code} value={district.code}>
                                        {district.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Phường/Xã */}
                        <div>
                            <label className="block mb-2">Phường/Xã <span className="text-red-600">(*)</span></label>
                            <select
                                className="w-full p-2 border rounded"
                                value={selectedWard}
                                onChange={(e) => setSelectedWard(e.target.value)}
                                disabled={!selectedDistrict}
                            >
                                <option value="">-- Chọn phường xã --</option>
                                {wards.map(ward => (
                                    <option key={ward.code} value={ward.code}>
                                        {ward.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Đường/Phố */}
                        <div>
                            <label className="block mb-2">Đường/Phố</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={selectedStreet}
                                onChange={(e) => setSelectedStreet(e.target.value)}
                                disabled={!selectedDistrict || isLoadingStreets}
                            >
                                <option value="">-- Chọn đường phố --</option>
                                {isLoadingStreets ? (
                                    <option disabled>Đang tải danh sách đường...</option>
                                ) : streets.length === 0 ? (
                                    <option disabled>Không tìm thấy đường nào</option>
                                ) : (
                                    streets.map(street => (
                                        <option key={street.id} value={street.id}>
                                            {street.name}
                                        </option>
                                    ))
                                )}
                            </select>
                            {!isLoadingStreets && streets.length === 0 && selectedDistrict && (
                                <p className="text-sm text-red-500 mt-1">
                                    Không tìm thấy đường phố nào. Vui lòng nhập thủ công vào ô địa chỉ.
                                </p>
                            )}
                        </div>
                    </div>
                    {/* địa chỉ  */}
                    <div>
                        <label className="block mb-2 mt-2">Địa chỉ cụ thể <span className="text-red-600">(*)</span></label>
                        <input type="text" className="w-full p-2 border rounded" placeholder="Nhập số nhà & tên đường" />
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
                        {utilities.map((utility) => (
                            <label key={utility.MaTienIch} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    className="accent-blue-500"
                                    value={utility.MaTienIch}
                                />
                                <span>{utility.TenTienIch}</span>
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
