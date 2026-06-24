"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const revenueData = [
  { month: "May", revenue: 1800 },
  { month: "Jun", revenue: 2200 },
  { month: "Jul", revenue: 1950 },
  { month: "Aug", revenue: 2800 },
  { month: "Sep", revenue: 2400 },
  { month: "Oct", revenue: 2450 },
];

const bookingsData = [
  { month: "May", bookings: 82 },
  { month: "Jun", bookings: 95 },
  { month: "Jul", bookings: 88 },
  { month: "Aug", bookings: 120 },
  { month: "Sep", bookings: 110 },
  { month: "Oct", bookings: 124 },
];

const stats = [
  { label: "Total Revenue", value: "13,600€", change: "+18% vs last 6mo" },
  { label: "Total Bookings", value: "619", change: "+22% vs last 6mo" },
  { label: "Avg. Revenue/mo", value: "2,267€", change: "+8% vs last 6mo" },
  { label: "Avg. Bookings/mo", value: "103", change: "+12% vs last 6mo" },
];

export default function AnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Last 6 months overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-100 rounded-2xl p-5"
          >
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
              {stat.label}
            </p>
            <p className="font-display text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-xs text-green-600 font-medium">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Grafovi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold mb-1">Revenue</h2>
          <p className="text-xs text-gray-400 mb-6">
            Monthly gross revenue (€)
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  fontSize: "13px",
                }}
                formatter={(value) => [`${value}€`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#4F46E5"
                strokeWidth={2}
                fill="url(#revenueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings Chart */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold mb-1">Bookings</h2>
          <p className="text-xs text-gray-400 mb-6">Monthly total bookings</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={bookingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  fontSize: "13px",
                }}
                formatter={(value) => [value, "Bookings"]}
              />
              <Bar dataKey="bookings" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
