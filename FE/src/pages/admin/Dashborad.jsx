import { fetchChartData, fetchDashboardStats } from "@/api/homePage";
import {
  CreditCard,
  DollarSign,
  Eye,
  Home,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import SidebarWithNavbar from "./SidebarWithNavbar";

const StatCard = ({ title, value, icon: Icon, growth, color = "blue" }) => {
  // const isPositive = growth > 0;
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-900",
    green: "bg-green-50 border-green-200 text-green-900",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-900",
    red: "bg-red-50 border-red-200 text-red-900",
  };

  return (
    <div
      className={`rounded-xl border-2 p-6 ${colorClasses[color]} shadow-sm transition-shadow hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-70">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          {/* <div className="flex items-center mt-2">
            <TrendingUp className={`w-4 h-4 mr-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{growth}%
            </span>
            <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
          </div> */}
        </div>
        <div
          className={`rounded-full p-3 ${color === "blue" ? "bg-blue-100" : color === "green" ? "bg-green-100" : color === "yellow" ? "bg-yellow-100" : "bg-red-100"}`}
        >
          <Icon className="h-6 w-6 text-current" />
        </div>
      </div>
    </div>
  );
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount || 0);
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("month");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, chartsData] = await Promise.all([
          fetchDashboardStats(),
          fetchChartData(filter),
        ]);
        setStats(statsData);
        setChartData(chartsData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filter]);

  if (loading) {
    return (
      <SidebarWithNavbar>
        <div className="mx-auto max-w-7xl p-6">
          <div className="animate-pulse">
            <div className="mb-6 h-8 w-64 rounded bg-gray-200"></div>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 rounded-xl bg-gray-200"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="h-80 rounded-xl bg-gray-200"></div>
              <div className="h-80 rounded-xl bg-gray-200"></div>
            </div>
          </div>
        </div>
      </SidebarWithNavbar>
    );
  }

  return (
    <SidebarWithNavbar>
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-blue-900">Dashboard</h1>
          <p className="text-gray-600">Tổng quan về hệ thống quản lý</p>
        </div>

        {stats && (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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

        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-blue-800">
            Hành động nhanh
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Link
              to={`/admin/users`}
              className="rounded-lg bg-blue-50 p-4 text-center transition-colors hover:bg-blue-100"
            >
              <Users className="mx-auto mb-2 h-8 w-8 text-blue-600" />
              <p className="text-sm font-medium text-blue-800">Quản lý User</p>
            </Link>
            <Link
              to={`/admin/post`}
              className="rounded-lg bg-green-50 p-4 text-center transition-colors hover:bg-green-100"
            >
              <Home className="mx-auto mb-2 h-8 w-8 text-green-600" />
              <p className="text-sm font-medium text-green-800">Bài đăng mới</p>
            </Link>
            <Link
              to={`/admin/top_up`}
              className="rounded-lg bg-yellow-50 p-4 text-center transition-colors hover:bg-yellow-100"
            >
              <CreditCard className="mx-auto mb-2 h-8 w-8 text-yellow-600" />
              <p className="text-sm font-medium text-yellow-800">Nạp tiền</p>
            </Link>
            <Link
              to={`/admin/category`}
              className="rounded-lg bg-red-50 p-4 text-center transition-colors hover:bg-red-100"
            >
              <Eye className="mx-auto mb-2 h-8 w-8 text-orange-600" />
              <p className="text-sm font-medium text-orange-800">Danh mục</p>
            </Link>
          </div>
        </div>

        {chartData && (
          <>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-blue-800">
                  Doanh thu
                </h3>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded-md border px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="week">Theo tuần</option>
                  <option value="month">Theo tháng</option>
                  <option value="year">Theo năm</option>
                </select>
              </div>

              {chartData?.revenueChart?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.revenueChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(value),
                        "Doanh thu",
                      ]}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-gray-500">
                  Không có dữ liệu doanh thu.
                </p>
              )}
            </div>

            {/* <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-blue-800">
                  Số bài duyệt theo tháng
                </h3>
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
                      dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-blue-800">
                  Xu hướng giao dịch
                </h3>
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
                      dot={{ fill: "#F59E0B", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div> */}
          </>
        )}
      </div>
    </SidebarWithNavbar>
  );
}
