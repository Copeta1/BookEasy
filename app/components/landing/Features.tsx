import {
  CalendarDaysIcon,
  UsersIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: CalendarDaysIcon,
    title: "Automated Scheduling",
    description:
      "Let clients book, reschedule, or cancel on their own 24/7. Sync with your favorite calendar apps instantly.",
  },
  {
    icon: UsersIcon,
    title: "Client Management",
    description:
      "Store all client notes, booking history, and preferences in one secure place. Build lasting relationships.",
  },
  {
    icon: CreditCardIcon,
    title: "Secure Payments",
    description:
      "Take deposits or full payments at the time of booking. Integrated with Stripe for peace of mind.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        {/* Naslov */}
        <div className="text-center mb-14">
          <p className="text-indigo-600 text-xs font-semibold uppercase tracking-widest mb-3">
            Why BookEasy
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Built for growing teams
          </h2>
          <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
            Everything you need to run your service business in one clean
            dashboard.
          </p>
        </div>

        {/* Feature kartice */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white border border-gray-100 rounded-2xl p-7"
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center mb-5">
                <feature.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
