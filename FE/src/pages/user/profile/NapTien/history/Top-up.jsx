
import Sidebar from '../../Sidebar';

import { Link } from 'react-router-dom';
function HistoryTopUp(){
    const transactions = [
        {
          status: 'Lỗi',
          date: '00:43 07/05/2025',
          amount: '+50,000',
          promotion: '0',
          receipt: '0',
          transactionCode: 'PT12307052025004330',
          method: 'MOMO',
          notes: 'Nạp tiền không thành công, lỗi #36: Phiên giao dịch đã hết hạn',
        },
        {
          status: 'Lỗi',
          date: '22:33 25/04/2025',
          amount: '+50,000',
          promotion: '0',
          receipt: '0',
          transactionCode: 'PT12325042025223324',
          method: 'QR Code - QRSQ8FLP',
          notes: 'Nạp tiền không thành công, lỗi #36: Phiên giao dịch đã hết hạn',
        },
      ];
    return(
        <div className=" flex flex-col md:flex-row bg-gray-50 min-h-screen p-4 md:p-6">
            < Sidebar/>
            <div className="w-full md:w-3/4 p-4 md:p-6 bg-white rounded-lg shadow-lg overflow-auto">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-700">Quản lý giao dịch</h1>

                <div className="border-b mb-6 space-x-4 justify-center flex">
                    <Link to="/Top-up">
                    <button className="px-4 py-2 text-gray-500 cursor-pointer hover:text-blue-500">
                        Nạp tiền vào tài khoản
                    </button>
                    </Link>
                    <Link to="/history/top-up">
                    <button className="px-4 py-2 border-b-2 cursor-pointer border-blue-500 font-semibold text-blue-500">
                        Lịch sử nạp tiền
                    </button>
                    </Link>
                    <Link to="/history/payment">
                    <button className="px-4 py-2 text-gray-500 cursor-pointer hover:text-blue-500">
                        Lịch sử thanh toán
                    </button>
                    </Link>
                </div>
            <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">TRẠNG THÁI</th>
            <th className="border p-2">NGÀY NẠP</th>
            <th className="border p-2">SỐ TIỀN NẠP</th>
            <th className="border p-2">KHUYẾN MÃI</th>
            <th className="border p-2">THỰC NHẬN</th>
            <th className="border p-2">MÃ GIAO DỊCH</th>
            <th className="border p-2">PHƯƠNG THỨC</th>
            <th className="border p-2">GHI CHÚ</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className="border">
              <td className="border p-2">{transaction.status}</td>
              <td className="border p-2">{transaction.date}</td>
              <td className="border p-2">{transaction.amount}</td>
              <td className="border p-2">{transaction.promotion}</td>
              <td className="border p-2">{transaction.receipt}</td>
              <td className="border p-2">{transaction.transactionCode}</td>
              <td className="border p-2">{transaction.method}</td>
              <td className="border p-2">{transaction.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
            </div>

        </div>

    );
}
export default HistoryTopUp;