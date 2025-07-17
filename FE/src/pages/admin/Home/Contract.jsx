import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaSearch, FaFileAlt, FaFileInvoiceDollar } from "react-icons/fa";
import SidebarWithNavbar from "../SidebarWithNavbar";
import { useEffect, useState } from "react";
import { getHopDong } from "../../../api/homePage";

export default function ContractListPage() {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  // const [selectedContract, setSelectedContract] = useState(null);
  const [invoiceData, setInvoiceData] = useState({
    electricityIndex: "",
    waterIndex: "",
    additionalFees: [],
    note: ""
  });
  const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};
   const [selectedContract, setSelectedContract] = useState(null);
      const [contracts, setContracts] = useState([]);
  const [currentTenant, setCurrentTenant] = useState(null);
  
  useEffect(() => {
      const fetchData = async () => {
          try {
              const res = await getHopDong();
              // console.log('Contracts fetched:', res);
              setContracts(res);
              setCurrentTenant(res);
          } catch (error) {
              console.error('Error fetching contracts:', error);
          }
      };
      fetchData();
  }, []);


  const statusColors = {
    trong: "bg-green-100 text-green-800",
    da_thue: "bg-red-100 text-red-800",
    bao_tri: "bg-yellow-100 text-yellow-800",
  };

  const statusLabels = {
    trong: "Còn trống",
    bao_tri: "Bảo trì",
    da_thue: "Đã thuê",
  };
const handleCreateInvoice = (contract) => {
    setSelectedContract(contract);
    setShowInvoiceModal(true);
  };

  const handleInvoiceInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddFee = () => {
    setInvoiceData(prev => ({
      ...prev,
      additionalFees: [...prev.additionalFees, { name: "", amount: "" }]
    }));
  };

  const handleFeeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFees = [...invoiceData.additionalFees];
    updatedFees[index][name] = value;
    setInvoiceData(prev => ({
      ...prev,
      additionalFees: updatedFees
    }));
  };

  const handleRemoveFee = (index) => {
    const updatedFees = invoiceData.additionalFees.filter((_, i) => i !== index);
    setInvoiceData(prev => ({
      ...prev,
      additionalFees: updatedFees
    }));
  };

  const handleSubmitInvoice = (e) => {
    e.preventDefault();
    // Xử lý tạo hóa đơn
    console.log("Tạo hóa đơn cho hợp đồng:", selectedContract.id);
    console.log("Dữ liệu hóa đơn:", invoiceData);
    setShowInvoiceModal(false);
    // Reset form
    setInvoiceData({
      electricityIndex: "",
      waterIndex: "",
      additionalFees: [],
      note: ""
    });
  };
  return (
    <SidebarWithNavbar>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Danh sách hợp đồng</h1>
          <Link
            to="/admin/ContractAdd"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <FaFileAlt className="mr-2" /> Tạo hợp đồng mới
          </Link>
        </div>

        {/* Search and filter */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã hợp đồng, tên phòng hoặc khách hàng..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="expired">Đã hết hạn</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Từ ngày"
            />
          </div>
        </div>

        {/* Contracts list */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã HĐ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày bắt đầu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày kết thúc</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiền cọc</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                      {contract.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contract.phong.ten_phong}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contract.khach.ho_ten}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contract.ngay_bat_dau}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contract.ngay_ket_thuc}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatCurrency(contract.tien_coc)} VND
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[contract.phong.trang_thai]}`}>
                        {statusLabels[contract.phong.trang_thai]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/contracts/${contract.id}`}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <FaFileAlt className="mr-1" /> Chi tiết
                        </Link>
                        <Link
                          to={`/admin/contracts/edit/${contract.id}`}
                          className="text-yellow-600 hover:text-yellow-900 flex items-center"
                        >
                          <FaEdit className="mr-1" /> Sửa
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-900 flex items-center"
                          onClick={() => {
                            if (window.confirm(`Bạn chắc chắn muốn xóa hợp đồng ${contract.id}?`)) {
                              console.log("Xóa hợp đồng", contract.id);
                            }
                          }}
                        >
                          <FaTrash className="mr-1" /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Trước
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">3</span> của <span className="font-medium">3</span> kết quả
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Trước</span>
                    &larr;
                  </button>
                  <button aria-current="page" className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    1
                  </button>
                  <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Sau</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarWithNavbar>
  );
}