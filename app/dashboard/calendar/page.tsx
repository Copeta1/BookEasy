"use client";

import { useState, useEffect, Fragment } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { apifetch } from "@/lib/api";

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
const HOURS = Array.from({ length: 10 }, (_, i) => `${i + 8}:00`);

type Appointment = {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  client: { firstName: string; lastName: string };
  service: { name: string; duration: number };
};

type Client = {
  id: number;
  firstName: string;
  lastName: string;
};

type Service = {
  id: number;
  name: string;
  duration: number;
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function getWeekDates(date: Date) {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function CalendarPage() {
  const today = new Date();
  const [view, setView] = useState<"month" | "week">("month");
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentWeek, setCurrentWeek] = useState(today);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [isNewClient, setIsNewClient] = useState(false);
  const [form, setForm] = useState({
    clientId: "",
    serviceId: "",
    date: "",
    time: "",
  });
  const [newClientForm, setNewClientForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apts, cls, svcs] = await Promise.all([
          apifetch<Appointment[]>("/api/Appointments"),
          apifetch<Client[]>("/api/Clients"),
          apifetch<Service[]>("/api/Services"),
        ]);
        setAppointments(apts ?? []);
        setClients(cls ?? []);
        setServices(svcs ?? []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const filteredClients = clients.filter((c) =>
    `${c.firstName} ${c.lastName}`
      .toLowerCase()
      .includes(clientSearch.toLowerCase()),
  );

  const handleAddAppointment = async () => {
    if (!form.serviceId || !form.date || !form.time) return;

    let clientId = Number(form.clientId);

    // Ako je novi klijent, prvo ga kreiraj
    if (isNewClient) {
      if (!newClientForm.firstName || !newClientForm.lastName) return;
      try {
        const createdClient = await apifetch<Client>("/api/Clients", {
          method: "POST",
          body: JSON.stringify({
            ...newClientForm,
            type: "First Visit",
          }),
        });
        setClients([...clients, createdClient]);
        clientId = createdClient.id;
      } catch (err) {
        console.error(err);
        return;
      }
    }

    if (!clientId) return;

    const service = services.find((s) => s.id === Number(form.serviceId));
    const startTime = new Date(`${form.date}T${form.time}`);
    const endTime = new Date(
      startTime.getTime() + (service?.duration ?? 60) * 60000,
    );

    try {
      const created = await apifetch<Appointment>("/api/Appointments", {
        method: "POST",
        body: JSON.stringify({
          clientId,
          serviceId: Number(form.serviceId),
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          notes: "",
        }),
      });
      setAppointments([...appointments, created]);
      setIsModalOpen(false);
      setForm({ clientId: "", serviceId: "", date: "", time: "" });
      setNewClientForm({ firstName: "", lastName: "", email: "", phone: "" });
      setIsNewClient(false);
      setClientSearch("");
    } catch (err) {
      console.error(err);
    }
  };

  const getAppointmentsForDay = (day: number) => {
    return appointments.filter((apt) => {
      const d = new Date(apt.startTime);
      return (
        d.getDate() === day &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    });
  };

  const getAppointmentsForWeekDay = (date: Date, hour: number) => {
    return appointments.find((apt) => {
      const d = new Date(apt.startTime);
      return (
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear() &&
        d.getHours() === hour
      );
    });
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const weekDates = getWeekDates(currentWeek);
  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };
  const prevWeek = () => {
    const d = new Date(currentWeek);
    d.setDate(d.getDate() - 7);
    setCurrentWeek(d);
  };
  const nextWeek = () => {
    const d = new Date(currentWeek);
    d.setDate(d.getDate() + 7);
    setCurrentWeek(d);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Calendar</h1>
        <div className="flex items-center gap-3">
          <div className="flex bg-stone-100 rounded-full p-1">
            <button
              onClick={() => setView("month")}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${view === "month" ? "bg-moss-600 text-white" : "text-stone-500 hover:text-stone-700"}`}
            >
              Month
            </button>
            <button
              onClick={() => setView("week")}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${view === "week" ? "bg-moss-600 text-white" : "text-stone-500 hover:text-stone-700"}`}
            >
              Week
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-moss-600 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-moss-700"
          >
            <PlusIcon className="w-4 h-4" />
            New Appointment
          </button>
        </div>
      </div>

      {/* Kalendar */}
      <div className="bg-white border border-stone-100 rounded-3xl p-6">
        {/* Month View */}
        {view === "month" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevMonth}
                className="p-2 rounded-full hover:bg-stone-100"
              >
                <ChevronLeftIcon className="w-5 h-5 text-stone-500" />
              </button>
              <h2 className="font-display text-lg font-semibold">
                {MONTHS[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 rounded-full hover:bg-stone-100"
              >
                <ChevronRightIcon className="w-5 h-5 text-stone-500" />
              </button>
            </div>
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-stone-400 py-2"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, idx) => {
                const isToday =
                  day === today.getDate() &&
                  currentMonth === today.getMonth() &&
                  currentYear === today.getFullYear();
                const dayApts = getAppointmentsForDay(day);
                return (
                  <div
                    key={idx}
                    className={`min-h-22.5 rounded-xl p-2 ${day ? "hover:bg-stone-50 cursor-pointer" : ""}`}
                  >
                    {day && (
                      <>
                        <span
                          className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1 ${isToday ? "bg-moss-600 text-white" : "text-stone-700"}`}
                        >
                          {day}
                        </span>
                        <div className="flex flex-col gap-1">
                          {dayApts.map((apt) => (
                            <span
                              key={apt.id}
                              className="text-xs px-1.5 py-0.5 rounded-md truncate bg-moss-100 text-moss-700"
                            >
                              {apt.client?.firstName ?? "Unknown"} —{" "}
                              {apt.service?.name ?? "Unknown"}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Week View */}
        {view === "week" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevWeek}
                className="p-2 rounded-full hover:bg-stone-100"
              >
                <ChevronLeftIcon className="w-5 h-5 text-stone-500" />
              </button>
              <h2 className="font-display text-lg font-semibold">
                {weekDates[0].getDate()} — {weekDates[6].getDate()}{" "}
                {MONTHS[weekDates[6].getMonth()]} {weekDates[6].getFullYear()}
              </h2>
              <button
                onClick={nextWeek}
                className="p-2 rounded-full hover:bg-stone-100"
              >
                <ChevronRightIcon className="w-5 h-5 text-stone-500" />
              </button>
            </div>
            <div className="grid grid-cols-8 gap-1">
              <div></div>
              {weekDates.map((date, i) => {
                const isToday = date.toDateString() === today.toDateString();
                return (
                  <div
                    key={i}
                    className="text-center pb-3 border-b border-stone-100"
                  >
                    <p className="text-xs text-stone-400 mb-1">{DAYS[i]}</p>
                    <span
                      className={`text-sm font-semibold w-8 h-8 flex items-center justify-center rounded-full mx-auto ${isToday ? "bg-moss-600 text-white" : "text-stone-700"}`}
                    >
                      {date.getDate()}
                    </span>
                  </div>
                );
              })}
              {HOURS.map((hour, hourIdx) => (
                <Fragment key={`row-${hourIdx}`}>
                  <div className="text-xs text-stone-400 pt-2 pr-2 text-right">
                    {hour}
                  </div>
                  {weekDates.map((date, dayIdx) => {
                    const apt = getAppointmentsForWeekDay(date, hourIdx + 8);
                    return (
                      <div
                        key={`cell-${hourIdx}-${dayIdx}`}
                        className="border-t border-stone-50 min-h-13] relative"
                      >
                        {apt && (
                          <div className="absolute inset-x-1 top-1 rounded-lg p-1.5 text-xs bg-moss-100 text-moss-700 border-l-2 border-moss-500">
                            <p className="font-medium truncate">
                              {apt.client?.firstName ?? "Unknown"}{" "}
                              {apt.client?.lastName ?? ""}
                            </p>
                            <p className="opacity-70">
                              {apt.service?.name ?? "Unknown"}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold">
                New Appointment
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-stone-100"
              >
                <XMarkIcon className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Client toggle */}
              <div className="flex bg-stone-100 rounded-full p-1">
                <button
                  onClick={() => setIsNewClient(false)}
                  className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${!isNewClient ? "bg-moss-600 text-white" : "text-stone-500"}`}
                >
                  Existing Client
                </button>
                <button
                  onClick={() => setIsNewClient(true)}
                  className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${isNewClient ? "bg-moss-600 text-white" : "text-stone-500"}`}
                >
                  New Client
                </button>
              </div>

              {/* Existing client search */}
              {!isNewClient && (
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                    Search Client
                  </label>
                  <input
                    type="text"
                    placeholder="Type to search..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100 mb-2"
                  />
                  <div className="border border-stone-200 rounded-xl overflow-hidden max-h-40 overflow-y-auto">
                    {filteredClients.length === 0 ? (
                      <p className="text-sm text-stone-400 p-3">
                        No clients found.
                      </p>
                    ) : (
                      filteredClients.map((c) => (
                        <div
                          key={c.id}
                          onClick={() =>
                            setForm({ ...form, clientId: String(c.id) })
                          }
                          className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-moss-50 ${form.clientId === String(c.id) ? "bg-moss-50 text-moss-600 font-medium" : "text-stone-700"}`}
                        >
                          {c.firstName} {c.lastName}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* New client form */}
              {isNewClient && (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={newClientForm.firstName}
                        onChange={(e) =>
                          setNewClientForm({
                            ...newClientForm,
                            firstName: e.target.value,
                          })
                        }
                        placeholder="John"
                        className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={newClientForm.lastName}
                        onChange={(e) =>
                          setNewClientForm({
                            ...newClientForm,
                            lastName: e.target.value,
                          })
                        }
                        placeholder="Doe"
                        className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newClientForm.email}
                      onChange={(e) =>
                        setNewClientForm({
                          ...newClientForm,
                          email: e.target.value,
                        })
                      }
                      placeholder="john@example.com"
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={newClientForm.phone}
                      onChange={(e) =>
                        setNewClientForm({
                          ...newClientForm,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+385 91 123 4567"
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
                    />
                  </div>
                </div>
              )}

              {/* Service */}
              <div>
                <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                  Service
                </label>
                <select
                  value={form.serviceId}
                  onChange={(e) =>
                    setForm({ ...form, serviceId: e.target.value })
                  }
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
                >
                  <option value="">Select service...</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.duration} min)
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                    Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                    Time
                  </label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 border border-stone-200 text-stone-600 py-3 rounded-full text-sm font-medium hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAppointment}
                className="flex-1 bg-moss-600 text-white py-3 rounded-full text-sm font-medium hover:bg-moss-700"
              >
                Add Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
