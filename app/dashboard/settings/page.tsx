"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LinkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { apifetch } from "@/lib/api";

export default function SettingsPage() {
  const { t } = useTranslation();

  const [profile, setProfile] = useState({
    businessName: "Sarah's Studio",
    ownerName: "Sarah Johnson",
    email: "sarah@studio.com",
    phone: "+385 91 123 4567",
    address: "Ilica 10, Zagreb, Croatia",
    description:
      "Expert colorists and stylists dedicated to bringing out your natural radiance.",
  });

  const [slug, setSlug] = useState("");
  const [origin] = useState(
    () => (typeof window !== "undefined" ? window.location.origin : ""),
  );
  const [copied, setCopied] = useState(false);

  const bookingLink = slug ? `${origin}/${slug}` : "";

  const handleCopyLink = async () => {
    if (!bookingLink) return;
    await navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  const notificationItems = [
    {
      key: "emailBooking" as const,
      label: t("settings.notifBookingLabel"),
      desc: t("settings.notifBookingDesc"),
    },
    {
      key: "emailReminder" as const,
      label: t("settings.notifReminderLabel"),
      desc: t("settings.notifReminderDesc"),
    },
    {
      key: "emailCancellation" as const,
      label: t("settings.notifCancelLabel"),
      desc: t("settings.notifCancelDesc"),
    },
    {
      key: "smsReminder" as const,
      label: t("settings.notifSmsLabel"),
      desc: t("settings.notifSmsDesc"),
    },
  ];

  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    return `${String(hour).padStart(2, "0")}:${minute}`;
  });

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const data = await apifetch<{
          name: string;
          email: string;
          phone: string;
          address: string;
          description: string;
          slug: string;
        }>("/api/Business");

        setProfile({
          businessName: data.name,
          ownerName: profile.ownerName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          description: data.description,
        });
        setSlug(data.slug);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBusiness();
  }, []);

  const handleSave = async () => {
    try {
      await apifetch("/api/Business", {
        method: "PUT",
        body: JSON.stringify({
          name: profile.businessName,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          description: profile.description,
        }),
      });
      alert(t("settings.savedSuccess"));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-2xl font-bold mb-8">{t("settings.title")}</h1>

      {bookingLink && (
        <div className="bg-white border border-stone-100 rounded-3xl p-6 mb-6">
          <h2 className="font-display text-lg font-semibold mb-1">
            {t("settings.bookingLinkSection")}
          </h2>
          <p className="text-xs text-stone-400 mb-4">{t("settings.bookingLinkDesc")}</p>

          <div className="flex items-center gap-2.5 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 mb-3">
            <LinkIcon className="w-4 h-4 text-stone-400 shrink-0" />
            <span className="text-sm text-stone-700 truncate">{bookingLink}</span>
          </div>

          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-full transition-colors ${
              copied
                ? "bg-moss-100 text-moss-700"
                : "bg-moss-600 text-white hover:bg-moss-700"
            }`}
          >
            {copied && <CheckIcon className="w-4 h-4" />}
            {copied ? t("settings.copied") : t("settings.copyLink")}
          </button>
        </div>
      )}

      <div className="bg-white border border-stone-100 rounded-3xl p-6 mb-6">
        <h2 className="font-display text-lg font-semibold mb-5">
          {t("settings.profileSection")}
        </h2>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                {t("settings.businessName")}
              </label>
              <input
                type="text"
                value={profile.businessName}
                onChange={(e) =>
                  setProfile({ ...profile, businessName: e.target.value })
                }
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                {t("settings.ownerName")}
              </label>
              <input
                type="text"
                value={profile.ownerName}
                onChange={(e) =>
                  setProfile({ ...profile, ownerName: e.target.value })
                }
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                {t("settings.email")}
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                {t("settings.phone")}
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-stone-700 mb-1.5 block">
              {t("settings.address")}
            </label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-stone-700 mb-1.5 block">
              {t("settings.description")}
            </label>
            <textarea
              value={profile.description}
              onChange={(e) =>
                setProfile({ ...profile, description: e.target.value })
              }
              rows={3}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100 resize-none"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-moss-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-moss-700"
            >
              {t("settings.saveChanges")}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-stone-100 rounded-3xl p-6 mb-6">
        <h2 className="font-display text-lg font-semibold mb-5">
          {t("settings.hoursSection")}
        </h2>
        <div className="flex flex-col gap-3">
          {days.map((day) => (
            <div key={day} className="flex items-center gap-4">
              <div className="w-28">
                <span className="text-sm font-medium text-stone-700">
                  {t(`settings.days.${day}`)}
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
                <div className="w-9 h-5 bg-stone-200 peer-checked:bg-moss-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
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
                    className="border border-stone-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-moss-500"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  <span className="text-stone-400 text-sm">—</span>
                  <select
                    value={hours[day].close}
                    onChange={(e) =>
                      setHours({
                        ...hours,
                        [day]: { ...hours[day], close: e.target.value },
                      })
                    }
                    className="border border-stone-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-moss-500"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <span className="text-sm text-stone-400">{t("settings.closed")}</span>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-5">
          <button className="bg-moss-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-moss-700">
            {t("settings.saveHours")}
          </button>
        </div>
      </div>

      <div className="bg-white border border-stone-100 rounded-3xl p-6">
        <h2 className="font-display text-lg font-semibold mb-5">
          {t("settings.notificationsSection")}
        </h2>
        <div className="flex flex-col gap-4">
          {notificationItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-3 border-b border-stone-50 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-stone-700">
                  {item.label}
                </p>
                <p className="text-xs text-stone-400 mt-0.5">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      [item.key]: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-200 peer-checked:bg-moss-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-5">
          <button className="bg-moss-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-moss-700">
            {t("settings.saveNotifications")}
          </button>
        </div>
      </div>
    </div>
  );
}
