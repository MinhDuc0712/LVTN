import Sidebar from '../Sidebar';
import { FaQrcode, FaWallet, FaUniversity } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Deposit() {
    return (
        <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen p-4 md:p-6">
            <Sidebar />

            <div className="w-full md:w-3/4 p-4 md:p-6 bg-white rounded-xl shadow-md overflow-auto">
                <div className="flex flex-col space-y-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Quản lý giao dịch</h1>

                    <div className="flex border-b border-gray-200">
                        <div className="flex space-x-1">
                            <Link to="/Top-up">
                                <button className="px-4 py-3 border-b-2 border-blue-600 font-medium text-blue-600">
                                    Nạp tiền vào tài khoản
                                </button>
                            </Link>
                            <Link to="/history/top-up">
                                <button className="px-4 py-3 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                                    Lịch sử nạp tiền
                                </button>
                            </Link>
                            <Link to="/history/payment">
                                <button className="px-4 py-3 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                                    Lịch sử thanh toán
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Thông báo ưu đãi */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">Ưu đãi nạp tiền</h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Nạp từ 100.000đ đến dưới 1.000.000đ tặng 10%</li>
                                        <li>Nạp từ 1.000.000đ đến dưới 2.000.000đ tặng 20%</li>
                                        <li>Nạp từ 2.000.000đ trở lên tặng 25%</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Phương thức nạp tiền */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <Link to="/Top-up/Momo">
                            <div className="flex items-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-200 cursor-pointer">
                                <div className="p-3 rounded-full bg-pink-50 mr-4">
                                    <FaWallet className="text-pink-500 text-2xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Ví điện tử MOMO</h3>
                                    <p className="text-sm text-gray-500 mt-1">Nạp tiền nhanh qua ví MoMo</p>
                                </div>
                                <svg className="ml-auto h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </Link>

                        <Link to="/Top-up/QR">
                            <div className="flex items-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-200 cursor-pointer">
                                <div className="p-3 rounded-full bg-green-50 mr-4">
                                    <FaUniversity className="text-green-500 text-2xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Chuyển khoản ngân hàng</h3>
                                    <p className="text-sm text-gray-500 mt-1">Nạp tiền qua Internet Banking</p>
                                </div>
                                <svg className="ml-auto h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </Link>
                    </div>

                    {/* Thông tin thêm */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-800 mb-2">Lưu ý khi nạp tiền:</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li className="flex items-start">
                                <svg className="flex-shrink-0 h-4 w-4 text-gray-500 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Ưu đãi được áp dụng tự động khi nạp tiền</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="flex-shrink-0 h-4 w-4 text-gray-500 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Tiền sẽ được cộng vào tài khoản ngay khi giao dịch thành công</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="flex-shrink-0 h-4 w-4 text-gray-500 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Liên hệ hỗ trợ nếu giao dịch gặp sự cố</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Deposit;