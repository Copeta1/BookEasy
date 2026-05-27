"use client";
import Link from "next/link";

import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 bg-white z-10 border-b border-gray-100">
      <div className="flex items-center justify-between px-6 md:px-16 py-4">
        <span className="font-display text-xl font-bold text-indigo-600">
          BookEasy
        </span>

        {/* Desktop linkovi */}
        <ul className="hidden md:flex gap-8 list-none">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-gray-500 text-sm font-medium hover:text-gray-900"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop gumbi */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Login
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Get Started
          </Link>
        </div>
        {/* Hamburger gumb */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6 text-gray-700" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobilni meni */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-gray-600 text-sm font-medium hover:text-gray-900"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
