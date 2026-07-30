"use client";

import { useEffect, useState } from "react";
import {
  CalendarDaysIcon,
  BanknotesIcon,
  UserGroupIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { apifetch } from "@/lib/api";

type Appointment = {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  client: { firstName: string; lastName: string; type: string };
  service: { name: string; duration: number };
};

type Client = { id: number };
type Service = { id: number };

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DISMISS_KEY = "setupBannerDismissed";

function startOfWeek(date: Date) {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export default function DashboardPage() {
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannerDismissed, setBannerDismissed] = useState(
    () => typeof window !== "undefined" && localStorage.getItem(DISMISS_KEY) === "1",
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [today, all, cls, svcs] = await Promise.all([
          apifetch<Appointment[]>("/api/Appointments/today"),
          apifetch<Appointment[]>("/api/Appointments"),
          apifetch<Client[]>("/api/Clients"),
          apifetch<Service[]>("/api/Services"),
        ]);
        setTodayAppointments((today ?? []).slice().sort(
          (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        ));
        setAllAppointments(all ?? []);
        setClients(cls ?? []);
        setServices(svcs ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const now = new Date();
  const today = new Date();

  const getHour = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const dismissBanner = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setBannerDismissed(true);
  };

  const profileDone = true;
  const servicesDone = services.length > 0;
  const firstBookingDone = allAppointments.length > 0;
  const stepsComplete = [profileDone, servicesDone, firstBookingDone].filter(Boolean).length;
  const setupDone = stepsComplete === 3;

  const nextAppointment = todayAppointments.find(
    (apt) => new Date(apt.startTime).getTime() > now.getTime(),
  );
  const nowIndex = todayAppointments.findIndex(
    (apt) => new Date(apt.startTime).getTime() > now.getTime(),
  );

  const weekStart = startOfWeek(today);
  const weekCounts = WEEKDAYS.map((_, i) => {
    const dayStart = new Date(weekStart);
    dayStart.setDate(weekStart.getDate() + i);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);
    return allAppointments.filter((apt) => {
      const t = new Date(apt.startTime).getTime();
      return t >= dayStart.getTime() && t < dayEnd.getTime();
    }).length;
  });
  const weekMax = Math.max(1, ...weekCounts);
  const todayIndex = (today.getDay() + 6) % 7;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Overview</h1>
        <p className="text-stone-500 text-sm mt-1">
          {today.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Setup checklist */}
      {!loading && !setupDone && !bannerDismissed && (
        <div className="flex flex-wrap items-center gap-4 bg-moss-50 border border-moss-100 rounded-2xl px-5 py-4 mb-6">
          <div className="flex-1 min-w-[180px]">
            <p className="text-sm font-bold">Finish setting up your business</p>
            <p className="text-xs text-stone-500">{stepsComplete} of 3 steps complete</p>
          </div>
          <div className="flex items-center gap-2">
            {[
              { label: "Profile", done: profileDone },
              { label: "Services", done: servicesDone },
              { label: "First booking", done: firstBookingDone },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center gap-2">
                <span
                  className={`flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap ${step.done ? "text-moss-700" : "text-stone-400"}`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                      step.done
                        ? "bg-moss-600 border-moss-600 text-white"
                        : "bg-white border-stone-200"
                    }`}
                  >
                    {step.done && <CheckIcon className="w-3 h-3" />}
                  </span>
                  {step.label}
                </span>
                {i < arr.length - 1 && <span className="w-4 h-0.5 bg-stone-200 rounded" />}
              </div>
            ))}
          </div>
          <a
            href={!servicesDone ? "/dashboard/services" : "/dashboard/calendar"}
            className="bg-moss-600 text-white text-xs font-bold px-4 py-2.5 rounded-full whitespace-nowrap hover:bg-moss-700"
          >
            {!servicesDone ? "Add your first service →" : "Add your first booking →"}
          </a>
          <button
            onClick={dismissBanner}
            aria-label="Dismiss"
            className="text-stone-400 hover:text-stone-700"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bento grid */}
      <div className="grid grid-cols-4 grid-rows-[repeat(2,11rem)] gap-4">
        {/* Today's schedule */}
        <div className="col-span-2 row-span-2 bg-white border border-stone-100 rounded-3xl p-5 flex flex-col overflow-hidden">
          <h2 className="text-sm font-bold mb-3">Today&apos;s schedule</h2>
          {loading ? (
            <p className="text-stone-400 text-sm">Loading...</p>
          ) : todayAppointments.length === 0 ? (
            <p className="text-stone-400 text-sm">No appointments today.</p>
          ) : (
            <div className="flex-1 overflow-y-auto flex flex-col">
              {todayAppointments.map((apt, i) => (
                <div key={apt.id}>
                  {i === nowIndex && (
                    <div className="flex items-center gap-2 my-1">
                      <span className="text-[10px] font-bold text-white bg-moss-600 px-2 py-0.5 rounded-full tracking-wide">
                        NOW
                      </span>
                      <span className="flex-1 h-px bg-moss-600" />
                    </div>
                  )}
                  <div className="grid grid-cols-[2.9rem_1fr] gap-3 items-start">
                    <span className="text-xs text-stone-400 font-mono pt-2 text-right">
                      {getHour(apt.startTime)}
                    </span>
                    <div
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 my-1 ${
                        i % 2 === 0 ? "bg-moss-50" : "bg-gold-50"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                          i % 2 === 0 ? "bg-moss-600" : "bg-gold-600"
                        }`}
                      >
                        {apt.client.firstName[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {apt.client.firstName} {apt.client.lastName}
                        </p>
                        <p className="text-xs text-stone-400 truncate">{apt.service.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {nowIndex === -1 && todayAppointments.length > 0 && (
                <div className="flex items-center gap-2 my-1">
                  <span className="text-[10px] font-bold text-white bg-moss-600 px-2 py-0.5 rounded-full tracking-wide">
                    NOW
                  </span>
                  <span className="flex-1 h-px bg-moss-600" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Next up */}
        <div className="bg-stone-900 text-white rounded-3xl p-5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-moss-300 mb-2.5">
            Next up
          </p>
          {nextAppointment ? (
            <>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-moss-500 flex items-center justify-center font-bold text-sm shrink-0">
                  {nextAppointment.client.firstName[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">
                    {nextAppointment.client.firstName} {nextAppointment.client.lastName}
                  </p>
                  <p className="text-xs text-stone-300 truncate">
                    {nextAppointment.service.name} · {nextAppointment.service.duration} min
                  </p>
                </div>
              </div>
              <div className="flex items-baseline gap-1 mt-3 pt-2.5 border-t border-white/10">
                <span className="text-xl font-extrabold tabular-nums">
                  {Math.max(
                    0,
                    Math.round(
                      (new Date(nextAppointment.startTime).getTime() - now.getTime()) / 60000,
                    ),
                  )}
                </span>
                <span className="text-xs text-stone-300">min away</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-stone-300">
              {todayAppointments.length === 0
                ? "No appointments today."
                : "You're done for today."}
            </p>
          )}
        </div>

        {/* Today stat */}
        <div className="bg-white border border-stone-100 rounded-3xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 flex items-center gap-1.5 mb-2">
            <CalendarDaysIcon className="w-4 h-4 text-moss-600" />
            Today
          </p>
          <p className="text-2xl font-extrabold tabular-nums">
            {todayAppointments.length}{" "}
            <span className="text-xs font-semibold text-stone-400">appts</span>
          </p>
          {todayAppointments.length > 0 && (
            <div className="flex mt-2.5">
              {todayAppointments.slice(0, 4).map((apt, i) => (
                <span
                  key={apt.id}
                  className="w-6 h-6 rounded-full bg-moss-100 text-moss-700 flex items-center justify-center text-[10px] font-bold border-2 border-white -ml-1.5 first:ml-0"
                  style={{ zIndex: 4 - i }}
                >
                  {apt.client.firstName[0]}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Revenue stat */}
        <div className="bg-white border border-stone-100 rounded-3xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 flex items-center gap-1.5 mb-2">
            <BanknotesIcon className="w-4 h-4 text-moss-600" />
            Revenue
          </p>
          <p className="text-2xl font-extrabold tabular-nums">—</p>
        </div>

        {/* Clients stat */}
        <div className="bg-white border border-stone-100 rounded-3xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 flex items-center gap-1.5 mb-2">
            <UserGroupIcon className="w-4 h-4 text-moss-600" />
            Clients
          </p>
          <p className="text-2xl font-extrabold tabular-nums">{clients.length}</p>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="bg-white border border-stone-100 rounded-3xl p-5 mt-4">
        <h2 className="text-sm font-bold mb-4">This week</h2>
        <div className="flex items-end gap-4 h-24">
          {WEEKDAYS.map((day, i) => (
            <div key={day} className="flex-1 h-full flex flex-col items-center justify-end gap-1.5">
              <span
                className={`text-xs font-bold tabular-nums ${i === todayIndex ? "text-moss-700" : "text-stone-400"}`}
              >
                {weekCounts[i]}
              </span>
              <div
                className={`w-full max-w-8 rounded-t-md rounded-b-sm ${i === todayIndex ? "bg-moss-600" : "bg-moss-200"}`}
                style={{ height: `${(weekCounts[i] / weekMax) * 100}%`, minHeight: "4px" }}
              />
              <span
                className={`text-xs font-semibold ${i === todayIndex ? "text-moss-700" : "text-stone-400"}`}
              >
                {day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
