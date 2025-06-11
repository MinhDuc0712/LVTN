import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import {
  useGetUtilitiesUS,
  useGetCategoriesUS,
  useGetUsers,
} from "../../../api/homePage";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useCreateHouse } from "../../../api/homePage/queries";

function UserPost() {
  const [formData, setFormData] = useState({
    TieuDe: "",
    SoPhongNgu: 0,
    SoPhongTam: 0,
    SoTang: null,
    DienTich: 0,
    Gia: 0,
    MoTaChiTiet: "",
    DiaChi: "",
    Duong: "",
    utilities: [],
  });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedStreet, setSelectedStreet] = useState("");
  const [streets, setStreets] = useState([]);
  const [isLoadingStreets, setIsLoadingStreets] = useState(false);
  const { data: categories } = useGetCategoriesUS();
  const { data: utilitiesData } = useGetUtilitiesUS();
  const utilities = utilitiesData || [];
  const { data: response, error } = useGetUsers();
  const users = response || [];
  const user = users.length > 0 ? users[0] : null;
  // console.log("User:", user); // Debug
  console.log("Submitting with user:", user);
console.log("MaNguoiDung:", user?.MaNguoiDung);


  

  if (error) return <p>Có lỗi xảy ra: {error.message}</p>;

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const { mutateAsync: createHouse, isLoading } = useCreateHouse();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 20) {
      toast.error("Bạn chỉ có thể tải lên tối đa 20 ảnh");
      return;
    }
    const oversizedFiles = files.filter((file) => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error(`Có ${oversizedFiles.length} ảnh vượt quá 10MB`);
      return;
    }
    const base64Promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () =>
          resolve({ base64: reader.result, name: file.name });
        reader.onerror = (error) => reject(error);
      });
    });
    Promise.all(base64Promises)
      .then((base64Images) => {
        setImages(base64Images);
        const previews = base64Images.map((image) => ({
          url: image.base64,
          name: image.name,
        }));
        setPreviewImages(previews);
      })
      .catch((error) => {
        console.error("Lỗi khi chuyển đổi ảnh sang base64:", error);
        toast.error("Có lỗi khi xử lý ảnh");
      });
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previewImages];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviewImages(newPreviews);
    if (index === 0 && newPreviews.length > 0) {
      toast.info("Đã đặt ảnh tiếp theo làm ảnh đại diện");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUtilityChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      utilities: e.target.checked
        ? [...prev.utilities, value]
        : prev.utilities.filter((id) => id !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategoryId) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    if (!user || !user.MaNguoiDung) {
      toast.error("Vui lòng đăng nhập để đăng bài");
      return;
    }

    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      toast.error("Vui lòng chọn đầy đủ địa chỉ");
      return;
    }

    if (formData.MoTaChiTiet.length < 50) {
      toast.error("Mô tả chi tiết phải có ít nhất 50 ký tự");
      return;
    }

    if (images.length === 0) {
      toast.error("Vui lòng tải lên ít nhất một ảnh");
      return;
    }

    const provinceObj = provinces.find(
      (p) => String(p.code) === String(selectedProvince),
    );
    const districtObj = districts.find(
      (d) => String(d.code) === String(selectedDistrict),
    );
    const wardObj = wards.find((w) => String(w.code) === String(selectedWard));

    const provinceName = provinceObj?.name || "";
    const districtName = districtObj?.name || "";
    const wardName = wardObj?.name || "";

    try {
      setIsUploading(true);

      const postData = {
        TieuDe: formData.TieuDe.trim(),
        Tinh_TP: provinceName,
        Quan_Huyen: districtName,
        Phuong_Xa: wardName,
        Duong: formData.Duong ? formData.Duong.trim() : null,
        DiaChi: formData.DiaChi.trim(),
        SoPhongNgu: parseInt(formData.SoPhongNgu) || 0,
        SoPhongTam: parseInt(formData.SoPhongTam) || 0,
        SoTang: formData.SoTang ? parseInt(formData.SoTang) : null,
        DienTich: parseFloat(formData.DienTich) || 0,
        Gia: parseFloat(formData.Gia) || 0,
        MoTaChiTiet: formData.MoTaChiTiet.trim(),
        MaDanhMuc: parseInt(selectedCategoryId),
        MaNguoiDung: user.MaNguoiDung,
        utilities: formData.utilities
          ? formData.utilities.map((id) => parseInt(id))
          : [],
        images: images.map((image) => image.base64),
      };

      // console.log("Submitting payload:", postData);
      // console.log("Post data being sent:", postData);


      const { houseId } = await createHouse(postData);

      toast.success("Đăng tin thành công!");
      window.location.href = `/post/paymentpost?id=${houseId}`;
    } catch (error) {
      console.error("Error:", error.response?.data || error);
      toast.error(
        "Có lỗi xảy ra khi đăng tin: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://provinces.open-api.vn/api/p/");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        try {
          const response = await fetch(
            `https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`,
          );
          const data = await response.json();
          setDistricts(data.districts);
          setSelectedDistrict("");
          setWards([]);
          setSelectedWard("");
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      };
      fetchDistricts();
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        try {
          const response = await fetch(
            `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`,
          );
          const data = await response.json();
          setWards(data.wards);
          setSelectedWard("");
        } catch (error) {
          console.error("Error fetching wards:", error);
        }
      };
      fetchWards();
    }
  }, [selectedDistrict]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 p-4 md:flex-row md:p-6">
      <Sidebar />
      <div className="w-full overflow-auto rounded-lg bg-white p-4 shadow-lg md:w-3/4 md:p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-700 md:text-3xl">
          Đăng tin cho thuê
        </h1>
        <div className="mb-6 border-b">
          <button className="mr-4">Thông tin mô tả</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6 rounded bg-white p-4 shadow">
            <h2 className="mb-2 text-lg font-bold">Loại danh mục</h2>
            <select
              className="w-full rounded border p-2"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              required
            >
              <option value="">-- Chọn loại chuyên mục --</option>
              {categories?.map((category) => (
                <option key={category.MaDanhMuc} value={category.MaDanhMuc}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6 rounded bg-white p-4 shadow">
            <h2 className="mb-2 text-lg font-bold">Khu vực</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block">
                  Tỉnh/Thành phố <span className="text-red-600">(*)</span>
                </label>
                <select
                  className="w-full rounded border p-2"
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  required
                >
                  <option value="">-- Chọn Tỉnh/TP --</option>
                  {provinces.map((province) => (
                    <option key={province.code} value={province.code}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block">
                  Quận/Huyện <span className="text-red-600">(*)</span>
                </label>
                <select
                  className="w-full rounded border p-2"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedProvince}
                  required
                >
                  <option value="">-- Chọn quận huyện --</option>
                  {districts.map((district) => (
                    <option key={district.code} value={district.code}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block">
                  Phường/Xã <span className="text-red-600">(*)</span>
                </label>
                <select
                  className="w-full rounded border p-2"
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  disabled={!selectedDistrict}
                  required
                >
                  <option value="">-- Chọn phường xã --</option>
                  {wards.map((ward) => (
                    <option key={ward.code} value={ward.code}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block">Đường/Phố</label>
                <input
                  type="text"
                  name="Duong"
                  value={formData.Duong}
                  onChange={handleInputChange}
                  className="w-full rounded border p-2"
                  placeholder="Nhập tên đường"
                />
              </div>
            </div>
            <div>
              <label className="mt-2 mb-2 block">
                Địa chỉ cụ thể <span className="text-red-600">(*)</span>
              </label>
              <input
                type="text"
                name="DiaChi"
                value={formData.DiaChi}
                onChange={handleInputChange}
                className="w-full rounded border p-2"
                placeholder="Nhập số nhà & tên đường"
                required
              />
            </div>
          </div>
          <div className="mb-6 rounded bg-white p-4 shadow">
            <h2 className="mb-2 text-lg font-bold">Thông tin mô tả</h2>
            <div className="mb-4">
              <label className="mb-1 block font-semibold">
                Tiêu đề <span className="text-red-600">(*)</span>
              </label>
              <textarea
                name="TieuDe"
                value={formData.TieuDe}
                onChange={handleInputChange}
                className="w-full rounded border p-2"
                rows="2"
                placeholder="Nhập tiêu đề"
                required
                minLength={30}
                maxLength={100}
              />
              <p className="text-sm text-gray-500">
                (Tối thiểu 30 ký tự, tối đa 100 ký tự)
              </p>
            </div>
            <div className="mb-4">
              <label className="mb-1 block font-semibold">
                Nội dung mô tả <span className="text-red-600">(*)</span>
              </label>
              <textarea
                name="MoTaChiTiet"
                value={formData.MoTaChiTiet}
                onChange={handleInputChange}
                className="w-full rounded border p-2"
                rows="6"
                placeholder="Nhập nội dung mô tả chi tiết (tối thiểu 50 ký tự)"
                minLength={50}
                maxLength={5000}
                required
              />
              <p className="text-sm text-gray-500">
                (Tối thiểu 50 ký tự, tối đa 5000 ký tự)
              </p>
            </div>
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block font-semibold">Số phòng ngủ</label>
                <input
                  name="SoPhongNgu"
                  value={formData.SoPhongNgu}
                  onChange={handleInputChange}
                  type="number"
                  min="0"
                  className="w-full rounded border p-2"
                  placeholder="Nhập số phòng ngủ"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block font-semibold">Số phòng tắm</label>
                <input
                  name="SoPhongTam"
                  value={formData.SoPhongTam}
                  onChange={handleInputChange}
                  type="number"
                  min="0"
                  className="w-full rounded border p-2"
                  placeholder="Nhập số phòng tắm"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block font-semibold">Số tầng</label>
                <input
                  name="SoTang"
                  value={formData.SoTang || ""}
                  onChange={handleInputChange}
                  type="number"
                  min="0"
                  className="w-full rounded border p-2"
                  placeholder="Nhập số tầng"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="mb-1 block font-semibold">
                Giá cho thuê <span className="text-red-600">(*)</span>
              </label>
              <div className="flex">
                <input
                  name="Gia"
                  value={formData.Gia}
                  onChange={handleInputChange}
                  type="number"
                  className="w-full flex-grow rounded-l border p-2 sm:w-auto"
                  placeholder="Nhập giá, ví dụ: 1000000"
                  required
                />
                <span className="rounded-r border border-l-0 bg-gray-100 p-2">
                  đồng/tháng
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Nhập đầy đủ số, ví dụ 1 triệu thì nhập là 1000000
              </p>
            </div>
            <div className="mb-4">
              <label className="mb-1 block font-semibold">
                Diện tích <span className="text-red-600">(*)</span>
              </label>
              <div className="flex">
                <input
                  name="DienTich"
                  value={formData.DienTich}
                  onChange={handleInputChange}
                  type="number"
                  className="w-full flex-grow rounded-l border p-2 sm:w-auto"
                  placeholder="Nhập diện tích"
                  required
                />
                <span className="rounded-r border border-l-0 bg-gray-100 p-2">
                  m²
                </span>
              </div>
            </div>
          </div>
          <div className="mb-6 rounded bg-white p-4 shadow">
            <h2 className="mb-4 text-lg font-bold">Đặc điểm nổi bật</h2>
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 md:grid-cols-4">
              {utilities.map((utility) => (
                <label
                  key={utility.MaTienIch}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    className="accent-blue-500"
                    value={utility.MaTienIch}
                    checked={formData.utilities.includes(
                      utility.MaTienIch.toString(),
                    )}
                    onChange={handleUtilityChange}
                  />
                  <span>{utility.TenTienIch}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-6 rounded bg-white p-4 shadow">
            <h2 className="mb-4 text-lg font-bold">Hình ảnh</h2>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-400 bg-blue-50 p-6 hover:bg-blue-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mb-2 h-10 w-10 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p className="font-medium text-blue-600">Tải ảnh từ thiết bị</p>
              <input
                type="file"
                multiple
                max={20}
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
                required
              />
            </label>
            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {previewImages.map((image, index) => (
                  <div key={index} className="group relative">
                    <img
                      src={image.url}
                      alt={`Preview ${index}`}
                      className="h-32 w-full rounded object-cover"
                    />
                    <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black opacity-0 transition group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="rounded-full bg-red-500 p-1 text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                    {index === 0 && (
                      <span className="absolute top-1 left-1 rounded bg-blue-500 px-2 py-1 text-xs text-white">
                        Ảnh đại diện
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <ul className="mt-4 list-inside list-disc text-xs text-gray-500">
              <li>Tải lên tối đa 20 ảnh trong một bài đăng</li>
              <li>Dung lượng ảnh tối đa 10MB</li>
              <li>Hình ảnh phải liên quan đến phòng trọ, nhà cho thuê</li>
              <li>Không chèn văn bản, số điện thoại lên ảnh</li>
              {images.length > 0 && (
                <li className="text-green-600">Đã chọn {images.length} ảnh</li>
              )}
            </ul>
          </div>
          <div className="mb-6 rounded bg-white p-4 shadow">
            <h2 className="mb-4 text-lg font-bold">Thông tin liên hệ</h2>
            <div>
              {user ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-medium">Họ Tên</label>
                    <input
                      type="text"
                      defaultValue={user.HoTen}
                      className="w-full rounded border p-2"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-medium">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      defaultValue={user.SDT}
                      className="w-full rounded border p-2"
                      readOnly
                    />
                  </div>
                </div>
              ) : (
                <p>Không có dữ liệu người dùng.</p>
              )}
            </div>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full rounded-full bg-[#ff1e56] py-3 font-semibold text-white transition duration-300 hover:bg-[#e60042] md:w-1/2"
              disabled={isLoading || isUploading}
            >
              {isLoading || isUploading ? "Đang xử lý..." : "Tiếp tục →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserPost;
