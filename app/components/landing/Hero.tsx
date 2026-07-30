export default function Hero() {
  return (
    <section className="bg-stone-50 py-20 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6 md:px-16 max-w-7xl mx-auto">
        {/* Lijeva strana - tekst */}
        <div className="text-center md:text-left">
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-5">
            Booking made simple{" "}
            <span className="font-serif italic font-normal text-moss-700">
              for your business
            </span>
          </h1>

          <p className="text-stone-500 text-base md:text-lg leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
            The all-in-one platform for small businesses to automate scheduling,
            manage client relationships, and get paid faster.
          </p>

          <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
            <button className="bg-moss-600 text-white px-7 py-3.5 rounded-full text-sm font-medium hover:bg-moss-700">
              Get Started for Free
            </button>
            <button className="flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium border border-stone-200 bg-white hover:bg-stone-100">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Desna strana - kalendar vizual */}
        <div className="relative h-75 md:h-105">
          {/* Blob pozadina */}
          <div className="absolute inset-[8%_4%] rounded-[38%_62%_60%_40%/45%_40%_60%_55%] bg-gradient-to-br from-moss-100 via-stone-100 to-transparent" />

          {/* Kalendar kartica */}
          <div className="absolute top-[10%] left-[6%] w-[64%] bg-white rounded-3xl p-5 shadow-lg shadow-stone-900/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-3">
              July 2026
            </p>
            <div className="grid grid-cols-7 gap-1">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span
                  key={`d-${i}`}
                  className="aspect-square flex items-center justify-center text-[11px] text-stone-400"
                >
                  {d}
                </span>
              ))}
              {[27, 28, 29, 30, 31, 1, 2].map((day, i) => (
                <span
                  key={`n-${i}`}
                  className={`aspect-square flex items-center justify-center text-xs rounded-full ${
                    day === 29
                      ? "bg-moss-600 text-white font-bold"
                      : "text-stone-500"
                  }`}
                >
                  {day}
                </span>
              ))}
            </div>
          </div>

          {/* Notifikacija */}
          <div className="absolute bottom-[6%] right-[2%] bg-stone-900 text-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg shadow-stone-900/20">
            <div className="w-8 h-8 rounded-full bg-moss-500 flex items-center justify-center text-xs font-bold shrink-0">
              M
            </div>
            <div>
              <p className="text-xs font-semibold">New Appointment</p>
              <p className="text-xs text-stone-300">Today at 2:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
