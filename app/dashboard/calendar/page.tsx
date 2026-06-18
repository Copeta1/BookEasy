"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const appointments = [
  { day: 3, title: "Alex Morgan", color: "bg-indigo-100 text-indigo-700" },
  { day: 3, title: "Jane Doe", color: "bg-green-100 text-green-700" },
  { day: 7, title: "Robert King", color: "bg-orange-100 text-orange-700" },
  { day: 14, title: "Lisa Wong", color: "bg-purple-100 text-purple-700" },
  { day: 18, title: "Alex Morgan", color: "bg-indigo-100 text-indigo-700" },
  { day: 22, title: "Jane Doe", color: "bg-green-100 text-green-700" },
  { day: 24, title: "Robert King", color: "bg-orange-100 text-orange-700" },
  { day: 24, title: "Lisa Wong", color: "bg-purple-100 text-purple-700" },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export default function CalendarPage() {
  const today = new Date();
  const [view, setView] = useState<"month" | "week">("month");
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Calendar</h1>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setView("month")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              view === "month"
                ? "bg-indigo-600 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setView("week")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              view === "week"
                ? "bg-indigo-600 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {/* Kalendar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        {/* Nav */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl hover:bg-gray-100"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
          </button>
          <h2 className="font-display text-lg font-semibold">
            {MONTHS[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl hover:bg-gray-100"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Dani u tjednu */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-gray-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Ćelije */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, idx) => {
            const isToday =
              day === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear();

            const dayAppointments = appointments.filter((a) => a.day === day);

            return (
              <div
                key={idx}
                className={`min-h-[90px] rounded-xl p-2 ${
                  day ? "hover:bg-gray-50 cursor-pointer" : ""
                }`}
              >
                {day && (
                  <>
                    <span
                      className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1 ${
                        isToday ? "bg-indigo-600 text-white" : "text-gray-700"
                      }`}
                    >
                      {day}
                    </span>
                    <div className="flex flex-col gap-1">
                      {dayAppointments.map((apt, i) => (
                        <span
                          key={i}
                          className={`text-xs px-1.5 py-0.5 rounded-md truncate ${apt.color}`}
                        >
                          {apt.title}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
