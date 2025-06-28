import {
  Activity,
  CreditCard,
  DollarSign,
  Eye,
  Home, TrendingUp,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell, Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis
} from "recharts";
import SidebarWithNavbar from "./SidebarWithNavbar";

// Mock API functions - thay thế bằng API thực tế của bạn
const fetchDashboardStats = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    totalUsers: 1250,
    totalPosts: 350,
    totalRevenue: 15750000,
    totalTransactions: 89,
    userGrowth: 12.5,
    revenueGrowth: 8.3,
    postGrowth: 15.2,
    transactionGrowth: -2.1
  };
};

const fetchChartData = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    monthlyRevenue: [
      { month: 'T1', revenue: 12000000, transactions: 45 },
      { month: 'T2', revenue: 13500000, transactions: 52 },
      { month: 'T3', revenue: 11800000, transactions: 48 },
      { month: 'T4', revenue: 15200000, transactions: 61 },
      { month: 'T5', revenue: 14600000, transactions: 58 },
      { month: 'T6', revenue: 15750000, transactions: 65 }
    ],
    categoryStats: [
      { name: 'Nhà cho thuê', value: 45, color: '#3B82F6' },
      { name: 'Phòng trọ', value: 30, color: '#10B981' },
      { name: 'Căn hộ', value: 15, color: '#F59E0B' },
      { name: 'Khác', value: 10, color: '#EF4444' }
    ],
    userActivity: [
      { day: 'T2', users: 120 },
      { day: 'T3', users: 95 },
      { day: 'T4', users: 140 },
      { day: 'T5', users: 110 },
      { day: 'T6', users: 160 },
      { day: 'T7', users: 180 },
      { day: 'CN', users: 200 }
    ]
  };
};

const StatCard = ({ title, value, icon: Icon, growth, color = "blue" }) => {
  const isPositive = growth > 0;
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
          <div className="flex items-center mt-2">
            <TrendingUp className={`w-4 h-4 mr-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{growth}%
            </span>
            <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
          </div>
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
  }).format(amount);
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Activity className="w-4 h-4 inline mr-2" />
                Tổng quan
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BarChart className="w-4 h-4 inline mr-2" />
                Phân tích
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Tổng người dùng"
                value={stats.totalUsers.toLocaleString()}
                icon={Users}
                growth={stats.userGrowth}
                color="blue"
              />
              <StatCard
                title="Tổng bài đăng"
                value={stats.totalPosts.toLocaleString()}
                icon={Home}
                growth={stats.postGrowth}
                color="green"
              />
              <StatCard
                title="Doanh thu"
                value={formatCurrency(stats.totalRevenue)}
                icon={DollarSign}
                growth={stats.revenueGrowth}
                color="yellow"
              />
              <StatCard
                title="Giao dịch"
                value={stats.totalTransactions.toLocaleString()}
                icon={CreditCard}
                growth={stats.transactionGrowth}
                color="red"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-lg font-semibold text-blue-800 mb-4">Hành động nhanh</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 text-center rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                  <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm font-medium text-blue-800">Quản lý User</p>
                </button>
                <button className="p-4 text-center rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                  <Home className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="text-sm font-medium text-green-800">Bài đăng mới</p>
                </button>
                <button className="p-4 text-center rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                  <p className="text-sm font-medium text-yellow-800">Thanh toán</p>
                </button>
                <button className="p-4 text-center rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                  <Eye className="w-8 h-8 mx-auto mb-2 text-red-600" />
                  <p className="text-sm font-medium text-red-800">Báo cáo</p>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-blue-800 mb-4">Hoạt động gần đây</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    <strong>Nguyễn Văn A</strong> đã đăng bài mới
                  </span>
                  <span className="text-xs text-gray-400">5 phút trước</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    <strong>Trần Thị B</strong> đã nạp tiền thành công
                  </span>
                  <span className="text-xs text-gray-400">15 phút trước</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    <strong>Lê Văn C</strong> đã đăng ký tài khoản mới
                  </span>
                  <span className="text-xs text-gray-400">1 giờ trước</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Bài đăng bị báo cáo cần xem xét
                  </span>
                  <span className="text-xs text-gray-400">2 giờ trước</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <>
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Doanh thu theo tháng</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                      labelStyle={{ color: '#1f2937' }}
                    />
                    <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Category Distribution */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Phân bố danh mục</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.categoryStats}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {chartData.categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* User Activity & Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Hoạt động người dùng (7 ngày)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData.userActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Transaction Trend */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Xu hướng giao dịch</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="transactions" 
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