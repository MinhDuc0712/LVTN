import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FaArrowLeft,
  FaArrowRight,
  FaEdit,
  FaPlus,
  FaSave,
  FaTrash,
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import {
  useDeleteDepositTransaction,
  useGetDepositTransactions,
  useGetUserByIdentifier,
  usePostDepositTransaction,
  useUpdateDepositTransaction,
} from "../../api/homePage/queries";
import { updateUserBalanceAPI } from "../../api/homePage/request";
import SidebarWithNavbar from "./SidebarWithNavbar";

// -------------------- CONSTANTS -------------------- //
const TRANSACTION_STATUS = {
  PENDING: "Đang xử lý",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Hủy bỏ",
};

const PAYMENT_METHODS = ["Banking", "MoMo", "ZaloPay", "ViettelPay"];
const DEFAULT_ITEMS_PER_PAGE = 10;
const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

// -------------------- COMPONENT -------------------- //
export default function NapTienPage() {
  // ---------- STATE ---------- //
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  const [form, setForm] = useState({
    ma_nguoi_dung: "",
    ho_ten: "",
    so_tien: "",
    khuyen_mai: "",
    phuong_thuc: "",
    trang_thai: TRANSACTION_STATUS.PENDING,
  });

  const queryClient = useQueryClient();
  const {
    data: depositsResponse,
    isLoading,
    isError,
    error,
  } = useGetDepositTransactions({
    per_page: 1000,
  });

  const depositsData = useMemo(() => {
    if (!depositsResponse) return [];
    if (Array.isArray(depositsResponse.data)) return depositsResponse.data;
    if (Array.isArray(depositsResponse)) return depositsResponse;
    if (depositsResponse.meta?.data) return depositsResponse.meta.data;
    return [];
  }, [depositsResponse]);

  const filteredData = useMemo(() => {
    let data = depositsData;

    if (filterStatus !== "Tất cả") {
      data = data.filter((txn) => txn.trang_thai === filterStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (txn) =>
          txn.user?.HoTen?.toLowerCase().includes(q) ||
          String(txn.ma_giao_dich).toLowerCase().includes(q) ||
          String(txn.ma_nguoi_dung).toLowerCase().includes(q),
      );
    }

    return data;
  }, [depositsData, filterStatus, searchQuery]);

  // ---------- PAGINATION ---------- //
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredData.length / itemsPerPage)),
    [filteredData.length, itemsPerPage],
  );

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchQuery, itemsPerPage]);

  // ---------- QUERIES & MUTATIONS ---------- //
  const addMutation = usePostDepositTransaction();
  const updateMutation = useUpdateDepositTransaction();
  const deleteMutation = useDeleteDepositTransaction();

  const { data: userData, isLoading: userLoading } = useGetUserByIdentifier(
    form.ma_nguoi_dung,
  );
  useEffect(() => {
    if (userData) {
      setForm((p) => ({ ...p, ho_ten: userData.ho_ten || "Không tìm thấy" }));
    } else if (form.ma_nguoi_dung && !userLoading) {
      setForm((p) => ({ ...p, ho_ten: "Không tìm thấy" }));
    }
  }, [userData, userLoading, form.ma_nguoi_dung]);

  // ---------- HANDLERS ---------- //
  const resetForm = () => {
    setForm({
      ma_nguoi_dung: "",
      ho_ten: "",
      so_tien: "",
      khuyen_mai: "",
      phuong_thuc: "",
      trang_thai: TRANSACTION_STATUS.PENDING,
    });
    setEditId(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.ma_nguoi_dung || !form.so_tien || !form.phuong_thuc) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }
    if (Number(form.so_tien) <= 0) {
      toast.error("Số tiền phải lớn hơn 0");
      return;
    }

    const formData = {
      ma_nguoi_dung: form.ma_nguoi_dung,
      so_tien: Number(form.so_tien),
      khuyen_mai: form.khuyen_mai || 0,
      phuong_thuc: form.phuong_thuc,
      trang_thai: form.trang_thai,
    };

    try {
      if (editId) {
        await updateMutation.mutateAsync({ id: editId, formData });
        if (formData.trang_thai === TRANSACTION_STATUS.COMPLETED) {
          await updateUserBalanceAPI(
            formData.ma_nguoi_dung,
            formData.so_tien + formData.khuyen_mai,
          );
        }
      } else {
        await addMutation.mutateAsync(formData);
      }
      toast.success(
        editId ? "Cập nhật giao dịch thành công" : "Thêm giao dịch thành công",
      );
      resetForm();
      queryClient.invalidateQueries(["depositTransactions"]);
    } catch (err) {
      toast.error(`Lỗi: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEdit = (txn) => {
    setForm({
      ma_nguoi_dung: txn.ma_nguoi_dung,
      ho_ten: txn.user?.HoTen || "Không có tên",
      so_tien: txn.so_tien,
      khuyen_mai: txn.khuyen_mai || 0,
      phuong_thuc: txn.phuong_thuc,
      trang_thai: txn.trang_thai,
    });
    setEditId(txn.id);
    setShowForm(true);
  };

  const formatCurrency = (num) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num || 0);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Xóa giao dịch thành công");
      queryClient.invalidateQueries(["depositTransactions"]);
    } catch (err) {
      toast.error(`Lỗi khi xóa: ${err.message}`);
    }
  };

  // ---------- RENDER HELPERS ---------- //
  const renderPageNumbers = () => {
  const pageButtons = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(i);
    }
  } else {
    pageButtons.push(1);

    if (currentPage > 3) {
      pageButtons.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pageButtons.push(i);
    }

    if (currentPage < totalPages - 2) {
      pageButtons.push("...");
    }

    pageButtons.push(totalPages);
  }

  return (
    <div className="flex flex-wrap gap-1">
      {pageButtons.map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500 text-sm">
            ...
          </span>
        ) : (
          <button
            key={`page-${page}`}
            onClick={() => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" }); // optional scroll to top
            }}
            disabled={page === currentPage}
            className={`px-3 py-1 rounded text-sm ${
              page === currentPage
                ? "bg-blue-600 text-white cursor-default"
                : "bg-white border hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        )
      )}
    </div>
  );
};


  // ---------- RENDER ---------- //
  if (isError) {
    return (
      <SidebarWithNavbar>
        <div className="py-10 text-center text-red-500">
          Lỗi khi tải dữ liệu: {error?.message || "Không xác định"}
        </div>
      </SidebarWithNavbar>
    );
  }

  return (
    <SidebarWithNavbar>
      <Toaster position="top-right" />

      <div className="mx-auto max-w-7xl px-4 py-4">
        <h1 className="mb-6 text-center text-2xl font-bold text-blue-700">
          Quản lý nạp tiền
        </h1>

        {/* ---------- SEARCH & FILTER ---------- */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row">
          <input
            type="text"
            placeholder="🔍 Tìm theo tên hoặc số điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 rounded-lg border border-blue-300 p-2 focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-blue-300 p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            {Object.values(TRANSACTION_STATUS).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="rounded border px-2 py-1"
          >
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option} giao dịch/trang
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            {showForm ? (
              "Đóng form"
            ) : (
              <>
                <FaPlus /> Thêm giao dịch
              </>
            )}
          </button>
        </div>

        {/* ---------- FORM THÊM / SỬA ---------- */}
        {showForm && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold text-blue-700">
              {editId ? "Chỉnh sửa giao dịch" : "Thêm giao dịch mới"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Mã người dùng / SĐT */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Số điện thoại hoặc Mã người dùng *
                  </label>
                  <input
                    name="ma_nguoi_dung"
                    value={form.ma_nguoi_dung}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-blue-300 p-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mã người dùng hoặc SĐT"
                    required
                  />
                </div>

                {/* Tên người dùng */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Tên người dùng
                  </label>
                  <input
                    value={
                      userLoading
                        ? "Đang tìm kiếm..."
                        : form.ho_ten || "Nhập mã/SĐT để tìm kiếm"
                    }
                    readOnly
                    className="w-full rounded-lg border border-gray-300 bg-gray-100 p-2"
                  />
                  {!userLoading && !userData && form.ma_nguoi_dung && (
                    <p className="mt-1 text-sm text-red-500">
                      Không tìm thấy người dùng
                    </p>
                  )}
                </div>

                {/* Số tiền */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Số tiền (VND) *
                  </label>
                  <input
                    name="so_tien"
                    value={form.so_tien}
                    onChange={handleChange}
                    type="number"
                    min="1000"
                    step="1000"
                    className="w-full rounded-lg border border-blue-300 p-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập số tiền"
                    required
                  />
                </div>

                {/* Khuyến mãi */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Khuyến mãi (%)
                  </label>
                  <input
                    name="khuyen_mai"
                    value={form.khuyen_mai}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    className="w-full rounded-lg border border-blue-300 p-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập khuyến mãi"
                  />
                </div>

                {/* Phương thức */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phương thức *
                  </label>
                  <select
                    name="phuong_thuc"
                    value={form.phuong_thuc}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-blue-300 p-2 focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Chọn phương thức</option>
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Trạng thái */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Trạng thái
                  </label>
                  <select
                    name="trang_thai"
                    value={form.trang_thai}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-blue-300 p-2 focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.values(TRANSACTION_STATUS).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                  disabled={addMutation.isLoading || updateMutation.isLoading}
                >
                  {editId ? (
                    <>
                      <FaSave /> Lưu thay đổi
                    </>
                  ) : (
                    <>
                      <FaPlus /> Thêm mới
                    </>
                  )}
                  {(addMutation.isLoading || updateMutation.isLoading) && (
                    <ImSpinner2 className="ml-2 animate-spin" />
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bảng danh sách */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow">
          {isLoading ? (
            <div className="py-10 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : !currentData || currentData.length === 0 ? (
            <div className="py-10 text-center text-gray-600">
              Không có giao dịch nào để hiển thị
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase">
                        Tên
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase">
                        Mã GD
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase">
                        Số tiền
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase">
                        Khuyến mãi
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase">
                        Thực nhận
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase">
                        Phương thức
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase">
                        Ghi chú
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase">
                        Ngày nạp
                      </th>
                      <th className="px-10 py-3 text-left text-xs font-bold text-blue-700 uppercase">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-blue-700 uppercase">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {currentData.map((txn) => (
                      <tr key={txn.id}>
                        <td className="px-4 py-4">
                          {txn.user?.HoTen || "Không có tên"}
                        </td>
                        <td className="px-4 py-4">{txn.ma_giao_dich}</td>
                        <td className="px-4 py-4 text-amber-400">
                          {formatCurrency(txn.so_tien)}
                        </td>
                        <td className="px-4 py-4 text-blue-600">
                          {txn.khuyen_mai}%
                        </td>
                        <td className="px-4 py-4 text-green-600">
                          {formatCurrency(txn.thuc_nhan)}
                        </td>
                        <td className="px-4 py-4">{txn.phuong_thuc}</td>
                        <td className="px-4 py-4">
                          {txn.ghi_chu || "Không có ghi chú"}
                        </td>
                        <td className="px-4 py-4">{txn.ngay_nap}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              txn.trang_thai === "Hoàn tất"
                                ? "bg-green-100 text-green-700"
                                : txn.trang_thai === "Đang xử lý"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {txn.trang_thai}
                          </span>
                        </td>
                        <td className="space-x-2 px-4 py-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleEdit(txn)}
                            className="inline-flex items-center gap-1 rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                          >
                            <FaEdit /> Sửa
                          </button>

                          <button
                            onClick={() => handleDelete(txn.id)}
                            className="inline-flex items-center gap-1 rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                          >
                            <FaTrash /> Xoá
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Phân trang */}
              <div className="flex flex-col items-center justify-between gap-4 border-t bg-gray-50 px-4 py-4 sm:flex-row">
                <div className="text-sm text-gray-600">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, filteredData.length)}{" "}
                  trên tổng {filteredData.length}
                </div>

                <div className="flex items-center gap-4">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="flex items-center justify-center rounded border bg-white px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <FaArrowLeft className="text-sm" />
                  </button>

                  {renderPageNumbers()}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="flex items-center justify-center rounded border bg-white px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <FaArrowRight className="text-sm" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </SidebarWithNavbar>
  );
}
