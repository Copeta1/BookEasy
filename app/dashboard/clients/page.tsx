"use client";

import { useState, useEffect } from "react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { apifetch } from "@/lib/api";

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

const typeBadge: Record<Client["type"], string> = {
  "VIP Member": "bg-gold-100 text-gold-700",
  "Returning Client": "bg-moss-100 text-moss-700",
  "First Visit": "bg-stone-200 text-stone-700",
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    type: "First Visit" as Client["type"],
  });

  const fetchClients = async () => {
    try {
      const data = await apifetch<Client[]>("/api/Clients");
      setClients(data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filtered = clients.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.email}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const handleSave = async () => {
    if (!form.firstName || !form.lastName || !form.email) return;
    try {
      const created = await apifetch<Client>("/api/Clients", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setClients([...clients, created]);
      setIsModalOpen(false);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        type: "First Visit",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Clients</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-moss-600 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-moss-700"
        >
          <PlusIcon className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <MagnifyingGlassIcon className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-stone-200 rounded-full pl-10 pr-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
        />
      </div>

      {/* Lista klijenata */}
      {loading ? (
        <p className="text-stone-400 text-sm p-6">Loading...</p>
      ) : clients.length === 0 ? (
        <div className="bg-white border border-stone-100 rounded-3xl p-6">
          <p className="text-stone-400 text-sm">
            No clients yet. Add your first client!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((client) => (
            <div
              key={client.id}
              className="flex items-center gap-4 bg-white border border-stone-100 rounded-2xl px-5 py-3.5 hover:border-moss-200 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-moss-100 flex items-center justify-center text-moss-700 font-bold shrink-0">
                {client.firstName[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                  {client.firstName} {client.lastName}
                </p>
                <p className="text-xs text-stone-400 truncate">{client.email}</p>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${typeBadge[client.type]}`}
              >
                {client.type}
              </span>
              <div className="ml-auto flex items-center gap-6 text-right shrink-0">
                <div className="hidden sm:block">
                  <p className="text-sm font-bold tabular-nums">{client.totalBookings}</p>
                  <p className="text-[11px] uppercase tracking-wide text-stone-400">Bookings</p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-bold tabular-nums">{client.totalSpent}€</p>
                  <p className="text-[11px] uppercase tracking-wide text-stone-400">Spent</p>
                </div>
                <div>
                  <p className="text-sm text-stone-600">{client.phone || "—"}</p>
                  <p className="text-[11px] uppercase tracking-wide text-stone-400">
                    {client.lastVisit || "No visits yet"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl">
            <h2 className="font-display text-xl font-bold mb-6">Add Client</h2>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
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
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
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
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+385 91 123 4567"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                  Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as Client["type"] })
                  }
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
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
                className="flex-1 border border-stone-200 text-stone-600 py-3 rounded-full text-sm font-medium hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-moss-600 text-white py-3 rounded-full text-sm font-medium hover:bg-moss-700"
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
