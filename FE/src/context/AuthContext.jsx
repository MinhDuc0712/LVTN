import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosAuth } from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedToken = sessionStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Hàm xử lý đăng nhập
  const login = (userData, token, roles) => {
    const fullUserData = { ...userData, roles };
    setUser(fullUserData);
    setIsAuthenticated(true);
    sessionStorage.setItem("user", JSON.stringify(fullUserData));
    sessionStorage.setItem("token", token);
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

  const isAdmin = () => {
    return (user.roles && user.roles.includes("admin")) || false;
  };

  const isOwner = () => {
    return (user.roles && user.roles.includes("owner")) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        login,
        logout,
        isAdmin,
        isOwner,
        loading,
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
