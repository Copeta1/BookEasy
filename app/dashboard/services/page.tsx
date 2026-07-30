"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { apifetch } from "@/lib/api";

type Service = {
  id: number;
  name: string;
  duration: number;
  price: number;
  category: string;
  isActive: boolean;
};

export default function ServicesPage() {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState({
    name: "",
    duration: "",
    price: "",
    category: "",
  });

  const fetchServices = async () => {
    try {
      const data = await apifetch<Service[]>("/api/Services");
      setServices(data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

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

  const handleDelete = async (id: number) => {
    try {
      await apifetch(`/api/Services/${id}`, { method: "DELETE" });
      setServices(services.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.duration || !form.category) return;
    try {
      if (editingService) {
        const updated = await apifetch<Service>(
          `/api/Services/${editingService.id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              name: form.name,
              duration: Number(form.duration),
              price: Number(form.price),
              category: form.category,
              isActive: true,
            }),
          },
        );
        setServices(
          services.map((s) => (s.id === editingService.id ? updated : s)),
        );
      } else {
        const created = await apifetch<Service>("/api/Services", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            duration: Number(form.duration),
            price: Number(form.price),
            category: form.category,
          }),
        });
        setServices([...services, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">{t("services.title")}</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-moss-600 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-moss-700"
        >
          <PlusIcon className="w-4 h-4" />
          {t("services.addService")}
        </button>
      </div>

      {/* Tablica */}
      <div className="bg-white border border-stone-100 rounded-3xl overflow-hidden">
        {loading ? (
          <p className="text-stone-400 text-sm p-6">{t("overview.loading")}</p>
        ) : services.length === 0 ? (
          <p className="text-stone-400 text-sm p-6">{t("services.noServicesYet")}</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wide">
                  {t("services.colService")}
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wide">
                  {t("services.colCategory")}
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wide">
                  {t("services.colDuration")}
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wide">
                  {t("services.colPrice")}
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wide">
                  {t("services.colActions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="border-b border-stone-50 last:border-0 hover:bg-stone-50"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-stone-900">
                      {service.name}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium bg-moss-50 text-moss-600 px-2.5 py-1 rounded-full">
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-500">
                    {service.duration} {t("services.minutesShort")}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-stone-900">
                    {service.price === 0 ? t("services.free") : `${service.price}€`}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(service)}
                        className="p-2 rounded-full hover:bg-moss-50 text-stone-400 hover:text-moss-600"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-2 rounded-full hover:bg-red-50 text-stone-400 hover:text-red-500"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl">
            <h2 className="font-display text-xl font-bold mb-6">
              {editingService ? t("services.modalEdit") : t("services.modalAdd")}
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                  {t("services.nameLabel")}
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t("services.namePlaceholder") ?? ""}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                  {t("services.categoryLabel")}
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  placeholder={t("services.categoryPlaceholder") ?? ""}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                    {t("services.durationLabel")}
                  </label>
                  <input
                    type="number"
                    value={form.duration}
                    onChange={(e) =>
                      setForm({ ...form, duration: e.target.value })
                    }
                    placeholder={t("services.durationPlaceholder") ?? ""}
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                    {t("services.priceLabel")}
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    placeholder="0"
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 border border-stone-200 text-stone-600 py-3 rounded-full text-sm font-medium hover:bg-stone-50"
              >
                {t("services.cancel")}
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-moss-600 text-white py-3 rounded-full text-sm font-medium hover:bg-moss-700"
              >
                {editingService ? t("services.saveChanges") : t("services.addService")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
