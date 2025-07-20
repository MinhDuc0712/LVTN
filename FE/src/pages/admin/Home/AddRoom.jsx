import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Upload } from "lucide-react";
import SidebarWithNavbar from "../SidebarWithNavbar";

import {
  addRoomAPI,
  updateRoomAPI,
  getRoomByIdAPI,
  uploadRoomImagesAPI,
  deleteRoomImageAPI,
} from "../../../api/homePage/request";


const STATUS_MAP = {
  available: "trong",
  rented: "da_thue",
  maintenance: "bao_tri",
};
const REVERSE_STATUS_MAP = {
  trong: "available",
  da_thue: "rented",
  bao_tri: "maintenance",
};
const STATUS_OPTIONS = [
  { value: "available", label: "Có sẵn" },
  { value: "rented", label: "Đã thuê" },
  { value: "maintenance", label: "Bảo trì" },
];
const FLOOR_OPTIONS = [1, 2, 3, 4, 5];

export default function RoomFormPage({ mode = "add" }) {

  const { id } = useParams();
  const isEdit = mode === "edit";
  const navigate = useNavigate();


  const [loading, setLoading] = useState(isEdit);
  const [previewImages, setPreviewImages] = useState([]); 
  const [existingImages, setExistingImages] = useState([]);
  const [formData, setFormData] = useState({
    ten_phong: "",
    dien_tich: "",
    mo_ta: "",
    tang: "",
    gia: "",
    trang_thai: "available",
    hinh_anh: [],
  });


  useEffect(
    () => () => previewImages.forEach((u) => URL.revokeObjectURL(u)),
    [previewImages],
  );

  useEffect(() => {
    if (!isEdit) return;

    (async () => {
      try {
        const room = await getRoomByIdAPI(id);
        // console.log("[DEBUG room]", room);
        // console.log("[DEBUG images]", room.images);
        setFormData({
          ten_phong: room.ten_phong,
          dien_tich: room.dien_tich,
          mo_ta: room.mo_ta || "",
          tang: room.tang,
          gia: room.gia,
          trang_thai:
            REVERSE_STATUS_MAP[room.trang_thai?.trim()] || "available",
          hinh_anh: [],
        });
        setExistingImages(room.images || []);
      } catch (err) {
        toast.error("Không thể tải thông tin phòng");
        navigate("/admin/Room");
      } finally {
        setLoading(false);
      }
    })();
  }, [isEdit, id, navigate]);

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

  /* ---------- handlers ---------- */
  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const remain = 5 - existingImages.length - previewImages.length;
    const files = Array.from(e.target.files).slice(0, remain);
    if (!files.length) return;

    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewImages((prev) => [...prev, ...urls]);
    setFormData((p) => ({ ...p, hinh_anh: [...p.hinh_anh, ...files] }));
  };

  const removePreview = (idx) => {
    URL.revokeObjectURL(previewImages[idx]);
    setPreviewImages((prev) => prev.filter((_, i) => i !== idx));
    setFormData((p) => ({
      ...p,
      hinh_anh: p.hinh_anh.filter((_, i) => i !== idx),
    }));
  };

  const removeExisting = async (imageId) => {
    if (!window.confirm("Xoá ảnh này?")) return;
    try {
      await deleteRoomImageAPI(imageId);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success("Đã xoá ảnh");
    } catch (err) {
      toast.error("Xoá ảnh thất bại");
    }
  };

  const resetForm = () => {
    previewImages.forEach((u) => URL.revokeObjectURL(u));
    setPreviewImages([]);
    setExistingImages([]);
    setFormData({
      ten_phong: "",
      dien_tich: "",
      mo_ta: "",
      tang: "",
      gia: "",
      trang_thai: "available",
      hinh_anh: [],
    });
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ten_phong, dien_tich, tang, gia } = formData;

    if (!ten_phong || !dien_tich || !tang || !gia) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("ten_phong", ten_phong);
      fd.append("dien_tich", dien_tich);
      fd.append("mo_ta", formData.mo_ta ?? "");
      fd.append("tang", tang);
      fd.append("gia", gia);
      fd.append("trang_thai", STATUS_MAP[formData.trang_thai]);

      let roomId;

      if (isEdit) {
        fd.append("_method", "PUT");
        await updateRoomAPI(id, fd);
        roomId = id;
      } else {
        const res = await addRoomAPI(fd);
        roomId = res?.data?.data?.id ?? res?.data?.id;
      }

      if (roomId && formData.hinh_anh.length) {
        const urls = await uploadToCloudinary(formData.hinh_anh);
        await uploadRoomImagesAPI(roomId, { urls });
      }

      toast.success(
        isEdit ? "Cập nhật phòng thành công" : "Thêm phòng thành công",
      );
      navigate("/admin/Room");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ?? "Thao tác thất bại, thử lại sau",
      );
    }
  };

  /* ---------- render ---------- */
  if (loading)
    return (
      <SidebarWithNavbar>
        <div className="p-8">Đang tải dữ liệu...</div>
      </SidebarWithNavbar>
    );

  return (
    <SidebarWithNavbar showHeader={false}>
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-blue-800">
          {isEdit ? "Sửa phòng" : "Thêm phòng mới"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ------ thông tin cơ bản ------ */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              id="ten_phong"
              label="Tên phòng *"
              value={formData.ten_phong}
              onChange={handleChange}
              required
            />
            <Input
              id="dien_tich"
              label="Diện tích (m²) *"
              type="number"
              min={1}
              value={formData.dien_tich}
              onChange={handleChange}
              required
            />
            <Select
              id="tang"
              label="Tầng *"
              options={FLOOR_OPTIONS.map((f) => ({
                value: f,
                label: `Tầng ${f}`,
              }))}
              value={formData.tang}
              onChange={handleChange}
              required
            />
            <Input
              id="gia"
              label="Giá thuê (VND) *"
              type="number"
              min={1}
              value={formData.gia}
              onChange={handleChange}
              required
            />
            <Select
              id="trang_thai"
              label="Trạng thái *"
              options={STATUS_OPTIONS}
              value={formData.trang_thai}
              onChange={handleChange}
              required
            />
          </div>

          {/* ------ mô tả ------ */}
          <Textarea
            id="mo_ta"
            label="Mô tả"
            rows={4}
            value={formData.mo_ta}
            onChange={handleChange}
          />

          {/* ------ hình ảnh ------ */}
          <ImageUpload
            existingImages={existingImages}
            previewImages={previewImages}
            onChange={handleImageChange}
            onRemovePreview={removePreview}
            onRemoveExisting={removeExisting}
            max={5}
          />

          {/* ------ nút ------ */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-100"
              onClick={resetForm}
            >
              Đặt lại
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {isEdit ? "Lưu thay đổi" : "Thêm phòng"}
            </button>
          </div>
        </form>
      </div>
    </SidebarWithNavbar>
  );
}

/* ---------- sub components ---------- */
function Input({ id, label, ...rest }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
        {...rest}
      />
    </div>
  );
}

