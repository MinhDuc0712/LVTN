
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGetUtilitiesUS, useGetCategoriesUS, useGetUsers } from "../../../api/homePage";
import { axiosUser } from '../../../api/axios';
import { toast } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { useCreateHouse,useUploadHouseImages } from '../../../api/homePage/queries';
function UserPost() {
    const [formData, setFormData] = useState({
        TieuDe: '',
        SoPhongNgu: 0,
        SoPhongTam: 0,
        SoTang: null,
        DienTich: 0,
        Gia: 0,
        MoTaChiTiet: '',
        DiaChi: '',
        Duong: '',
        utilities: []
    });
    // State cho địa chỉ
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedStreet, setSelectedStreet] = useState('');
    const [streets, setStreets] = useState([]);
    const [isLoadingStreets, setIsLoadingStreets] = useState(false);
    // Lấy danh sách categories và utilities & USER 
    const { data: categories } = useGetCategoriesUS();
    const { data: utilitiesData } = useGetUtilitiesUS();
    const utilities = utilitiesData || [];
    const { data: response, error } = useGetUsers();

    const users = response || [];
    const user = users.length > 0 ? users[0] : null;

    if (error) return <p>Có lỗi xảy ra: {error.message}</p>;

    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    //const { mutate: createHouse } = useCreateHouse();

const { mutateAsync: createHouse } = useCreateHouse();
const { mutate: uploadImages } = useUploadHouseImages();
    // Mutation để tạo bài đăng
    const { mutate: createPost, isLoading } = useMutation({
        mutationFn: (postData) => axiosUser.post('/houses', postData),
        onSuccess: (response) => {
            console.log("Bài đăng đã tạo:", response.data);
            const { MaNha } = response.data;
            if (images.length > 0) {
                uploadHouseImages(MaNha);
            }
            window.location.href = `/post/paymentpost?id=${MaNha}`;
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Lỗi khi tạo bài đăng');
        }
    });
    // Xử lý khi chọn file


    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Validate số lượng ảnh
        if (files.length > 20) {
            toast.error('Bạn chỉ có thể tải lên tối đa 20 ảnh');
            return;
        }
        // Validate dung lượng ảnh
        const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            toast.error(`Có ${oversizedFiles.length} ảnh vượt quá 10MB`);
            return;
        }

        setImages(files);

        // Tạo preview ảnh
        const previews = files.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name
        }));
        setPreviewImages(previews);
    };

    // Xử lý upload ảnh sau khi tạo bài đăng
// const uploadHouseImages = async (houseId) => {
//     if (images.length === 0) return;

//     try {
//         setIsUploading(true);
//         const formData = new FormData();
        
//         // Thêm ảnh vào FormData (đúng format API backend yêu cầu)
//         images.forEach((image, index) => {
//             formData.append('images[]', image); // Sử dụng 'images[]' thay vì 'images'
//         });

//         // Gọi API upload ảnh
//         await axiosUser.post(`/houses/${houseId}/images`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data' // Quan trọng: phải set header này
//             }
//         });

//         toast.success('Tải lên hình ảnh thành công!');
//     } catch (error) {
//         console.error('Upload error:', error);
//         toast.error(error.response?.data?.message || 'Lỗi khi tải lên hình ảnh');
//     } finally {
//         setIsUploading(false);
//     }
// };
    const removeImage = (index) => {
        const newImages = [...images];
        const newPreviews = [...previewImages];

        newImages.splice(index, 1);
        newPreviews.splice(index, 1);

        setImages(newImages);
        setPreviewImages(newPreviews);

        // Nếu xóa ảnh đại diện (ảnh đầu tiên) thì ảnh tiếp theo sẽ thành ảnh đại diện
        if (index === 0 && newPreviews.length > 0) {
            toast.info('Đã đặt ảnh tiếp theo làm ảnh đại diện');
        }
    };
    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Xử lý chọn tiện ích
    const handleUtilityChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            utilities: e.target.checked
                ? [...prev.utilities, value]
                : prev.utilities.filter(id => id !== value)
        }));
    };
    // Xử lý submit form
