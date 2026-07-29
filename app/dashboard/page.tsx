"use client";

import { useEffect, useState } from "react";
import {
  CalendarDaysIcon,
  BanknotesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { apifetch } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

type Appointment = {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  client: { firstName: string; lastName: string; type: string };
  service: { name: string; duration: number };
};

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apifetch<Appointment[]>("/api/Appointments/today");
        setAppointments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getHour = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">
            Good morning, {user?.firstName}
          </h1>
          <p className="text-gray-500 text-sm">
            You have{" "}
            <span className="text-indigo-600 font-semibold">
              {appointments.length} appointments
            </span>{" "}
            scheduled for today.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
            {user?.firstName?.[0]}
          </div>
          <div>
            <p className="text-sm font-medium">{user?.businessName}</p>
            <p className="text-xs text-gray-400">Owner</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Today's Appointments",
            value: appointments.length.toString(),
            icon: CalendarDaysIcon,
          },
          { label: "Gross Revenue", value: "—", icon: BanknotesIcon },
          { label: "Total Clients", value: "—", icon: UserGroupIcon },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-100 rounded-2xl p-5"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
              <stat.icon className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              {stat.label}
            </p>
            <p className="font-display text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Today's Appointments */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold mb-5">
          Today&apos;s Appointments
        </h2>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-400 text-sm">No appointments today.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                    {apt.client.firstName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {apt.client.firstName} {apt.client.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{apt.client.type}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{apt.service.name}</p>
                  <p className="text-xs text-gray-400">
                    {apt.service.duration} min
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="w-4 h-4 text-indigo-400" />
                  <p className="text-sm font-semibold">
                    {getHour(apt.startTime)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
