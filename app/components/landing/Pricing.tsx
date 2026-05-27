import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

const plans = [
  {
    name: "Starter",
    price: "15",
    description:
      "Perfect for freelancers and solo practitioners just starting out.",
    features: [
      { text: "Up to 50 bookings/mo", included: true },
      { text: "Basic scheduling", included: true },
      { text: "Client management", included: true },
      { text: "Analytics", included: false },
      { text: "Team collaboration", included: false },
    ],
    featured: false,
    buttonText: "Choose Starter",
  },
  {
    name: "Professional",
    price: "35",
    description: "For businesses that need advanced tools to scale and grow.",
    features: [
      { text: "Unlimited bookings", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Team collaboration", included: true },
      { text: "Priority support", included: true },
      { text: "Stripe payments", included: true },
    ],
    featured: true,
    buttonText: "Go Pro",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        {/* Naslov */}
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
            Choose the plan that fits your current business stage. No hidden
            fees, cancel anytime.
          </p>
        </div>

        {/* Pricing kartice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl p-8 ${
                plan.featured
                  ? "border-2 border-indigo-600"
                  : "border border-gray-100"
              }`}
            >
              {/* Most Popular badge */}
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <p
                className={`text-sm font-semibold mb-2 ${plan.featured ? "text-indigo-600" : "text-gray-500"}`}
              >
                {plan.name}
              </p>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-display text-5xl font-bold">
                  {plan.price}€
                </span>
                <span className="text-gray-400 text-sm">/mo</span>
              </div>

              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature.text}
                    className={`flex items-center gap-2 text-sm ${
                      feature.included
                        ? "text-gray-700"
                        : "text-gray-300 line-through"
                    }`}
                  >
                    {feature.included ? (
                      <CheckCircleIcon className="w-5 h-5 text-indigo-600 shrink-0" />
                    ) : (
                      <XCircleIcon className="w-5 h-5 text-gray-300 shrink-0" />
                    )}
                    {feature.text}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl text-sm font-medium transition-colors ${
                  plan.featured
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
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
