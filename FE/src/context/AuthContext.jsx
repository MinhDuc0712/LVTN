import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosAuth } from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State lưu thông tin user
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State kiểm tra đăng nhập
  const navigate = useNavigate();

//   Kiểm tra localStorage khi component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Hàm xử lý đăng nhập
 const login = (userData, token) => {  // Thêm tham số token
  setUser(userData);
  setIsAuthenticated(true);
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', token);  // Lưu token vào localStorage
};

  // Hàm xử lý đăng xuất
const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Không tìm thấy token trong localStorage');
      // Xử lý đăng xuất phía client dù không có token
      handleClientLogout();
      return;
    }

    await axiosAuth.post('/logout');
    console.log('Token đã được xóa phía server');
  } catch (error) {
    console.error('Lỗi khi gọi API đăng xuất:', error.response || error);
    // Nếu lỗi 401, vẫn tiến hành đăng xuất phía client
    if (error.response?.status === 401) {
      console.warn('Token không hợp lệ hoặc đã hết hạn');
    }
  }

  handleClientLogout();
};

const handleClientLogout = () => {
  setUser(null);
  setIsAuthenticated(false);
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  navigate('/', {
    state: { message: 'Bạn đã đăng xuất thành công!' },
    replace: true,
  });
};

//   // Cung cấp giá trị cho các component con
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// //  Custom hook để sử dụng auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};