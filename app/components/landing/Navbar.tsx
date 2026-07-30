"use client";
import Link from "next/link";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "@/store/authStore";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { t } = useTranslation();

  const navLinks = [
    { label: t("nav.features"), href: "#features" },
    { label: t("nav.pricing"), href: "#pricing" },
    { label: t("nav.about"), href: "#about" },
  ];

  return (
    <nav className="sticky top-0 bg-white z-10 border-b border-stone-100">
      <div className="flex items-center justify-between px-6 md:px-16 py-4">
        <span className="font-display text-xl font-bold text-moss-700">
          BookEasy
        </span>

        {/* Desktop linkovi */}
        <ul className="hidden md:flex gap-8 list-none">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-stone-500 text-sm font-medium hover:text-stone-900"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop gumbi */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          {user ? (
            <Link
              href="/dashboard"
              className="text-sm font-medium px-5 py-2 rounded-full bg-moss-600 text-white hover:bg-moss-700"
            >
              {t("nav.goToDashboard")}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium px-4 py-2 rounded-full hover:bg-stone-100"
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium px-5 py-2 rounded-full bg-moss-600 text-white hover:bg-moss-700"
              >
                {t("nav.getStarted")}
              </Link>
            </>
          )}
        </div>
        {/* Hamburger gumb */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-stone-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6 text-stone-700" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-stone-700" />
          )}
        </button>
      </div>

      {/* Mobilni meni */}
      {isOpen && (
        <div className="md:hidden border-t border-stone-100 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-stone-600 text-sm font-medium hover:text-stone-900"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-stone-100">
            <LanguageSwitcher />
          </div>
          <div className="flex flex-col gap-2">
            {user ? (
              <Link
                href="/dashboard"
                className="text-sm font-medium px-4 py-2.5 rounded-full bg-moss-600 text-white hover:bg-moss-700 text-center"
              >
                {t("nav.goToDashboard")}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium px-4 py-2 rounded-full hover:bg-stone-100"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/login"
                  className="text-sm font-medium px-5 py-2 rounded-full bg-moss-600 text-white hover:bg-moss-700"
                >
                  {t("nav.getStarted")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
