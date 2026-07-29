"use client";

import { useState, useEffect, use } from "react";
import { MapPinIcon, ClockIcon, StarIcon } from "@heroicons/react/24/outline";

type Business = {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
};

type Service = {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
};

type Step = "service" | "datetime" | "confirm";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5291";

export default function BookingPage({
  params,
}: {
  params: Promise<{ businessSlug: string }>;
}) {
  const { businessSlug } = use(params);

  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [step, setStep] = useState<Step>("service");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [clientForm, setClientForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [booked, setBooked] = useState(false);

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bizRes, svcRes] = await Promise.all([
          fetch(`${API_URL}/api/Business/public/${businessSlug}`),
          fetch(`${API_URL}/api/Services/public/${businessSlug}`),
        ]);
        const biz = await bizRes.json();
        const svcs = await svcRes.json();
        console.log("Business response:", biz);
        console.log("Services response:", svcs);
        setBusiness(biz);
        setServices(svcs ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [businessSlug]);

  const handleBook = async () => {
    if (
      !selectedService ||
      !selectedDate ||
      !selectedTime ||
      !clientForm.firstName ||
      !clientForm.email
    )
      return;

    try {
      const startTime = new Date(`${selectedDate}T${selectedTime}`);
      const endTime = new Date(
        startTime.getTime() + selectedService.duration * 60000,
      );

      await fetch(`${API_URL}/api/Appointments/public`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business!.id,
          serviceId: selectedService.id,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          clientFirstName: clientForm.firstName,
          clientLastName: clientForm.lastName,
          clientEmail: clientForm.email,
          clientPhone: clientForm.phone,
        }),
      });

      setBooked(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  if (!business)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Business not found.
      </div>
    );

  if (booked)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl p-10 text-center max-w-md shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-500 text-sm">
            Your appointment at <strong>{business.name}</strong> has been
            confirmed. We&apos;ll send a confirmation to {clientForm.email}.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <span className="font-display text-xl font-bold text-indigo-600">
          BookEasy
        </span>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Lijeva strana - info o biznisu */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl mb-4">
              {business?.name?.[0] ?? "B"}
            </div>
            <h1 className="font-display text-xl font-bold mb-2">
              {business.name}
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              {business.description}
            </p>

            <div className="flex flex-col gap-2">
              {business.address && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPinIcon className="w-4 h-4 shrink-0" />
                  {business.address}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <StarIcon className="w-4 h-4 shrink-0" />
                4.9 (128 reviews)
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ClockIcon className="w-4 h-4 shrink-0" />
                Mon - Fri: 09:00 - 19:00
              </div>
            </div>
          </div>
        </div>

        {/* Desna strana - booking flow */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Step 1 - Select Service */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">
                1. Select Service
              </h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                Step 1 of 3
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service);
                    setStep("datetime");
                  }}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${
                    selectedService?.id === service.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-100 hover:border-indigo-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-indigo-600 font-semibold text-sm">
                      {service.price === 0 ? "Free" : `${service.price}€`}
                    </span>
                    <span className="text-xs text-gray-400">
                      {service.duration} min
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{service.name}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {service.description}
                  </p>
                  <button className="mt-3 w-full border border-indigo-200 text-indigo-600 text-xs font-semibold py-1.5 rounded-lg hover:bg-indigo-50">
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2 - Choose Date & Time */}
          <div
            className={`bg-white border border-gray-100 rounded-2xl p-6 ${step === "service" ? "opacity-50 pointer-events-none" : ""}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">
                2. Choose Date & Time
              </h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                Step 2 of 3
              </span>
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setStep("confirm");
                }}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            {selectedDate && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Select Time
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 text-sm rounded-xl border transition-colors ${
                        selectedTime === slot
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-gray-200 text-gray-700 hover:border-indigo-300"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Step 3 - Confirm */}
          <div
            className={`bg-indigo-50 border border-indigo-100 rounded-2xl p-6 ${step !== "confirm" ? "opacity-50 pointer-events-none" : ""}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">
                3. Your Details
              </h2>
              <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full">
                Step 3 of 3
              </span>
            </div>

            <div className="flex flex-col gap-3 mb-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={clientForm.firstName}
                    onChange={(e) =>
                      setClientForm({
                        ...clientForm,
                        firstName: e.target.value,
                      })
                    }
                    placeholder="John"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 bg-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={clientForm.lastName}
                    onChange={(e) =>
                      setClientForm({ ...clientForm, lastName: e.target.value })
                    }
                    placeholder="Doe"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Email
                </label>
                <input
                  type="email"
                  value={clientForm.email}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, email: e.target.value })
                  }
                  placeholder="john@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 bg-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Phone
                </label>
                <input
                  type="tel"
                  value={clientForm.phone}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, phone: e.target.value })
                  }
                  placeholder="+385 91 123 4567"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 bg-white"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl p-4 mb-4 border border-indigo-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Service</span>
                <span className="text-sm font-medium">
                  {selectedService?.name ?? "—"}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Date</span>
                <span className="text-sm font-medium">
                  {selectedDate || "—"}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Time</span>
                <span className="text-sm font-medium">
                  {selectedTime || "—"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-sm font-bold text-indigo-600">
                  {selectedService?.price === 0
                    ? "Free"
                    : `${selectedService?.price ?? 0}€`}
                </span>
              </div>
            </div>

            <button
              onClick={handleBook}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-indigo-700"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
