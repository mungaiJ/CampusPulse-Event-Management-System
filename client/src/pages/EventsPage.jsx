import { useEffect, useState } from "react";
import { getEvents } from "../services/api";
import EventCard from "../components/EventCard";
import HeroBanner from "../components/HeroBanner";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadEvents = () => {
    setLoading(true);
    getEvents()
      .then((data) => setEvents(data))
      .catch(() => setError("Failed to load events"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* Hero Banner */}
      <HeroBanner />

      {/* Events Section */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            Upcoming Events
          </h2>
          <p className="text-gray-300 mt-2 text-lg">
            Discover exciting activities happening on campus
          </p>
        </div>

        {/* Error / Retry */}
        {error && (
          <div className="text-center mb-8">
            <p className="text-red-500 font-medium">{error}</p>
            <button
              onClick={loadEvents}
              className="mt-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition transform"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && !error && (
          <p className="text-center text-gray-400 mt-10 text-lg">Loading events...</p>
        )}

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading && events.length > 0
            ? events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  className="bg-gray-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
                />
              ))
            : !loading && !error && (
                <p className="text-center col-span-3 text-gray-400">No events available.</p>
              )}
        </div>
      </section>
    </div>
  );
}