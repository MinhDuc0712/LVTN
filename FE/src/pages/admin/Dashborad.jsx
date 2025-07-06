import { fetchChartData, fetchDashboardStats } from "@/api/homePage";
import {
  CreditCard,
  DollarSign,
  Eye,
  Home,
  TrendingUp,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import SidebarWithNavbar from "./SidebarWithNavbar";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, icon: Icon, growth, color = "blue" }) => {
  // const isPositive = growth > 0;
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-900",
    green: "bg-green-50 border-green-200 text-green-900",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-900",
    red: "bg-red-50 border-red-200 text-red-900"
  };

  return (
    <div className={`p-6 rounded-xl border-2 ${colorClasses[color]} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-70">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {/* <div className="flex items-center mt-2">
            <TrendingUp className={`w-4 h-4 mr-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{growth}%
            </span>
            <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
          </div> */}
        </div>
        <div className={`p-3 rounded-full ${color === 'blue' ? 'bg-blue-100' : color === 'green' ? 'bg-green-100' : color === 'yellow' ? 'bg-yellow-100' : 'bg-red-100'}`}>
          <Icon className="w-6 h-6 text-current" />
        </div>
      </div>
    </div>
  );
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount || 0);
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, chartsData] = await Promise.all([
          fetchDashboardStats(),
          fetchChartData()
        ]);
        setStats(statsData);
        setChartData(chartsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <SidebarWithNavbar>
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 bg-gray-200 rounded-xl"></div>
              <div className="h-80 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </SidebarWithNavbar>
    );
  }

  return (
    <SidebarWithNavbar>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Tổng quan về hệ thống quản lý</p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Tổng người dùng"
              value={stats?.totalUsers?.toLocaleString?.() || 0}
              icon={Users}
              growth={stats?.userGrowth ?? 0}
              color="blue"
            />
            <StatCard
              title="Tổng bài đăng"
              value={stats?.totalPosts?.toLocaleString?.() || 0}
              icon={Home}
              growth={stats?.postGrowth ?? 0}
              color="green"
            />
            <StatCard
              title="Doanh thu"
              value={formatCurrency(stats?.totalRevenue)}
              icon={DollarSign}
              growth={stats?.revenueGrowth ?? 0}
              color="yellow"
            />
            <StatCard
              title="Giao dịch"
              value={stats?.totalTransactions?.toLocaleString?.() || 0}
              icon={CreditCard}
              growth={stats?.transactionGrowth ?? 0}
              color="red"
            />
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">Hành động nhanh</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to={`/admin/users`} className="p-4 text-center rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium text-blue-800">Quản lý User</p>
            </Link>
            <Link to={`/admin/post`} className="p-4 text-center rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
              <Home className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium text-green-800">Bài đăng mới</p>
            </Link>
            <Link to={`/admin/top_up`} className="p-4 text-center rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors">
              <CreditCard className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <p className="text-sm font-medium text-yellow-800">Nạp tiền</p>
            </Link>
            <Link to={`/admin/category`} className="p-4 text-center rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
              <Eye className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <p className="text-sm font-medium text-orange-800">Danh mục</p>
            </Link>
          </div>
        </div>

        {chartData && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Doanh thu theo tháng</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData?.monthlyRevenue || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                    <Tooltip formatter={(value) => [formatCurrency(value), 'Doanh thu']} />
                    <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Phân bố danh mục</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData?.CategoriesStats || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {(chartData?.CategoriesStats || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Số bài duyệt theo tháng</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData?.postTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="Bài đăng"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Xu hướng giao dịch</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData?.monthlyRevenue || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="Số giao dịch"
                      stroke="#F59E0B"
                      strokeWidth={3}
                      dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </SidebarWithNavbar>
  );
}
