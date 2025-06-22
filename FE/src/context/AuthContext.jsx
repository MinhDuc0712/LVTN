import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosAuth } from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedToken = sessionStorage.getItem("token");
    if (storedUser && storedToken) {
      // console.log("Đã tìm thấy user trong sessionStorage:", storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Hàm xử lý đăng nhập
  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("token", token); // Lưu token vào sessionStorage
  };

  // Hàm xử lý đăng xuất
  const logout = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.warn("Không tìm thấy token trong sessionStorage");
        handleClientLogout();
        return;
      }

      await axiosAuth.post("/logout");
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Token không hợp lệ hoặc đã hết hạn");
      }
    }

    handleClientLogout();
  };

  const handleClientLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    navigate("/", {
      state: { message: "Bạn đã đăng xuất thành công!" },
      replace: true,
    });
  };

  // Cung cấp giá trị cho các component con
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//  Custom hook để sử dụng auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error("Lôi: useAuth được sử dụng ngoài AuthProvider");
  }
  return context;
};
