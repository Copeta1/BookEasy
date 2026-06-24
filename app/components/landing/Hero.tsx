import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-gray-50 py-20 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6 md:px-16 max-w-7xl mx-auto">
        {/* Lijeva strana - tekst */}
        <div className="text-center md:text-left">
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-5">
            Booking made simple{" "}
            <span className="text-indigo-600">for your business</span>
          </h1>

          <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
            The all-in-one platform for small businesses to automate scheduling,
            manage client relationships, and get paid faster.
          </p>

          <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
            <button className="bg-indigo-600 text-white px-7 py-3.5 rounded-xl text-sm font-medium hover:bg-indigo-700">
              Get Started for Free
            </button>
            <button className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium border border-gray-200 bg-white hover:bg-gray-100">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Desna strana - slika */}
        <div className="relative h-75 md:h-105">
          <div className="relative rounded-2xl overflow-hidden h-full border-4 border-white shadow-md">
            <Image
              src="/hero.jpg"
              alt="Business owner"
              fill
              loading="eager"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-2xl"
            />
          </div>

          {/* Notifikacija */}
          <div className="absolute bottom-4 left-4 bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <div>
              <p className="text-xs font-medium">New Appointment</p>
              <p className="text-xs text-gray-400">Today at 2:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
