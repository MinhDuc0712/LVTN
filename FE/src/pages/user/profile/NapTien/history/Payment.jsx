
import Sidebar from '../../Sidebar';

import { Link } from 'react-router-dom';
function HistoryTopUp(){
    const transactions = [
        {
          
          date: '00:43 07/05/2025',
          opening_balance: '50,000',
          ending_balance: '500,000',
          statusstatus: '450,000',
          code: 'MT01',
          type: 'Vip1',
          
        },
        {
          
            date: '00:43 07/05/2025',
            opening_balance: '50,000',
            ending_balance: '500,000',
            statusstatus: '450,000',
            code: 'MT02',
            type: 'Vip1',
          
        },
      ];
    return(
        <div className=" flex flex-col md:flex-row bg-gray-50 min-h-screen p-4 md:p-6">
            < Sidebar />
            <div className="w-full md:w-3/4 p-4 md:p-6 bg-white rounded-lg shadow-lg overflow-auto ">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-700">Quản lý giao dịch</h1>

                <div className="border-b mb-6 space-x-4 justify-center flex">
                    <Link to="/Top-up">
                    <button className="px-4 py-2 text-gray-500 cursor-pointer hover:text-blue-500">
                        Nạp tiền vào tài khoản
                    </button>
                    </Link>
                    <Link to="/history/top-up">
                    <button className="px-4 py-2 text-gray-500 cursor-pointer hover:text-blue-500">
                        Lịch sử nạp tiền
                    </button>
                    </Link>
                    <Link to="/history/payment">
                    <button className="px-4 py-2 border-b-2 cursor-pointer border-blue-500 font-semibold text-blue-500">
                        Lịch sử thanh toán
                    </button>
                    </Link>
                </div>
            <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">THỜI GIAN </th>
            <th className="border p-2">PHÍ THANH TOÁN </th>
            <th className="border p-2">SỐ DƯ ĐẦU</th>
            <th className="border p-2">SỐ DƯ CUỐI </th>
            <th className="border p-2">MÃ TIN </th>
            <th className="border p-2">LOẠI TIN </th>
            
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className="border">
              <td className="border p-2">{transaction.date}</td>
              <td className="border p-2">{transaction.opening_balance}</td>
              <td className="border p-2">{transaction.ending_balance}</td>
              <td className="border p-2">{transaction.statusstatus}</td>
              <td className="border p-2">{transaction.code}</td>
              <td className="border p-2">{transaction.type}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
            </div>

        </div>

    );
}
export default HistoryTopUp;