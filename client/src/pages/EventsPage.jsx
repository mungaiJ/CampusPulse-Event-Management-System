import { useEffect, useState } from "react";
import { getEvents } from "../services/api";
import EventCard from "../components/EventCard";
import HeroBanner from "../components/HeroBanner";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadEvents = () => {
    setLoading(true);
    getEvents()
      .then((data) => {
        setEvents(data);
        setFilteredEvents(data);
      })
      .catch(() => setError("Failed to load events"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // ✅ Filter events whenever search changes
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(lowerSearch) ||
      event.location.toLowerCase().includes(lowerSearch) ||
      new Date(event.event_date).toLocaleDateString().includes(lowerSearch)
    );
    setFilteredEvents(filtered);
  }, [search, events]);

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

        {/* ✅ Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Search by title, location, or date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
          />
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
          {!loading && filteredEvents.length > 0
            ? filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  className="bg-gray-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
                />
              ))
            : !loading && !error && (
                <p className="text-center col-span-3 text-gray-400">
                  No events found.
                </p>
              )}
        </div>
      </section>
    </div>
  );
}
