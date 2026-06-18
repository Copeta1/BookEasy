"use client";

import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const initialServices = [
  {
    id: 1,
    name: "Balayage & Styling",
    duration: 90,
    price: 85,
    category: "Hair",
  },
  {
    id: 2,
    name: "Style & Blow Dry",
    duration: 45,
    price: 45,
    category: "Hair",
  },
  {
    id: 3,
    name: "Hair Consultation",
    duration: 15,
    price: 0,
    category: "Hair",
  },
  {
    id: 4,
    name: "Balayage Treatment",
    duration: 120,
    price: 120,
    category: "Hair",
  },
  {
    id: 5,
    name: "Shellac Manicure",
    duration: 45,
    price: 35,
    category: "Nails",
  },
  {
    id: 6,
    name: "Beard Trim & Hot Towel",
    duration: 30,
    price: 25,
    category: "Grooming",
  },
];
type Service = {
  id: number;
  name: string;
  duration: number;
  price: number;
  category: string;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState({
    name: "",
    duration: "",
    price: "",
    category: "",
  });

  const openAdd = () => {
    setEditingService(null);
    setForm({ name: "", duration: "", price: "", category: "" });
    setIsModalOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditingService(service);
    setForm({
      name: service.name,
      duration: String(service.duration),
      price: String(service.price),
      category: service.category,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    if (!form.name || !form.duration || !form.price || !form.category) return;
    if (editingService) {
      setServices(
        services.map((s) =>
          s.id === editingService.id
            ? {
                ...s,
                name: form.name,
                duration: Number(form.duration),
                price: Number(form.price),
                category: form.category,
              }
            : s,
        ),
      );
    } else {
      setServices([
        ...services,
        {
          id: Date.now(),
          name: form.name,
          duration: Number(form.duration),
          price: Number(form.price),
          category: form.category,
        },
      ]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Services</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700"
        >
          <PlusIcon className="w-4 h-4" />
          Add Service
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Service
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Category
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Duration
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Price
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr
                key={service.id}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-600">
                    {service.name}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full">
                    {service.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {service.duration}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {service.price === 0 ? "Free" : `${service.price}€`}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(service)}
                      className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
            <h2 className="font-display text-xl font-bold mb-6">
              {editingService ? "Edit Service" : "Add Service"}
            </h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Service Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Balayage & Styling"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Category
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  placeholder="e.g. Hair, Nails, Grooming"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    value={form.duration}
                    onChange={(e) =>
                      setForm({ ...form, duration: e.target.value })
                    }
                    placeholder="45"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Price (€)
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
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
                {editingService ? "Save Changes" : "Add Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
