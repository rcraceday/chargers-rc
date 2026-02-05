import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-white">

      {/* HERO */}
      <section className="bg-neutral-900 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight">
          <span className="text-red-600">Chargers</span> RC Club
        </h1>

        <p className="mt-3 text-lg text-gray-300 tracking-wide">
          Racing • Community • Family
        </p>

        <div className="mt-8 h-1 w-32 bg-red-600 mx-auto transform -skew-x-12"></div>
      </section>

      {/* WELCOME */}
      <section className="max-w-6xl mx-auto px-6 py-10 text-center">
        <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
        <p className="text-gray-400">
          Manage your Driver Profile, Events, and Nominations
        </p>
      </section>

      {/* QUICK ACTIONS */}
      <section className="max-w-6xl mx-auto px-6 pb-16 grid sm:grid-cols-3 gap-8">

        {/* PROFILE */}
        <Link
          to="/profile"
          className="bg-neutral-800 border border-neutral-700 hover:border-red-600 hover:shadow-red-600/40 hover:shadow-xl transition rounded-lg p-6 block"
        >
          <h3 className="text-xl font-bold mb-2">My Profile</h3>
          <p className="text-gray-400">View and update your details</p>
        </Link>

        {/* EVENTS */}
        <Link
          to="/events"
          className="bg-neutral-800 border border-neutral-700 hover:border-red-600 hover:shadow-red-600/40 hover:shadow-xl transition rounded-lg p-6 block"
        >
          <h3 className="text-xl font-bold mb-2">Events</h3>
          <p className="text-gray-400">Upcoming race days</p>
        </Link>

        {/* NOMINATIONS */}
        <Link
          to="/nominations"
          className="bg-neutral-800 border border-neutral-700 hover:border-red-600 hover:shadow-red-600/40 hover:shadow-xl transition rounded-lg p-6 block"
        >
          <h3 className="text-xl font-bold mb-2">Nominations</h3>
          <p className="text-gray-400">Enter classes & drivers</p>
        </Link>

      </section>
    </div>
  );
}
