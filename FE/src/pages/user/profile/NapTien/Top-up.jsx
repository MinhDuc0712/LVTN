

import Sidebar from '../Sidebar';
import { FaQrcode, FaWallet, FaUniversity } from 'react-icons/fa';
import { Link } from 'react-router-dom';
function Deposit() {

    return (
        <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen p-4 md:p-6">
            <Sidebar/>

            <div className="w-full md:w-3/4 p-4 md:p-6 bg-white rounded-lg shadow-lg overflow-auto ">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-700">Quản lý giao dịch</h1>

                <div className="border-b mb-6 space-x-4 justify-center flex">
                    <Link to="/Top-up">
                    <button className="px-4 py-2 border-b-2 cursor-pointer border-blue-500 font-semibold text-blue-500">
                        Nạp tiền vào tài khoản
                    </button>
                    </Link>
                    <Link to="/history/top-up">
                    <button className="px-4 py-2 text-gray-500 cursor-pointer hover:text-blue-500">
                        Lịch sử nạp tiền
                    </button>
                    </Link>
                    <Link to="/history/payment">
                    <button className="px-4 py-2 text-gray-500 cursor-pointer hover:text-blue-500">
                        Lịch sử thanh toán
                    </button>
                    </Link>
                </div>
                

                {/* Thông báo ưu đãi */}
                <div className="bg-blue-100 p-4 rounded mb-6 text-sm my-10 w-2xl  text-gray-700">
                    <p className="font-semibold mb-2">Ưu đãi nạp tiền:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Nạp từ 100.000 đến dưới 1.000.000 tặng 10%</li>
                        <li>Nạp từ 1.000.000 đến dưới 2.000.000 tặng 20%</li>
                        <li>Nạp từ 2.000.000 trở lên tặng 25%</li>
                    </ul>
                </div>

                {/* Phương thức nạp tiền */}
                <div className="space-y-4 my-10 w-2xl">
                    <Link to="/Top-up/Momo">
                    <button className="flex items-center p-4 cursor-pointer bg-white shadow rounded hover:bg-gray-100 w-full">
                        <FaWallet className="text-pink-500 text-2xl mr-3" />
                        <span className="text-lg font-semibold">Ví điện tử MOMO</span>
                    </button>
                    </Link>
                    <Link to="/Top-up/QR">
                    <button className="flex items-center p-4 cursor-pointer bg-white shadow rounded hover:bg-gray-100 w-full">
                        <FaUniversity className="text-green-500 text-2xl mr-3" />
                        <span className="text-lg font-semibold">Chuyển khoản ngân hàng</span>
                    </button>
                    </Link>
                </div>
                
            </div>
        </div>
    );
}

export default Deposit;
