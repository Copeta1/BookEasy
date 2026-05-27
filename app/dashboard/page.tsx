import {
  CalendarDaysIcon,
  BanknotesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const stats = [
  {
    label: "Weekly Bookings",
    value: "124",
    change: "+12%",
    sub: "+14 vs last week",
    icon: CalendarDaysIcon,
    positive: true,
  },
  {
    label: "Gross Revenue",
    value: "2,450€",
    change: "+8.4%",
    sub: "Target: 3,000€",
    icon: BanknotesIcon,
    positive: true,
  },
  {
    label: "Loyal Clients",
    value: "86",
    sub: "5 new this week",
    icon: UserGroupIcon,
    badge: "Active",
    positive: true,
  },
];

const appointments = [
  {
    name: "Alex Morgan",
    type: "Returning Client",
    service: "Balayage & Styling",
    duration: "90 min • Expert Stylist",
    time: "09:30 AM",
  },
  {
    name: "Jane Doe",
    type: "VIP Member",
    service: "Shellac Manicure",
    duration: "45 min • Nail Art",
    time: "11:00 AM",
  },
  {
    name: "Robert King",
    type: "First Visit",
    service: "Beard Trim & Hot Towel",
    duration: "30 min • Classic Service",
    time: "01:15 PM",
  },
];

const activities = [
  {
    title: "Payment received",
    desc: "€45.00 from Alex Morgan",
    time: "2h ago",
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Appointment Rescheduled",
    desc: "Lisa Wong moved to 03:45 PM",
    time: "5h ago",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    title: "New Client Registered",
    desc: "Robert King joined BookEasy",
    time: "Yesterday",
    color: "bg-orange-100 text-orange-600",
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">
            Good morning, Robert
          </h1>
          <p className="text-gray-500 text-sm">
            You have{" "}
            <span className="text-indigo-600 font-semibold">
              8 appointments
            </span>{" "}
            scheduled for today.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
            S
          </div>
          <div>
            <p className="text-sm font-medium">Robert&apos;s Studio</p>
            <p className="text-xs text-gray-400">Owner</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-100 rounded-2xl p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-indigo-600" />
              </div>
              {stat.change && (
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              )}
              {stat.badge && (
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              {stat.label}
            </p>
            <p className="font-display text-3xl font-bold mb-1">{stat.value}</p>
            <p className="text-xs text-gray-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Appointments + Activity */}
      <div className="grid grid-cols-3 gap-4">
        {/* Today's Appointments */}
        <div className="col-span-2 bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display text-lg font-semibold">
              Today&apos;s Appointments
            </h2>
            <button className="text-indigo-600 text-sm font-medium hover:underline">
              Full Calendar →
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-5">Tuesday, October 24th</p>

          <div className="flex flex-col gap-4">
            {appointments.map((apt) => (
              <div
                key={apt.name}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                    {apt.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{apt.name}</p>
                    <p className="text-xs text-gray-400">{apt.type}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{apt.service}</p>
                  <p className="text-xs text-gray-400">{apt.duration}</p>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="w-4 h-4 text-indigo-400" />
                  <p className="text-sm font-semibold">{apt.time}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 text-sm text-indigo-600 font-medium hover:underline">
            View 5 More Appointments ↓
          </button>
        </div>

        {/* Activity Feed */}
        <div className="flex flex-col gap-4">
          {/* Promo kartica */}
          <div className="bg-indigo-600 rounded-2xl p-5 text-white">
            <span className="text-xs font-semibold bg-indigo-500 px-2 py-1 rounded-full mb-3 inline-block">
              PROMOTION
            </span>
            <h3 className="font-display text-lg font-bold mb-2">
              Scale Your Studio
            </h3>
            <p className="text-indigo-200 text-sm mb-4">
              Add up to 5 team members to your portal for free this month.
            </p>
            <button className="bg-white text-indigo-600 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-indigo-50">
              Invite Team Now
            </button>
          </div>

          {/* Activity */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-semibold">
                Studio Activity
              </h3>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                LIVE
              </span>
            </div>
            <div className="flex flex-col gap-4">
              {activities.map((activity) => (
                <div key={activity.title} className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${activity.color}`}
                  >
                    <CalendarDaysIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-400">{activity.desc}</p>
                    <p className="text-xs text-gray-300 mt-0.5">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 border border-gray-100 rounded-xl py-2 text-sm text-gray-500 hover:bg-gray-50">
              View History Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
