import { useState } from "react";
import { toast } from "react-toastify";
import { Upload } from "lucide-react";
import SidebarWithNavbar from "../SidebarWithNavbar";

export default function AddRoomPage() {
  const [previewImages, setPreviewImages] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    ten_phong: '',
    dien_tich: '',
    mo_ta: '',
    tang: '',
    gia: '',
    trang_thai: 'available',
    hinh_anh: []
  });

  const statusOptions = [
    { value: "available", label: "Có sẵn" },
    { value: "rented", label: "Đã thuê" },
    { value: "maintenance", label: "Đang bảo trì" },
  ];

  const floorOptions = [1, 2, 3, 4, 5]; // Chỉ có 5 tầng

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.warning("Bạn chỉ có thể tải lên tối đa 5 ảnh");
      return;
    }

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
    setFormData(prev => ({
      ...prev,
      hinh_anh: files
    }));
  };

  const removeImage = (index) => {
    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);

    const newFiles = [...formData.hinh_anh];
    newFiles.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      hinh_anh: newFiles
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.ten_phong || !formData.dien_tich || !formData.tang || !formData.gia) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    // Xử lý thêm phòng ở đây (gọi API, etc.)
    console.log("Thêm phòng:", formData);
    toast.success("Thêm phòng mới thành công!");

    // Reset form
    setFormData({
      ten_phong: '',
      dien_tich: '',
      mo_ta: '',
      tang: '',
      gia: '',
      trang_thai: 'available',
      hinh_anh: []
    });
    setPreviewImages([]);
  };

  return (
    <SidebarWithNavbar showHeader={false}>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Thêm phòng mới</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tên phòng */}
            <div className="space-y-2">
              <label htmlFor="ten_phong" className="block text-sm font-medium text-gray-700">
                Tên phòng *
              </label>
              <input
                id="ten_phong"
                name="ten_phong"
                placeholder="Nhập tên phòng"
                value={formData.ten_phong}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Diện tích */}
            <div className="space-y-2">
              <label htmlFor="dien_tich" className="block text-sm font-medium text-gray-700">
                Diện tích (m²) *
              </label>
              <input
                id="dien_tich"
                name="dien_tich"
                type="number"
                placeholder="Nhập diện tích"
                value={formData.dien_tich}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="1"
                required
              />
            </div>

            {/* Tầng */}
            <div className="space-y-2">
              <label htmlFor="tang" className="block text-sm font-medium text-gray-700">
                Tầng *
              </label>
              <select
                id="tang"
                name="tang"
                value={formData.tang}
                onChange={handleSelectChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Chọn tầng</option>
                {floorOptions.map((floor) => (
                  <option key={floor} value={floor}>
                    Tầng {floor}
                  </option>
                ))}
              </select>
            </div>

            {/* Giá */}
            <div className="space-y-2">
              <label htmlFor="gia" className="block text-sm font-medium text-gray-700">
                Giá thuê (VND) *
              </label>
              <input
                id="gia"
                name="gia"
                type="number"
                placeholder="Nhập giá thuê"
                value={formData.gia}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="1"
                required
              />
            </div>

            {/* Trạng thái */}
            <div className="space-y-2">
              <label htmlFor="trang_thai" className="block text-sm font-medium text-gray-700">
                Trạng thái *
              </label>
              <select
                id="trang_thai"
                name="trang_thai"
                value={formData.trang_thai}
                onChange={handleSelectChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <label htmlFor="mo_ta" className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              id="mo_ta"
              name="mo_ta"
              placeholder="Nhập mô tả về phòng..."
              rows={4}
              value={formData.mo_ta}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Hình ảnh */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Hình ảnh (Tối đa 5 ảnh)
            </label>
            <div className="flex items-center gap-4">
              <label
                htmlFor="hinh_anh"
                className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <Upload className="w-8 h-8 text-gray-500" />
                <span className="text-sm text-gray-500">Tải ảnh lên</span>
                <input
                  id="hinh_anh"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>

              <div className="flex flex-wrap gap-2">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              onClick={() => {
                setFormData({
                  ten_phong: '',
                  dien_tich: '',
                  mo_ta: '',
                  tang: '',
                  gia: '',
                  trang_thai: 'available',
                  hinh_anh: []
                });
                setPreviewImages([]);
              }}
            >
              Đặt lại
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Thêm phòng
            </button>
          </div>
        </form>
      </div>
    </SidebarWithNavbar>
  );
}