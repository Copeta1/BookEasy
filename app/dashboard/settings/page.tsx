"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    businessName: "Sarah's Studio",
    ownerName: "Sarah Johnson",
    email: "sarah@studio.com",
    phone: "+385 91 123 4567",
    address: "Ilica 10, Zagreb, Croatia",
    description:
      "Expert colorists and stylists dedicated to bringing out your natural radiance.",
  });

  const [hours, setHours] = useState({
    monday: { open: "09:00", close: "19:00", active: true },
    tuesday: { open: "09:00", close: "19:00", active: true },
    wednesday: { open: "09:00", close: "19:00", active: true },
    thursday: { open: "09:00", close: "19:00", active: true },
    friday: { open: "09:00", close: "19:00", active: true },
    saturday: { open: "09:00", close: "15:00", active: true },
    sunday: { open: "09:00", close: "15:00", active: false },
  });

  const [notifications, setNotifications] = useState({
    emailBooking: true,
    emailReminder: true,
    emailCancellation: true,
    smsReminder: false,
  });

  const days = Object.keys(hours) as (keyof typeof hours)[];

  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    return `${String(hour).padStart(2, "0")}:${minute}`;
  });

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-2xl font-bold mb-8">Settings</h1>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
        <h2 className="font-display text-lg font-semibold mb-5">
          Business Profile
        </h2>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Business Name
              </label>
              <input
                type="text"
                value={profile.businessName}
                onChange={(e) =>
                  setProfile({ ...profile, businessName: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Owner Name
              </label>
              <input
                type="text"
                value={profile.ownerName}
                onChange={(e) =>
                  setProfile({ ...profile, ownerName: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Phone
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Address
            </label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Description
            </label>
            <textarea
              value={profile.description}
              onChange={(e) =>
                setProfile({ ...profile, description: e.target.value })
              }
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
            />
          </div>
          <div className="flex justify-end">
            <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
        <h2 className="font-display text-lg font-semibold mb-5">
          Working Hours
        </h2>
        <div className="flex flex-col gap-3">
          {days.map((day) => (
            <div key={day} className="flex items-center gap-4">
              <div className="w-28">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {day}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hours[day].active}
                  onChange={(e) =>
                    setHours({
                      ...hours,
                      [day]: { ...hours[day], active: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-checked:bg-indigo-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
              {hours[day].active ? (
                <div className="flex items-center gap-2">
                  <select
                    value={hours[day].open}
                    onChange={(e) =>
                      setHours({
                        ...hours,
                        [day]: { ...hours[day], open: e.target.value },
                      })
                    }
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  <span className="text-gray-400 text-sm">—</span>
                  <select
                    value={hours[day].close}
                    onChange={(e) =>
                      setHours({
                        ...hours,
                        [day]: { ...hours[day], close: e.target.value },
                      })
                    }
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <span className="text-sm text-gray-400">Closed</span>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-5">
          <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700">
            Save Hours
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold mb-5">
          Notifications
        </h2>
        <div className="flex flex-col gap-4">
          {[
            {
              key: "emailBooking",
              label: "Email on new booking",
              desc: "Receive an email when a client makes a booking",
            },
            {
              key: "emailReminder",
              label: "Email reminders",
              desc: "Send reminder emails to clients 24h before appointment",
            },
            {
              key: "emailCancellation",
              label: "Email on cancellation",
              desc: "Receive an email when a client cancels",
            },
            {
              key: "smsReminder",
              label: "SMS reminders",
              desc: "Send SMS reminders to clients before appointment",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {item.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    notifications[item.key as keyof typeof notifications]
                  }
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      [item.key]: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-checked:bg-indigo-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-5">
          <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700">
            Save Notifications
          </button>
        </div>
      </div>
    </div>
  );
}
