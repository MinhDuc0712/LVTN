import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AppRoutes from "./routes";
import Header from "./components/Header";
import Footer from "./components/Footer";

function AppContent() {
  const location = useLocation();
  
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="app">
      {!isAdminRoute && <Header />}
      <main>
        <AppRoutes />
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
