import {
  useGetCategoriesUS,
  useGetHouseById,
  useGetUtilitiesUS,
} from "@/api/homePage";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

import { updateHouse, useAuthUser, useCreateHouse } from "@/api/homePage/";
import { Building } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import GoongMapLibre from "../../map";

function UserPost() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEditMode = !!id;

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useAuthUser();
  const { data: houseData, isLoading: isHouseLoading } = useGetHouseById(id, {
    enabled: isEditMode,
  });

  const { data: categories } = useGetCategoriesUS();
  const { data: utilitiesData } = useGetUtilitiesUS();
  const utilities = utilitiesData || [];

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
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { mutateAsync: createHouse, isLoading: isCreating } = useCreateHouse();
  const isUpdating = false;

  // Load dữ liệu bài đăng khi ở chế độ chỉnh sửa
  useEffect(() => {
    if (isEditMode && houseData) {
      setFormData({
        TieuDe: houseData.TieuDe || "",
        SoPhongNgu: houseData.SoPhongNgu || 0,
        SoPhongTam: houseData.SoPhongTam || 0,
        SoTang: houseData.SoTang || null,
        DienTich: houseData.DienTich || 0,
        Gia: houseData.Gia || 0,
        MoTaChiTiet: houseData.MoTaChiTiet || "",
        DiaChi: getFullAddress(),
        Duong: houseData.Duong || "",
        utilities: houseData.utilities?.map((u) => String(u.MaTienIch)) || [],
      });
      setSelectedCategoryId(String(houseData.MaDanhMuc || ""));
      setSelectedProvince(houseData.Tinh_TP || "");
      setSelectedDistrict(houseData.Quan_Huyen || "");
      setSelectedWard(houseData.Phuong_Xa || "");

      const previews =
        houseData.images?.map((img, index) => ({
          url: img.DuongDanHinh,
          name: `image-${index}`,
          file: null,
        })) || [];
      setPreviewImages(previews);
      setImages(previews.map((p) => p.url));
    }
  }, [houseData, isEditMode]);

  // Upload ảnh lên Cloudinary
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 15) {
      toast.error("Bạn chỉ có thể tải lên tối đa 15 ảnh");
      return;
    }
    const oversizedFiles = files.filter((file) => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error(`Có ${oversizedFiles.length} ảnh vượt quá 10MB`);
      return;
    }
    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    }));

    setPreviewImages([...previewImages, ...previews]);
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previewImages];
    if (newPreviews[index].file) {
      URL.revokeObjectURL(newPreviews[index].url);
    }
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviewImages(newPreviews);
    if (index === 0 && newPreviews.length > 0) {
      toast.info("Đã đặt ảnh tiếp theo làm ảnh đại diện");
    }
  };

  const uploadToCloudinary = async (files) => {
    const uploadedUrls = [];
    const filesToUpload = files.filter((item) => typeof item !== "string");

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "upload-house");

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/df0xgmzfz/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        uploadedUrls.push(data.secure_url);
        setUploadProgress(Math.round(((i + 1) / filesToUpload.length) * 100));
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
      }
    }

    return [
      ...files.filter((item) => typeof item === "string"),
      ...uploadedUrls,
    ];
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
      navigate("/dang-nhap");
      return;
    }

    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      toast.error("Vui lòng chọn đầy đủ địa chỉ");
      return;
    }

    if (formData.Gia < 100000) {
      toast.error("Giá không được nhỏ hơn 100.000đ");
      return;
    }

    if (formData.Gia > 10000000000) {
      toast.error("Giá không được lớn hơn 10.000.000.000đ");
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

    const fullAddress = getFullAddress().trim();
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const imageUrls = await uploadToCloudinary(images);

      const postData = {
        TieuDe: formData.TieuDe.trim(),
        DiaChi: fullAddress,
        SoPhongNgu: parseInt(formData.SoPhongNgu) || 0,
        SoPhongTam: parseInt(formData.SoPhongTam) || 0,
        SoTang: formData.SoTang ? parseInt(formData.SoTang) : null,
        DienTich: parseFloat(formData.DienTich) || 0,
        Gia: parseFloat(formData.Gia) || 0,
        MoTaChiTiet: formData.MoTaChiTiet.trim(),
        MaDanhMuc: parseInt(selectedCategoryId),
        utilities: formData.utilities.map((id) => parseInt(id)),
        images: imageUrls,
      };

      if (isEditMode) {
        await updateHouse({ id, data: postData });
        toast.success("Cập nhật tin thành công!");
        navigate(`/posts`);
      } else {
        const { houseId } = await createHouse(postData);
        toast.success("Đăng tin thành công!");
        navigate(`/post/paymentpost?id=${houseId}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi xử lý tin",
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      previewImages.forEach((image) => {
        if (image.file) URL.revokeObjectURL(image.url);
      });
    }
  };

  const getFullAddress = () => formData.DiaChi?.trim() || "";

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
          setDistricts(data.districts || []);
          if (!isEditMode || selectedDistrict !== houseData?.Quan_Huyen) {
            setSelectedDistrict("");
            setWards([]);
            setSelectedWard("");
          }
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      };
      fetchDistricts();
    }
  }, [selectedProvince, isEditMode, houseData]);

  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        try {
          const response = await fetch(
            `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`,
          );
          const data = await response.json();
          setWards(data.wards || []);
          if (!isEditMode || selectedWard !== houseData?.Phuong_Xa) {
            setSelectedWard("");
          }
        } catch (error) {
          console.error("Error fetching wards:", error);
        }
      };
      fetchWards();
    }
  }, [selectedDistrict, isEditMode, houseData]);

  useEffect(() => {
    const provinceObj = provinces.find((p) => p.code === +selectedProvince);
    const districtObj = districts.find((d) => d.code === +selectedDistrict);
    const wardObj = wards.find((w) => w.code === +selectedWard);

    const provinceName = provinceObj?.name || "";
    const districtName = districtObj?.name || "";
    const wardName = wardObj?.name || "";

    const fullAddress =
      `${formData.Duong || ""}, ${wardName}, ${districtName}, ${provinceName}`
        .replace(/,\s*,/g, ",")
        .replace(/(^,\s*|\s*,\s*$)/g, "")
        .trim();

    setFormData((prev) => ({
      ...prev,
      DiaChi: fullAddress,
    }));
  }, [selectedProvince, selectedDistrict, selectedWard, formData.Duong]);

  if (isEditMode && isHouseLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Building className="h-8 w-8 animate-spin text-blue-500" />
          <span className="text-lg font-medium text-gray-600">
            Đang tải dữ liệu bài đăng...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 p-4 md:flex-row md:p-6">
      <Sidebar />
      <div className="w-full overflow-auto rounded-lg bg-white p-4 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-700 md:text-3xl">
          {isEditMode ? "Chỉnh sửa tin đăng" : "Đăng tin cho thuê"}
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
                readOnly
              />
            </div>
            <div className="mb-6 rounded bg-white p-4 shadow">
              <h2 className="mb-2 text-lg font-bold">Bản đồ vị trí</h2>
              <div className="h-[400px] w-full">
                <GoongMapLibre address={getFullAddress()} />
              </div>
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
                      String(utility.MaTienIch),
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
            {isUploading && (
              <div className="mb-4">
                <div className="mb-1 flex justify-between">
                  <span className="text-sm font-medium text-blue-700">
                    Đang tải lên ảnh...
                  </span>
                  <span className="text-sm font-medium text-blue-700">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2.5 rounded-full bg-blue-600"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
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
                required={!isEditMode || images.length === 0}
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
              {isUserLoading ? (
                <p>Đang tải thông tin...</p>
              ) : userError ? (
                <p>
                  Lỗi: {userError.message}. Vui lòng kiểm tra token hoặc liên hệ
                  admin.
                </p>
              ) : user && (user.HoTen || user.SDT) ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-medium">Họ Tên</label>
                    <input
                      type="text"
                      value={user.HoTen || "Chưa cập nhật"}
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
                      value={user.SDT || "Chưa cập nhật"}
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
              disabled={isCreating || isUpdating || isUploading}
            >
              {isCreating || isUpdating || isUploading
                ? "Đang xử lý..."
                : isEditMode
                  ? "Cập nhật tin"
                  : "Tiếp tục →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserPost;
