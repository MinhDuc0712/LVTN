import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AppRoutes from "./routes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";

function AppContent() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isLoginRoute = location.pathname.startsWith("/dang-nhap");
  const isRegisterRoute = location.pathname.startsWith("/dang-ky-tai-khoan");

  return (
    <div className="app">
      {!isAdminRoute && <Header />}
      <main>
        <AppRoutes />
      </main>
      {!isAdminRoute && !isLoginRoute && !isRegisterRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <div>
          {/* Your routes and components */}
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
