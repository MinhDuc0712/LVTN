

import Sidebar from '../Sidebar';
import { FaQrcode, FaWallet, FaUniversity } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

function Momo() {
    const [amount, setAmount] = useState(50000);
    const [invoice, setInvoice] = useState(false);

    // Tính khuyến mãi theo mốc
    let bonus = 0;
    if (amount >= 2000000) bonus = amount * 0.25;
    else if (amount >= 1000000) bonus = amount * 0.2;
    else if (amount >= 100000) bonus = amount * 0.1;

    const finalReceive = amount + bonus;

    const amounts = [50000, 100000, 200000, 500000, 1000000, 2000000, 5000000];

    return (
        <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen p-4 md:p-6">
            <Sidebar />

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
                <div className="bg-blue-100 p-4 rounded mb-6 text-sm my-10 md:w-3/4 text-gray-700">
                    <p className="font-semibold mb-2">Ưu đãi nạp tiền:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Nạp từ 100.000 đến dưới 1.000.000 tặng 10%</li>
                        <li>Nạp từ 1.000.000 đến dưới 2.000.000 tặng 20%</li>
                        <li>Nạp từ 2.000.000 trở lên tặng 25%</li>
                    </ul>
                </div>

                <div className="w-full md:w-3/4 p-6">
                    <h1 className="text-2xl font-bold mb-6">Nạp tiền vào tài khoản bằng MOMO</h1>

                    {/* Chọn số tiền */}
                    <div className="bg-white shadow p-6 rounded-md mb-6">
                        <h2 className="text-lg font-semibold mb-4">Chọn số tiền cần nạp</h2>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                            {amounts.map((amt) => (
                                <button
                                    key={amt}
                                    className={`py-2 px-4 border rounded-full transition-all ${amt === amount
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'text-blue-600 border-blue-600 hover:bg-blue-100'
                                        }`}
                                    onClick={() => setAmount(amt)}
                                >
                                    {amt.toLocaleString()}₫
                                </button>
                            ))}
                        </div>
                        <label>Hoặc nhập số tiền cần nạp</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full border px-4 mt-4 py-2 rounded focus:outline-none"
                            placeholder="Hoặc nhập số tiền cần nạp"
                        />
                    </div>

                    {/* Thông tin giao dịch */}
                    <div className="bg-white shadow p-6 rounded-md mb-6">
                        <h2 className="text-lg font-semibold mb-4">Thông tin nạp tiền</h2>
                        <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                                <span>Số tiền nạp</span>
                                <span>{amount.toLocaleString()}₫</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Khuyến mãi</span>
                                <span>+{bonus.toLocaleString()}₫</span>
                            </div>
                            <div className="flex justify-between font-bold text-black border-t pt-2">
                                <span>Thực nhận</span>
                                <span>{finalReceive.toLocaleString()}₫</span>
                            </div>
                        </div>
                    </div>
                    <button className="bg-[#ff1e56] hover:bg-[#e60042] w-full py-3 text-white font-semibold rounded-full transition-all">
                        Tiếp tục →
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Momo;
