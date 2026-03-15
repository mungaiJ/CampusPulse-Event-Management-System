import { useEffect, useState } from "react";
import { getEvents } from "../services/api";
import EventCard from "../components/EventCard";
import HeroBanner from "../components/HeroBanner";

const BASE_URL = "https://campuspulse-event-management-system.onrender.com";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const eventTypes = ["Workshop", "Seminar", "Conference", "Social", "Academic", "Cultural", "Career", "Other"];
  const locations = [];

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await getEvents();
      setEvents(data);
      setFilteredEvents(data);
    } catch {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Apply all filters whenever any filter changes
  useEffect(() => {
    let filtered = events;

    // Search filter
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(lowerSearch) ||
        event.location.toLowerCase().includes(lowerSearch) ||
        (event.description || "").toLowerCase().includes(lowerSearch)
      );
    }

    // Type filter
    if (selectedType) {
      filtered = filtered.filter((event) => event.type === selectedType);
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter((event) => 
        event.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Availability filter
    if (onlyAvailable) {
      filtered = filtered.filter((event) => 
        event.remaining_capacity > 0
      );
    }

    // Sort by date
    filtered.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
    setFilteredEvents(filtered);
  }, [search, selectedType, selectedLocation, onlyAvailable, events]);

  // Extract unique locations from events
  const uniqueLocations = [...new Set(events.map(e => e.location))];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <HeroBanner />

      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            Upcoming Events
          </h2>
          <p className="text-gray-300 mt-2 text-lg">
            Discover exciting activities happening on campus
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-xl p-6 mb-8 border border-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="col-span-1 md:col-span-2 lg:col-span-2 p-3 rounded-lg bg-gray-900 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            />

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            >
              <option value="">All Types</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 p-3 rounded-lg bg-gray-900 border border-gray-600 cursor-pointer hover:border-blue-500 transition">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-5 h-5 rounded cursor-pointer"
              />
              <span className="text-sm font-medium">Available Only</span>
            </label>
          </div>

          <button
            onClick={() => {
              setSearch("");
              setSelectedType("");
              setSelectedLocation("");
              setOnlyAvailable(false);
            }}
            className="text-sm text-gray-400 hover:text-gray-200 transition"
          >
            Clear Filters
          </button>
        </div>

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

        {loading && !error && (
          <p className="text-center text-gray-400 mt-10 text-lg">Loading events...</p>
        )}

        <div className="mb-4 text-gray-400">
          Showing {filteredEvents.length} of {events.length} events
        </div>

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
                  No events found. Try adjusting your filters.
                </p>
              )}
        </div>
      </section>
    </div>
  );
}
