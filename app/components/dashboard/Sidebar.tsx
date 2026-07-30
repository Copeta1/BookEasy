"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Squares2X2Icon,
  CalendarDaysIcon,
  WrenchScrewdriverIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import CommandPalette from "./CommandPalette";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { t } = useTranslation();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navGroups = [
    {
      label: t("sidebar.groupMain"),
      items: [
        { label: t("sidebar.navOverview"), href: "/dashboard", icon: Squares2X2Icon },
        { label: t("sidebar.navCalendar"), href: "/dashboard/calendar", icon: CalendarDaysIcon },
      ],
    },
    {
      label: t("sidebar.groupBusiness"),
      items: [
        { label: t("sidebar.navClients"), href: "/dashboard/clients", icon: UsersIcon },
        {
          label: t("sidebar.navServices"),
          href: "/dashboard/services",
          icon: WrenchScrewdriverIcon,
        },
        { label: t("sidebar.navAnalytics"), href: "/dashboard/analytics", icon: ChartBarIcon },
      ],
    },
  ];

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-stone-100 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5">
        <span className="font-display text-xl font-bold text-moss-700">
          BookEasy
        </span>
        <p className="text-xs text-stone-400 mt-0.5">{t("sidebar.tagline")}</p>
      </div>

      <CommandPalette />

      {/* Nav grupe */}
      <nav className="flex-1 px-3 flex flex-col gap-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-400 px-3 pb-1.5">
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium border-l-4 transition-colors ${
                      isActive
                        ? "bg-moss-50 text-moss-700 font-semibold border-moss-600"
                        : "text-stone-500 border-transparent hover:bg-stone-100 hover:text-stone-900"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Iskorištenost plana */}
      <div className="mx-3 mb-3 p-3.5 bg-moss-50 rounded-xl">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xs font-semibold text-moss-700">
            {t("sidebar.planName")}
          </span>
          <span className="text-xs font-semibold text-moss-600">32/50</span>
        </div>
        <div className="h-1.5 bg-moss-100 rounded-full overflow-hidden mb-2.5">
          <div className="h-full bg-moss-600 rounded-full" style={{ width: "64%" }} />
        </div>
        <a href="#" className="text-xs font-semibold text-moss-700 hover:underline">
          {t("sidebar.upgrade")}
        </a>
      </div>

      {/* Jezik */}
      <div className="px-3 pb-2">
        <LanguageSwitcher className="w-full justify-center" />
      </div>

      {/* Account meni */}
      <div className="relative px-3 pb-3 pt-2 border-t border-stone-100" ref={menuRef}>
        {menuOpen && (
          <div className="absolute left-3 right-3 bottom-full mb-2 bg-white border border-stone-100 rounded-xl shadow-lg p-1.5 z-20">
            <Link
              href="/dashboard/settings"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-stone-700 hover:bg-stone-100"
            >
              <Cog6ToothIcon className="w-4 h-4 text-stone-400" />
              {t("sidebar.accountSettings")}
            </Link>
            <div className="h-px bg-stone-100 my-1.5 mx-1" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              {t("sidebar.signOut")}
            </button>
          </div>
        )}

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`w-full flex items-center gap-2.5 p-2 rounded-xl ${menuOpen ? "bg-stone-100" : "hover:bg-stone-100"}`}
        >
          <div className="w-8 h-8 rounded-lg bg-gold-100 flex items-center justify-center text-gold-700 font-bold text-sm shrink-0">
            {user?.firstName?.[0]}
          </div>
          <div className="min-w-0 text-left">
            <p className="text-sm font-semibold truncate">{user?.businessName}</p>
            <p className="text-xs text-stone-400">{t("sidebar.owner")}</p>
          </div>
          <ChevronDownIcon
            className={`w-4 h-4 text-stone-400 ml-auto shrink-0 transition-transform ${menuOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>
    </aside>
  );
}
