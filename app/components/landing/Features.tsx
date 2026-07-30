"use client";

import { useTranslation } from "react-i18next";
import {
  CalendarDaysIcon,
  UsersIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

const icons = [CalendarDaysIcon, UsersIcon, CreditCardIcon];
const tiles = ["bg-moss-50 text-moss-600", "bg-gold-50 text-gold-600", "bg-stone-100 text-stone-600"];

type FeatureItem = { title: string; description: string };

export default function Features() {
  const { t } = useTranslation();
  const items = t("features.items", { returnObjects: true }) as FeatureItem[];

  return (
    <section id="features" className="py-20 w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        {/* Naslov */}
        <div className="text-center mb-14">
          <p className="text-moss-600 text-xs font-semibold uppercase tracking-widest mb-3">
            {t("features.eyebrow")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            {t("features.title")}
          </h2>
          <p className="text-stone-500 text-base max-w-md mx-auto leading-relaxed">
            {t("features.subtitle")}
          </p>
        </div>

        {/* Feature kartice */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((feature, i) => {
            const Icon = icons[i];
            return (
              <div
                key={feature.title}
                className="bg-white border border-stone-100 rounded-3xl p-7"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${tiles[i]}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
