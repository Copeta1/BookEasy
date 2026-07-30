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
    return <div className="text-stone-400 text-sm p-6">Loading...</div>;
  if (!data)
    return <div className="text-stone-400 text-sm p-6">No data available.</div>;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Analytics</h1>
        <p className="text-stone-500 text-sm mt-1">Last 6 months overview</p>
      </div>

      {/* Revenue hero + supporting stats */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="col-span-4 md:col-span-3 bg-white border border-stone-100 rounded-3xl p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-1">
            Total Revenue
          </p>
          <p className="text-3xl font-extrabold tabular-nums mb-4">
            {data.totalRevenue}€
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data.monthlyData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5b7a52" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#5b7a52" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#a8a29e" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#a8a29e" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e7e5e4",
                  fontSize: "13px",
                }}
                formatter={(value) => [`${value}€`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#5b7a52"
                strokeWidth={2}
                fill="url(#revenueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <div className="flex-1 bg-white border border-stone-100 rounded-3xl p-5 flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">
              Total Clients
            </p>
            <p className="text-2xl font-extrabold tabular-nums">{data.totalClients}</p>
          </div>
          <div className="flex-1 bg-white border border-stone-100 rounded-3xl p-5 flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">
              Avg. Revenue/mo
            </p>
            <p className="text-2xl font-extrabold tabular-nums">
              {data.avgRevenuePerMonth}€
            </p>
          </div>
        </div>
      </div>

      {/* Bookings hero + supporting stat */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-4 md:col-span-3 bg-white border border-stone-100 rounded-3xl p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-1">
            Total Bookings
          </p>
          <p className="text-3xl font-extrabold tabular-nums mb-4">
            {data.totalBookings}
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#a8a29e" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#a8a29e" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e7e5e4",
                  fontSize: "13px",
                }}
                formatter={(value) => [value, "Bookings"]}
              />
              <Bar dataKey="bookings" fill="#b3862f" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-2 md:col-span-1 bg-white border border-stone-100 rounded-3xl p-5 flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">
            Avg. Bookings/mo
          </p>
          <p className="text-2xl font-extrabold tabular-nums">
            {data.avgBookingsPerMonth}
          </p>
        </div>
      </div>
    </div>
  );
}
