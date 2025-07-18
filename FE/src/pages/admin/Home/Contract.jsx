import { useEffect, useState } from "react";
import { FaEdit, FaFileAlt, FaSearch, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getHopDong } from "../../../api/homePage";
import SidebarWithNavbar from "../SidebarWithNavbar";

export default function ContractListPage() {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    electricityIndex: "",
    waterIndex: "",
    additionalFees: [],
    note: "",
  });
  const [selectedContract, setSelectedContract] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHopDong();
        setContracts(res);
        setFilteredContracts(res);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error?.response?.data?.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...contracts];

    if (statusFilter !== "") {
      filtered = filtered.filter((c) => c.phong.trang_thai === statusFilter);
    }

    if (dateFilter !== "") {
      filtered = filtered.filter(
        (c) => new Date(c.ngay_bat_dau) >= new Date(dateFilter),
      );
    }

    if (searchTerm !== "") {
      filtered = filtered.filter(
        (c) =>
          c.id.toString().includes(searchTerm) ||
          c.phong.ten_phong.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.khach.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredContracts(filtered);
    setCurrentPage(1);
  }, [statusFilter, dateFilter, searchTerm, contracts]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

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
    setInvoiceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddFee = () => {
    setInvoiceData((prev) => ({
      ...prev,
      additionalFees: [...prev.additionalFees, { name: "", amount: "" }],
    }));
  };

  const handleFeeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFees = [...invoiceData.additionalFees];
    updatedFees[index][name] = value;
    setInvoiceData((prev) => ({
      ...prev,
      additionalFees: updatedFees,
    }));
  };

  const handleRemoveFee = (index) => {
    const updatedFees = invoiceData.additionalFees.filter(
      (_, i) => i !== index,
    );
    setInvoiceData((prev) => ({
      ...prev,
      additionalFees: updatedFees,
    }));
  };

  const handleSubmitInvoice = (e) => {
    e.preventDefault();
    console.log("Tạo hóa đơn cho hợp đồng:", selectedContract.id);
    console.log("Dữ liệu hóa đơn:", invoiceData);
    setShowInvoiceModal(false);
    setInvoiceData({
      electricityIndex: "",
      waterIndex: "",
      additionalFees: [],
      note: "",
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContracts = filteredContracts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
  return (
    <SidebarWithNavbar>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-800">
            Danh sách hợp đồng
          </h1>
          <Link
            to="/admin/ContractAdd"
            className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <FaFileAlt className="mr-2" /> Tạo hợp đồng mới
          </Link>
        </div>

        <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <FaSearch className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm theo mã hợp đồng, tên phòng hoặc khách hàng..."
                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="trong">Còn trống</option>
              <option value="bao_tri">Bảo trì</option>
              <option value="da_thue">Đã thuê</option>
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Từ ngày"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Mã HĐ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Phòng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Ngày bắt đầu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Ngày kết thúc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Tiền cọc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium whitespace-nowrap text-blue-600">
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
                      {formatCurrency(contract.tien_coc)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${statusColors[contract.phong.trang_thai]}`}
                      >
                        {statusLabels[contract.phong.trang_thai]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/contracts/${contract.id}`}
                          className="flex items-center text-blue-600 hover:text-blue-900"
                        >
                          <FaFileAlt className="mr-1" /> Chi tiết
                        </Link>
                        <Link
                          to={`/admin/contracts/edit/${contract.id}`}
                          className="flex items-center text-yellow-600 hover:text-yellow-900"
                        >
                          <FaEdit className="mr-1" /> Sửa
                        </Link>
                        <button
                          className="flex items-center text-red-600 hover:text-red-900"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Bạn chắc chắn muốn xóa hợp đồng ${contract.id}?`,
                              )
                            ) {
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

          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-3">
            <p className="text-sm text-gray-700">
              Hiển thị{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> đến{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, contracts.length)}
              </span>{" "}
              của <span className="font-medium">{contracts.length}</span> kết
              quả
            </p>
            <div>
              <nav
                className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  &larr;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  &rarr;
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </SidebarWithNavbar>
  );
}
