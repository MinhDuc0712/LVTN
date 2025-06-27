import Sidebar from "../Sidebar";
import { FaQrcode, FaWallet, FaUniversity } from "react-icons/fa";
import { Link } from "react-router-dom";
import React, { useState } from "react";

function BankingPayment() {
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
    <div className="flex min-h-screen flex-col bg-gray-50 p-4 md:flex-row md:p-6">
      <Sidebar />

      <div className="w-full overflow-auto rounded-lg bg-white p-4 shadow-lg md:w-3/4 md:p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-700 md:text-3xl">
          Quản lý giao dịch
        </h1>

        <div className="mb-6 flex justify-center space-x-4 border-b">
          <Link to="/Top-up">
            <button className="cursor-pointer border-b-2 border-blue-500 px-4 py-2 font-semibold text-blue-500">
              Nạp tiền vào tài khoản
            </button>
          </Link>
          <Link to="/history/top-up">
            <button className="cursor-pointer px-4 py-2 text-gray-500 hover:text-blue-500">
              Lịch sử nạp tiền
            </button>
          </Link>
          <Link to="/history/payment">
            <button className="cursor-pointer px-4 py-2 text-gray-500 hover:text-blue-500">
              Lịch sử thanh toán
            </button>
          </Link>
        </div>

        {/* Thông báo ưu đãi */}
        <div className="my-10 mb-6 rounded bg-blue-100 p-4 text-sm text-gray-700 md:w-3/4">
          <p className="mb-2 font-semibold">Ưu đãi nạp tiền:</p>
          <ul className="list-inside list-disc space-y-1">
            <li>Nạp từ 100.000 đến dưới 1.000.000 tặng 10%</li>
            <li>Nạp từ 1.000.000 đến dưới 2.000.000 tặng 20%</li>
            <li>Nạp từ 2.000.000 trở lên tặng 25%</li>
          </ul>
        </div>

        <div className="w-full p-6 md:w-3/4">
          <h1 className="mb-6 text-2xl font-bold">
            Nạp tiền vào tài khoản bằng ngân hàng{" "}
          </h1>
          <div>
            <img
              src={`https://api.vietqr.io/image/970418-5220181705-xghjIke.jpg?accountName=NGUYEN%20TRAN%20MINH%20DUC&amount=${amount}&addInfo={}`}
              alt="QR thanh toán"
              className="mx-auto h-auto max-w rounded border bg-white object-contain p-2 shadow"
            />
          </div>
          {/* Chọn số tiền */}
          <div className="mb-6 rounded-md bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">Chọn số tiền cần nạp</h2>
            <div className="mb-4 grid grid-cols-3 gap-4 md:grid-cols-4">
              {amounts.map((amt) => (
                <button
                  key={amt}
                  className={`rounded-full border px-4 py-2 transition-all ${
                    amt === amount
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-blue-600 text-blue-600 hover:bg-blue-100"
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
              className="mt-4 w-full rounded border px-4 py-2 focus:outline-none"
              placeholder="Hoặc nhập số tiền cần nạp"
            />
          </div>

          {/* Thông tin giao dịch */}
          <div className="mb-6 rounded-md bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">Thông tin nạp tiền</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Số tiền nạp</span>
                <span>{amount.toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between">
                <span>Khuyến mãi</span>
                <span>+{bonus.toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-black">
                <span>Thực nhận</span>
                <span>{finalReceive.toLocaleString()}₫</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BankingPayment;
