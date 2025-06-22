import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserPayments } from "../../../../../api/homePage/request";
import Sidebar from "../../Sidebar";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const ITEMS_PER_PAGE = 5;

function HistoryTopUp() {
    const [page, setPage] = useState(1);
    const { data: allTransactions = [], isLoading } = useQuery({
        queryKey: ["payments"],
        queryFn: fetchUserPayments,
    });


    const totalItems = allTransactions.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const currentItems = allTransactions.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    return (
        <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen p-4 md:p-6">
            <Sidebar />
            <div className="w-full md:w-3/4 p-4 md:p-6 bg-white rounded-xl shadow-md overflow-auto">
                <div className="flex flex-col space-y-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Quản lý giao dịch</h1>

                    <div className="flex border-b border-gray-200">
                        <div className="flex space-x-1">
                            <Link to="/Top-up"><button className="px-4 py-3 text-gray-600 hover:text-blue-600">Nạp tiền</button></Link>
                            <Link to="/history/top-up"><button className="px-4 py-3 text-gray-600 hover:text-blue-600">Lịch sử nạp</button></Link>
                            <Link to="/history/payment"><button className="px-4 py-3 border-b-2 border-blue-600 text-blue-600 font-medium">Lịch sử thanh toán</button></Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">THỜI GIAN</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PHÍ THANH TOÁN</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">MÃ TIN</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">LOẠI TIN</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4 text-gray-500">
                                            Không có giao dịch nào.
                                        </td>
                                    </tr>
                                ) : (
                                    currentItems.map((t, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {dayjs(t.created_at).format("HH:mm DD/MM/YYYY")}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-red-500">
                                                -{Number(t.PhiGiaoDich).toLocaleString()}₫
                                            </td>
                                            <td className="px-6 py-4 text-sm font-mono text-gray-600">
                                                #{t.MaNha}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {t.house?.NoiBat === 1 ? "Vip" : "Thường"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-sm text-gray-500 px-2">
                        Tổng <strong>{totalItems}</strong> giao dịch
                    </div>
                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
                        <button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Trước
                        </button>

                        <span className="text-sm text-gray-700">
                            Trang <strong>{page}</strong> / {totalPages}
                        </span>

                        <button
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages}
                            className="px-4 py-2 border rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Sau
                        </button>
                    </div>


                </div>
            </div>
        </div>
    );
}

export default HistoryTopUp;