function Select({ id, label, options, ...rest }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        name={id}
        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
        {...rest}
      >
        <option value="">-- chọn --</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Textarea({ id, label, ...rest }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
        {...rest}
      />
    </div>
  );
}

function ImageUpload({
  existingImages,
  previewImages,
  onChange,
  onRemovePreview,
  onRemoveExisting,
  max,
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Hình ảnh (tối đa {max} ảnh)
      </label>
      <div className="flex flex-wrap items-center gap-4">
        {/* nút upload nếu chưa đủ ảnh */}
        {existingImages.length + previewImages.length < max && (
          <label
            htmlFor="hinh_anh"
            className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 hover:bg-gray-100"
          >
            <Upload className="h-8 w-8 text-gray-500" />
            <span className="text-sm text-gray-500">Tải ảnh lên</span>
            <input
              id="hinh_anh"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={onChange}
            />
          </label>
        )}

        {/* ảnh cũ */}
        {existingImages.map((img) => {
          const url = img.image_path.startsWith("http")
            ? img.image_path
            : `${import.meta.env.VITE_STORAGE_URL}/storage/${img.image_path}`;

          return (
            <div key={img.id} className="relative">
              <img
                src={url}
                alt=""
                className="h-24 w-24 rounded object-cover"
              />
              <button
                type="button"
                onClick={() => onRemoveExisting(img.id)}
                className="absolute top-0 right-0 h-6 w-6 rounded-full bg-red-500 text-white"
              >
                ×
              </button>
            </div>
          );
        })}

        {/* ảnh mới chọn */}
        {previewImages.map((src, idx) => (
          <div key={`preview-${idx}`} className="relative">
            <img
              src={src}
              alt={`preview-${idx}`}
              className="h-32 w-32 rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={() => onRemovePreview(idx)}
              className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
