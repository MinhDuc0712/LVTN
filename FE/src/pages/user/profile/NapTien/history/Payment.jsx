import Sidebar from '../../Sidebar';
import { Link } from 'react-router-dom';

function HistoryTopUp() {
    const transactions = [
        {
            date: '00:43 07/05/2025',
            opening_balance: '50,000đ',
            ending_balance: '500,000đ',
            transaction_fee: '450,000đ',
            code: 'MT01',
            type: 'Vip1',
        },
        {
            date: '00:43 07/05/2025',
            opening_balance: '50,000đ',
            ending_balance: '500,000đ',
            transaction_fee: '450,000đ',
            code: 'MT02',
            type: 'Vip1',
        },
    ];

    return (
        <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen p-4 md:p-6">
            <Sidebar />
            
            <div className="w-full md:w-3/4 p-4 md:p-6 bg-white rounded-xl shadow-md overflow-auto">
                <div className="flex flex-col space-y-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Quản lý giao dịch</h1>

                    <div className="flex border-b border-gray-200">
                        <div className="flex space-x-1">
                            <Link to="/Top-up">
                                <button className="px-4 py-3 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                                    Nạp tiền vào tài khoản
                                </button>
                            </Link>
                            <Link to="/history/top-up">
                                <button className="px-4 py-3 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                                    Lịch sử nạp tiền
                                </button>
                            </Link>
                            <Link to="/history/payment">
                                <button className="px-4 py-3 border-b-2 border-blue-600 font-medium text-blue-600">
                                    Lịch sử thanh toán
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">THỜI GIAN</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PHÍ THANH TOÁN</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SỐ DƯ ĐẦU</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SỐ DƯ CUỐI</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MÃ TIN</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOẠI TIN</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactions.map((transaction, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {transaction.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-500">
                                            -{transaction.transaction_fee}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {transaction.opening_balance}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-500">
                                            {transaction.ending_balance}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                            {transaction.code}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {transaction.type}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Phân trang (nếu cần) */}
                    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
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
                                    Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">2</span> trong <span className="font-medium">2</span> kết quả
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HistoryTopUp;