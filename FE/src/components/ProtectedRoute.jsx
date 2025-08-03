import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({
  children,
  requireAuth = false,
  requireAdmin = false,
  requireHost = false,
}) => {
  const { isAuthenticated, isAdmin, isOwner, loading } = useAuth();

  if (loading) return null;

  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate
        to="/dang-nhap"
        replace
        state={{ message: "Vui lòng đăng nhập để tiếp tục!" }}
      />
    );
  }

  if (requireAdmin && !isAdmin()) {
    return (
      <Navigate
        to="/"
        replace
        state={{ message: "Bạn không có quyền truy cập khu vực admin!" }}
      />
    );
  }

  if (requireHost && !isOwner()) {
    return (
      <Navigate
        to="/"
        replace
        state={{ message: "Bạn không có quyền truy cập khu vực chủ tin đăng!" }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
