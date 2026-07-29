"use client";

import { useState, useEffect } from "react";
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
import { apifetch } from "@/lib/api";

type MonthlyData = {
  month: string;
  bookings: number;
  revenue: number;
};

type AnalyticsData = {
  monthlyData: MonthlyData[];
  totalBookings: number;
  totalRevenue: number;
  totalClients: number;
  avgBookingsPerMonth: number;
  avgRevenuePerMonth: number;
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apifetch<AnalyticsData>("/api/Analytics");
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return <div className="text-gray-400 text-sm p-6">Loading...</div>;
  if (!data)
    return <div className="text-gray-400 text-sm p-6">No data available.</div>;

  const stats = [
    { label: "Total Revenue", value: `${data.totalRevenue}€` },
    { label: "Total Bookings", value: String(data.totalBookings) },
    { label: "Total Clients", value: String(data.totalClients) },
    { label: "Avg. Bookings/mo", value: String(data.avgBookingsPerMonth) },
  ];

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
            <AreaChart data={data.monthlyData}>
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
            <BarChart data={data.monthlyData}>
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