const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!selectedCategoryId) {
        toast.error('Vui lòng chọn danh mục');
        return;
    }

    if (!user?.MaNguoiDung) {
        toast.error('Vui lòng đăng nhập để đăng bài');
        return;
    }

    if (!selectedProvince || !selectedDistrict || !selectedWard) {
        toast.error('Vui lòng chọn đầy đủ địa chỉ');
        return;
    }

    if (formData.MoTaChiTiet.length < 50) {
        toast.error('Mô tả chi tiết phải có ít nhất 50 ký tự');
        return;
    }

    // Lấy tên địa chỉ
    const provinceObj = provinces.find(p => String(p.code) === String(selectedProvince));
    const districtObj = districts.find(d => String(d.code) === String(selectedDistrict));
    const wardObj = wards.find(w => String(w.code) === String(selectedWard));

    const provinceName = provinceObj?.name || '';
    const districtName = districtObj?.name || '';
    const wardName = wardObj?.name || '';

    // Chuẩn bị dữ liệu - ĐẢM BẢO ĐÚNG TÊN TRƯỜNG
    const postData = {
        TieuDe: formData.TieuDe.trim(),
        Tinh_TP: provinceName,
        Quan_Huyen: districtName,
        Phuong_Xa: wardName,
        Duong: formData.Duong ? formData.Duong.trim() : null,
        DiaChi: formData.DiaChi.trim(),
        SoPhongNgu: parseInt(formData.SoPhongNgu),
        SoPhongTam: parseInt(formData.SoPhongTam),
        SoTang: formData.SoTang ? parseInt(formData.SoTang) : null,
        DienTich: parseFloat(formData.DienTich),
        Gia: parseFloat(formData.Gia),
        MoTaChiTiet: formData.MoTaChiTiet.trim(),
        MaDanhMuc: parseInt(selectedCategoryId),
        MaNguoiDung: parseInt(user.MaNguoiDung),
        utilities: formData.utilities ? formData.utilities.map(id => parseInt(id)) : []
    };

      try {
        const created = await createHouse(postData); // dùng custom hook
        const houseId = created?.MaNha || created?.house?.MaNha;

        if (!houseId) {
            toast.error('Không lấy được mã nhà sau khi tạo');
            return;
        }

        // Upload ảnh nếu có
        if (images.length > 0) {
            await uploadImages({ houseId, images });
        }

        toast.success('Tạo bài đăng thành công!');
        window.location.href = `/post/paymentpost?id=${houseId}`;
    } catch (error) {
        console.error('Lỗi khi submit:', error);
    }
};
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
    return (
        <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen p-4 md:p-6">

            <Sidebar />


            <div className="w-full md:w-3/4 p-4 md:p-6 bg-white rounded-lg shadow-lg overflow-auto">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-700">Đăng tin cho thuê</h1>

                <div className="border-b mb-6">
                    <button className="mr-4 ">Thông tin mô tả </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Phần danh mục */}
                    <div className="bg-white p-4 rounded shadow mb-6">
                        <h2 className="text-lg font-bold mb-2">Loại danh mục</h2>
                        <select
                            className="w-full p-2 border rounded"
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                            required
                        >
                            <option value="">-- Chọn loại chuyên mục --</option>
                            {categories?.map((category, index) => (
                                <option key={category.MaDanhMuc} value={category.MaDanhMuc}>
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
                            <input
                                type="text"
                                name="DiaChi"
                                value={formData.DiaChi}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                placeholder="Nhập số nhà & tên đường"
                                required
                            />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded shadow mb-6">
                        <h2 className="text-lg font-bold mb-2">Thông tin mô tả</h2>

                        <div className="mb-4">
                            <label className="block font-semibold mb-1">
                                Tiêu đề <span className="text-red-600">(*)</span>
                            </label>
                            <textarea
                                name="TieuDe"
                                value={formData.TieuDe}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                rows="2"
                                placeholder="Nhập tiêu đề"
                                required
                                minLength={30}
                                maxLength={100}
                            />                        <p className="text-sm text-gray-500">(Tối thiểu 30 ký tự, tối đa 100 ký tự)</p>
                        </div>

                        <div className="mb-4">
                            <label className="block font-semibold mb-1">
                                Nội dung mô tả <span className="text-red-600">(*)</span>
                            </label>
                            <textarea name="MoTaChiTiet"
                                value={formData.MoTaChiTiet}
                                onChange={handleInputChange} className="w-full p-2 border rounded" rows="6" placeholder="Nhập nội dung mô tả chi tiết" />
                            <p className="text-sm text-gray-500">(Tối thiểu 50 ký tự, tối đa 5000 ký tự)</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block font-semibold mb-1">
                                    Số phòng ngủ
                                </label>
                                <input name="SoPhongNgu"
                                    value={formData.SoPhongNgu}
                                    onChange={handleInputChange} type="number" min="0" className="w-full p-2 border rounded" placeholder="Nhập số phòng ngủ" />
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">
                                    Số phòng tắm
                                </label>
                                <input name="SoPhongTam"
                                    value={formData.SoPhongTam}
                                    onChange={handleInputChange} type="number" min="0" className="w-full p-2 border rounded" placeholder="Nhập số phòng tắm" />
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">
                                    Số tầng
                                </label>
                                <input name="SoTang"
                                    value={formData.SoTang ?? ""}
                                    onChange={handleInputChange} type="number" min="0" className="w-full p-2 border rounded" placeholder="Nhập số tầng" />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">
                                Giá cho thuê <span className="text-red-600">(*)</span>
                            </label>
                            <div className="flex">
                                <input name="Gia"
                                    value={formData.Gia}
                                    onChange={handleInputChange} type="number" className="w-full sm:w-auto flex-grow p-2 border rounded-l" placeholder="Nhập giá, ví dụ: 1000000" />
                                <span className="p-2 border border-l-0 rounded-r bg-gray-100">đồng/tháng</span>
                            </div>
                            <p className="text-sm text-gray-500">Nhập đầy đủ số, ví dụ 1 triệu thì nhập là 1000000</p>
                        </div>

                        <div className="mb-4">
                            <label className="block font-semibold mb-1">
                                Diện tích <span className="text-red-600">(*)</span>
                            </label>
                            <div className="flex">
                                <input name="DienTich"
                                    value={formData.DienTich}
                                    onChange={handleInputChange} type="number" className="w-full sm:w-auto flex-grow p-2 border rounded-l" placeholder="Nhập diện tích" />
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
                                        checked={formData.utilities.includes(utility.MaTienIch.toString())}
                                        onChange={handleUtilityChange}
                                    />
                                    <span>{utility.TenTienIch}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Hình ảnh */}
                    <div className="bg-white p-4 rounded shadow mb-6">
                        <h2 className="text-lg font-bold mb-4">Hình ảnh</h2>

                        {/* Dropzone */}
                        <label className="border-2 border-dashed border-blue-400 p-6 rounded-lg flex flex-col items-center justify-center bg-blue-50 cursor-pointer hover:bg-blue-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <p className="text-blue-600 font-medium">Tải ảnh từ thiết bị</p>
                            <input
                                type="file"
                                multiple
                                max={20}
                                className="hidden"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                        </label>

                        {/* Preview ảnh */}
                        {previewImages.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {previewImages.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={image.url}
                                            alt={`Preview ${index}`}
                                            className="w-full h-32 object-cover rounded"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="text-white bg-red-500 rounded-full p-1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                        {index === 0 && (
                                            <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                                Ảnh đại diện
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Thông báo */}
                        <ul className="text-xs text-gray-500 mt-4 list-disc list-inside">
                            <li>Tải lên tối đa 20 ảnh trong một bài đăng</li>
                            <li>Dung lượng ảnh tối đa 10MB</li>
                            <li>Hình ảnh phải liên quan đến phòng trọ, nhà cho thuê</li>
                            <li>Không chèn văn bản, số điện thoại lên ảnh</li>
                            {images.length > 0 && (
                                <li className="text-green-600">Đã chọn {images.length} ảnh</li>
                            )}
                        </ul>
                    </div>

                    {/* Thông tin liên hệ */}
                    <div className="bg-white p-4 rounded shadow mb-6">
                        <h2 className="text-lg font-bold mb-4">Thông tin liên hệ</h2>
                        <div className="">
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <div key={user.MaNguoiDung || index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-1 font-medium">Họ Tên</label>
                                            <input type="text" placeholder="Nhập họ tên" defaultValue={user.HoTen} className="w-full p-2 border rounded" readOnly />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium">Số điện thoại</label>
                                            <input type="text" placeholder="Nhập số điện thoại" defaultValue={user.SDT} className="w-full p-2 border rounded" readOnly />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Không có dữ liệu người dùng.</p>
                            )}
                        </div>
                    </div>


                    <div className="text-center">
                        <button
                            type="submit"
                            className="w-full md:w-1/2 bg-[#ff1e56] hover:bg-[#e60042] text-white font-semibold py-3 rounded-full transition duration-300"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Tiếp tục →'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserPost;
