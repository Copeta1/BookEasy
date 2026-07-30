"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  Squares2X2Icon,
  CalendarDaysIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

type Item = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const actions: Item[] = [
  { label: "New appointment", href: "/dashboard/calendar", icon: PlusIcon },
  { label: "Add client", href: "/dashboard/clients", icon: PlusIcon },
  { label: "Add service", href: "/dashboard/services", icon: PlusIcon },
];

const pages: Item[] = [
  { label: "Overview", href: "/dashboard", icon: Squares2X2Icon },
  { label: "Calendar", href: "/dashboard/calendar", icon: CalendarDaysIcon },
  { label: "Clients", href: "/dashboard/clients", icon: UsersIcon },
  { label: "Services", href: "/dashboard/services", icon: WrenchScrewdriverIcon },
  { label: "Analytics", href: "/dashboard/analytics", icon: ChartBarIcon },
  { label: "Settings", href: "/dashboard/settings", icon: Cog6ToothIcon },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => {
          const next = !prev;
          if (next) setQuery("");
          return next;
        });
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  const matches = (item: Item) =>
    item.label.toLowerCase().includes(query.toLowerCase());

  const filteredActions = actions.filter(matches);
  const filteredPages = pages.filter(matches);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <button
        onClick={() => {
          setQuery("");
          setOpen(true);
        }}
        className="flex items-center gap-2 mx-3 mb-3 px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 text-sm hover:bg-stone-100 w-[calc(100%-1.5rem)]"
      >
        <MagnifyingGlassIcon className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-left">Search or jump to...</span>
        <span className="text-xs border border-stone-200 bg-white rounded px-1.5 py-0.5 text-stone-400 font-mono">
          ⌘K
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-start justify-center pt-[12vh] z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-100">
              <MagnifyingGlassIcon className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 outline-none text-sm"
              />
              <span className="text-xs border border-stone-200 rounded px-1.5 py-0.5 text-stone-400 font-mono">
                ESC
              </span>
            </div>

            <div className="p-2 max-h-80 overflow-y-auto">
              {filteredActions.length > 0 && (
                <>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-400 px-2 pt-2 pb-1">
                    Actions
                  </p>
                  {filteredActions.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => go(item.href)}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-stone-700 hover:bg-moss-50 hover:text-moss-700"
                    >
                      <item.icon className="w-4 h-4 text-stone-400" />
                      {item.label}
                    </button>
                  ))}
                </>
              )}

              {filteredPages.length > 0 && (
                <>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-400 px-2 pt-2 pb-1">
                    Go to
                  </p>
                  {filteredPages.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => go(item.href)}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-stone-700 hover:bg-moss-50 hover:text-moss-700"
                    >
                      <item.icon className="w-4 h-4 text-stone-400" />
                      {item.label}
                    </button>
                  ))}
                </>
              )}

              {filteredActions.length === 0 && filteredPages.length === 0 && (
                <p className="text-sm text-stone-400 px-2 py-4 text-center">
                  No results for &quot;{query}&quot;
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
