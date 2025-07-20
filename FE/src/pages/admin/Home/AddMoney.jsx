import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SidebarWithNavbar from "../SidebarWithNavbar";
import { FaHome, FaWater, FaMoneyBillWave, FaCalculator, FaSave, FaTimes, FaMoneyBill } from "react-icons/fa";
import { getHopDong, createPaymentReceipt } from "@/api/homePage/request";
import { toast } from 'react-toastify';

export default function CreatePaymentInvoice() {

  const [contracts, setContracts] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contractId: "",
    month: new Date().toISOString().slice(0, 7),
    electricBill: 0,
    waterBill: 0,
    rentAmount: 0,
    paidAmount: 0,
    services: 0,
    note: "",
  });

  const [selectedContract, setSelectedContract] = useState(null);
  const formatNumber = (amount) =>
    new Intl.NumberFormat("vi-VN").format(amount);
  useEffect(() => {
  const fetchData = async () => {
    const res = await getHopDong();
    setContracts(res);
  };
  fetchData();
}, []);

  useEffect(() => {
    if (selectedContract && formData.month) {
      const selectedMonth = formData.month;

      const electricBill = selectedContract.phieudien?.find(bill => bill.thang === selectedMonth);
      const waterBill = selectedContract.phienuoc?.find(bill => bill.thang === selectedMonth);

      setFormData(prev => ({
        ...prev,
        electricBill: electricBill ? Number(electricBill.don_gia) : 0,
        waterBill: waterBill ? Number(waterBill.don_gia) : 0
      }));
    }
  }, [formData.month, selectedContract]);

  // Tính toán các giá trị
  const totalAmount = formData.rentAmount + formData.electricBill + formData.waterBill + formData.services;
  const remainingAmount = totalAmount - formData.paidAmount;

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === "note" || name === "month" ? value : Number(value) || 0
    }));
  };
  // Khi chọn hợp đồng
  const handleContractChange = (e) => {
    const contractId = e.target.value;
    const contract = contracts.find(c => c.id === parseInt(contractId));
    const selectedMonth = formData.month;

    if (contract) {
      const electricBill = contract.phieudien?.find(bill => bill.thang === selectedMonth);
      const waterBill = contract.phienuoc?.find(bill => bill.thang === selectedMonth);
      // console.log("Tháng đang chọn:", selectedMonth);
      //console.log("Phiếu điện tháng đó:", waterBill);
      setFormData(prev => ({
        ...prev,
        contractId,
        rentAmount: Number(contract.tien_thue) || 0,
        electricBill: electricBill ? Number(electricBill.don_gia) : 0,
        waterBill: waterBill ? Number(waterBill.don_gia) : 0,
        services: Number(contract.chi_phi_tien_ich) || 0
      }));

      setSelectedContract(contract);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN").format(amount) + " ₫";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalAmount = formData.rentAmount + formData.electricBill + formData.waterBill + formData.services;
    const remainingAmount = totalAmount - formData.paidAmount;

    const status =
      remainingAmount < 0 ? "Trả dư" :
        remainingAmount > 0 ? "Còn nợ" :
          "Đã thanh toán";

    const payload = {
      hopdong_id: Number(formData.contractId),
      thang: formData.month,
      so_tien: totalAmount,
      da_thanh_toan: formData.paidAmount,
      no: remainingAmount,
      ngay_thu: new Date().toISOString().slice(0, 10),
      trang_thai: status,
      noi_dung: formData.note || ""
    };
    const res = await createPaymentReceipt(payload);
    toast.success(" Tạo phiếu thu tiền thành công!");
    setTimeout(() => {
      navigate('/admin/CollectMoney');
    }, 1000);
  };

  return (
    <SidebarWithNavbar>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Tạo hóa đơn thu tiền</h1>
          <Link
            to="/admin/CollectMoney"
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            <FaTimes className="mr-2" /> Hủy bỏ
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thông tin hợp đồng */}
              <div className="col-span-2">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Thông tin hợp đồng</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chọn hợp đồng <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="contractId"
                      value={formData.contractId}
                      onChange={handleContractChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">-- Chọn hợp đồng --</option>
                      {contracts.map(contract => (
                        <option key={contract.id} value={contract.id}>
                          {contract.phong.ten_phong} - {contract.khach.ho_ten}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedContract && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-500">Khách hàng</p>
                        <p className="font-medium">
                          {selectedContract.khach.ho_ten}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-500">Phòng</p>
                        <p className="font-medium">
                          {selectedContract.phong.ten_phong}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Thông tin hóa đơn */}
              <div className="col-span-2">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Thông tin hóa đơn</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tháng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="month"
                        name="month"
                        value={formData.month || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                      <div className="p-3 bg-blue-50 rounded-md  border-blue-100">
                        <div className="flex items-center mb-1">
                          <FaHome className="text-blue-500 mr-2" />
                          <p className="text-sm text-gray-500">Tiền nhà</p>
                        </div>
                        <p className="font-medium text-gray-800">
                          {formatCurrency(formData.rentAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                      <div className="p-3 bg-blue-50 rounded-md  border-blue-100">
                        <div className="flex items-center mb-1">
                          <FaWater className="text-blue-500 mr-2" />
                          <p className="text-sm text-gray-500">Tiền nước</p>
                        </div>
                        <p className="font-medium text-gray-800">
                          {formatCurrency(formData.waterBill)}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                      <div className="p-3 bg-blue-50 rounded-md  border-blue-100">
                        <div className="flex items-center mb-1">
                          <FaCalculator className="text-blue-500 mr-2" />
                          <p className="text-sm text-gray-500">Tiền điện</p>
                        </div>
                        <p className="font-medium text-gray-800">
                          {formatCurrency(formData.electricBill)}
                        </p>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                      <div className="p-3 bg-blue-50 rounded-md  border-blue-100">
                        <div className="flex items-center mb-1">
                          <FaMoneyBillWave className="text-blue-500 mr-2" />
                          <p className="text-sm text-gray-500">chi phí tiện ích khác</p>
                        </div>
                        <p className="font-medium text-gray-800">
                          {formatCurrency(formData.services)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thanh toán */}
              <div className="col-span-2">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Thanh toán</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Tổng tiền</p>
                        <p className="text-xl font-bold text-gray-800">
                          {formatCurrency(totalAmount)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số tiền thanh toán <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="paidAmount"
                          value={formatNumber(formData.paidAmount)}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^\d]/g, "");
                            setFormData(prev => ({
                              ...prev,
                              paidAmount: Number(raw) || 0
                            }));
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Công nợ</p>
                        <p
                          className={`text-xl font-bold ${remainingAmount < 0 ? "text-green-600" : remainingAmount > 0 ? "text-red-600" : "text-gray-800"
                            }`}
                        >
                          {remainingAmount !== 0
                            ? `${remainingAmount > 0 ? "-" : "+"}${formatNumber(Math.abs(remainingAmount))} ₫`
                            : "0 ₫"}
                        </p>
                      </div>

                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ghi chú
                      </label>
                      <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tóm tắt */}
              <div className="col-span-2">
                <div className="p-4 bg-yellow-50 rounded-md border border-yellow-100">
                  <h3 className="font-medium text-gray-800 mb-2">Tóm tắt hóa đơn</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tiền nhà:</span>
                      <span>{formatCurrency(formData.rentAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tiền điện:</span>
                      <span>{formatCurrency(formData.electricBill)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tiền nước:</span>
                      <span>{formatCurrency(formData.waterBill)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="font-medium">Tổng cộng:</span>
                      <span className="font-medium">{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Đã thanh toán:</span>
                      <span>{formatCurrency(formData.paidAmount)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="font-medium">Công nợ:</span>
                      <span
                        className={`font-medium ${remainingAmount < 0
                          ? "text-green-600"
                          : remainingAmount > 0
                            ? "text-red-600"
                            : "text-gray-800"
                          }`}
                      >
                        {remainingAmount !== 0
                          ? `${remainingAmount > 0 ? "-" : "+"}${formatNumber(Math.abs(remainingAmount))} ₫`
                          : "0 ₫"}
                      </span>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end border-t border-gray-200">
              <button
                type="submit"
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FaSave className="mr-2" />
                Lưu hóa đơn
              </button>
            </div>
          </form>
        </div>
      </div>
    </SidebarWithNavbar>
  );
}