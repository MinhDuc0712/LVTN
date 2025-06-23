import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w mx-auto text-center">
        {/* Simple 404 */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-gray-800 mb-4">404</h1>
          <div className="w-16 h-1 bg-blue-500 mx-auto mb-6"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Không tìm thấy đường dẫn này
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
        </div>

        {/* Simple Buttons */}
        <div className="space-y-3">
          <button 
            onClick={handleGoHome}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            <Home size={18} />
            Về trang chủ
          </button>
          
          <button 
            onClick={handleGoBack}
            className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-sm text-gray-500">
          Lỗi 404 - Không tìm thấy trang
        </div>
      </div>
    </div>
  );
};

export default NotFound;