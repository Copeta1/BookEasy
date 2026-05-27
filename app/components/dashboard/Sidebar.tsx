"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Squares2X2Icon,
  CalendarDaysIcon,
  WrenchScrewdriverIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: Squares2X2Icon },
  { label: "Calendar", href: "/dashboard/calendar", icon: CalendarDaysIcon },
  {
    label: "Services",
    href: "/dashboard/services",
    icon: WrenchScrewdriverIcon,
  },
  { label: "Clients", href: "/dashboard/clients", icon: UsersIcon },
  { label: "Analytics", href: "/dashboard/analytics", icon: ChartBarIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <span className="font-display text-xl font-bold text-indigo-600">
          BookEasy
        </span>
        <p className="text-xs text-gray-400 mt-0.5">Salon Management</p>
      </div>

      {/* Nav linkovi */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Donji dio */}
      <div className="px-3 py-4 border-t border-gray-100 flex flex-col gap-1">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        >
          <Cog6ToothIcon className="w-5 h-5" />
          Settings
        </Link>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 w-full">
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
