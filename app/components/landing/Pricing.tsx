"use client";

import { useTranslation } from "react-i18next";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export default function Pricing() {
  const { t } = useTranslation();
  const starterFeatures = t("pricing.starter.features", {
    returnObjects: true,
  }) as string[];
  const professionalFeatures = t("pricing.professional.features", {
    returnObjects: true,
  }) as string[];

  const plans = [
    {
      name: t("pricing.starter.name"),
      price: "15",
      description: t("pricing.starter.description"),
      features: starterFeatures.map((text, i) => ({
        text,
        included: i < 3,
      })),
      featured: false,
      buttonText: t("pricing.starter.button"),
    },
    {
      name: t("pricing.professional.name"),
      price: "35",
      description: t("pricing.professional.description"),
      features: professionalFeatures.map((text) => ({
        text,
        included: true,
      })),
      featured: true,
      buttonText: t("pricing.professional.button"),
    },
  ];

  return (
    <section id="pricing" className="py-20 w-full bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        {/* Naslov */}
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            {t("pricing.title")}
          </h2>
          <p className="text-stone-500 text-base max-w-md mx-auto leading-relaxed">
            {t("pricing.subtitle")}
          </p>
        </div>

        {/* Pricing kartice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-3xl p-8 ${
                plan.featured
                  ? "border-2 border-moss-600"
                  : "border border-stone-100"
              }`}
            >
              {/* Most Popular badge */}
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-moss-600 text-white text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
                  {t("pricing.mostPopular")}
                </div>
              )}

              <p
                className={`text-sm font-semibold mb-2 ${plan.featured ? "text-moss-600" : "text-stone-500"}`}
              >
                {plan.name}
              </p>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-display text-5xl font-bold">
                  {plan.price}€
                </span>
                <span className="text-stone-400 text-sm">
                  {t("pricing.perMonth")}
                </span>
              </div>

              <p className="text-stone-500 text-sm leading-relaxed mb-6">
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature.text}
                    className={`flex items-center gap-2 text-sm ${
                      feature.included
                        ? "text-stone-700"
                        : "text-stone-300 line-through"
                    }`}
                  >
                    {feature.included ? (
                      <CheckCircleIcon className="w-5 h-5 text-moss-600 shrink-0" />
                    ) : (
                      <XCircleIcon className="w-5 h-5 text-stone-300 shrink-0" />
                    )}
                    {feature.text}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-full text-sm font-medium transition-colors ${
                  plan.featured
                    ? "bg-moss-600 text-white hover:bg-moss-700"
                    : "border border-moss-600 text-moss-600 hover:bg-moss-50"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
