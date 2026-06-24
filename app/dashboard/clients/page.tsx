"use client";

import { useState } from "react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type Client = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: "VIP Member" | "Returning Client" | "First Visit";
  totalBookings: number;
  totalSpent: number;
  lastVisit: string;
};

const initialClients: Client[] = [
  {
    id: 1,
    firstName: "Alex",
    lastName: "Morgan",
    email: "alex@example.com",
    phone: "+385 91 123 4567",
    type: "Returning Client",
    totalBookings: 12,
    totalSpent: 540,
    lastVisit: "Oct 24, 2024",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    phone: "+385 92 234 5678",
    type: "VIP Member",
    totalBookings: 28,
    totalSpent: 1260,
    lastVisit: "Oct 24, 2024",
  },
  {
    id: 3,
    firstName: "Robert",
    lastName: "King",
    email: "robert@example.com",
    phone: "+385 95 345 6789",
    type: "First Visit",
    totalBookings: 1,
    totalSpent: 25,
    lastVisit: "Oct 24, 2024",
  },
  {
    id: 4,
    firstName: "Lisa",
    lastName: "Wong",
    email: "lisa@example.com",
    phone: "+385 98 456 7890",
    type: "Returning Client",
    totalBookings: 7,
    totalSpent: 315,
    lastVisit: "Oct 20, 2024",
  },
  {
    id: 5,
    firstName: "Mark",
    lastName: "Taylor",
    email: "mark@example.com",
    phone: "+385 91 567 8901",
    type: "VIP Member",
    totalBookings: 34,
    totalSpent: 1530,
    lastVisit: "Oct 18, 2024",
  },
];

const typeBadge: Record<Client["type"], string> = {
  "VIP Member": "bg-purple-100 text-purple-700",
  "Returning Client": "bg-indigo-100 text-indigo-700",
  "First Visit": "bg-green-100 text-green-700",
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    type: "First Visit" as Client["type"],
  });

  const filtered = clients.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.email}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const handleSave = () => {
    if (!form.firstName || !form.lastName || !form.email) return;
    setClients([
      ...clients,
      {
        id: Date.now(),
        ...form,
        totalBookings: 0,
        totalSpent: 0,
        lastVisit: "—",
      },
    ]);
    setIsModalOpen(false);
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      type: "First Visit",
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Clients</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700"
        >
          <PlusIcon className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* Tablica */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Client
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Type
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Bookings
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Total Spent
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Last Visit
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((client) => (
              <tr
                key={client.id}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                      {client.firstName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {client.firstName} {client.lastName}
                      </p>
                      <p className="text-xs text-gray-400">{client.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeBadge[client.type]}`}
                  >
                    {client.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {client.totalBookings}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {client.totalSpent}€
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {client.lastVisit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
            <h2 className="font-display text-xl font-bold mb-6">Add Client</h2>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    placeholder="John"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    placeholder="Doe"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Phone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+385 91 123 4567"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as Client["type"] })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option>First Visit</option>
                  <option>Returning Client</option>
                  <option>VIP Member</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-indigo-700"
              >
                Add Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
