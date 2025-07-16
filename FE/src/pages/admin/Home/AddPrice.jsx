import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import SidebarWithNavbar from "../SidebarWithNavbar";
import { FaSave, FaCalendarAlt } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  createServicePrice, 
  updateServicePrice,
  getServicePriceDetail 
} from "../../../api/homePage/request";

export default function ServicePriceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ten: "",
    gia_tri: "",
    ngay_ap_dung: ""
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Kiểm tra chế độ chỉnh sửa khi component mount
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchPriceData();
    }
  }, [id]);

  // Lấy dữ liệu khi là chế độ chỉnh sửa
  const fetchPriceData = async () => {
    try {
      setLoading(true);
      const data = await getServicePriceDetail(id);
      setFormData({
        ten: data.ten,
        gia_tri: data.gia_tri,
        ngay_ap_dung: data.ngay_ap_dung.split('T')[0]
      });
    } catch (error) {
      console.error("Error fetching price detail:", error);
      toast.error("Không thể tải thông tin giá dịch vụ");
      navigate("/admin/Price");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEditing) {
        await updateServicePrice(id, formData);
        toast.success("Cập nhật giá dịch vụ thành công!");
      } else {
        await createServicePrice(formData);
        toast.success("Thêm giá dịch vụ thành công!");
      }
      
      setTimeout(() => {
        navigate("/admin/Price");
      }, 1500);
      
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi lưu dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <SidebarWithNavbar>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </SidebarWithNavbar>
    );
  }

  return (
    <SidebarWithNavbar>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">
            {isEditing ? "Chỉnh sửa giá dịch vụ" : "Thêm giá dịch vụ mới"}
          </h1>
          <Link to="/admin/Price" className="text-blue-600 hover:underline">
            &larr; Quay lại danh sách
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Tên dịch vụ *</label>
              <input
                type="text"
                name="ten"
                value={formData.ten}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                required
                disabled={loading}
                placeholder="VD: Giá điện, Giá nước..."
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium text-gray-700">Giá trị *</label>
              <input
                type="number"
                name="gia_tri"
                value={formData.gia_tri}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                required
                min="0"
                step="1000"
                disabled={loading}
                placeholder="VD: 4500"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                <FaCalendarAlt className="inline mr-2" />
                Ngày áp dụng *
              </label>
              <input
                type="date"
                name="ngay_ap_dung"
                value={formData.ngay_ap_dung}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FaSave className="inline mr-2" />
              {loading ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Lưu giá dịch vụ'}
            </button>
          </div>
        </form>
      </div>
    </SidebarWithNavbar>
  );
}