import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/auth";
import { getMyEvents, unregisterFromEvent } from "../services/api";

export default function MyEventsPage() {
  const user = getCurrentUser();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadEvents = () => {
    if (user) {
      getMyEvents(user.id)
        .then(setEvents)
        .catch(() => setError("Failed to load your events"))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadEvents();
  }, [user]);

  const handleUnregister = async (eventId) => {
    try {
      await unregisterFromEvent(eventId, user.id);
      loadEvents();
    } catch {
      setError("Failed to unregister from event");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-gray-400 text-lg text-center">
          Please log in to view your events.
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-900 text-white px-8 py-12 overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-linear-to-r from-purple-500 via-pink-500 to-indigo-400 rounded-full blur-3xl opacity-30 animate-pulse z-0"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full blur-3xl opacity-30 animate-pulse z-0"></div>

      <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center relative z-10">
        <span className="bg-linear-to-r from-blue-400 via-purple-400 to-indigo-500 text-transparent bg-clip-text">
          My Registered Events
        </span>
      </h2>

      {loading && (
        <p className="text-center text-gray-400 mt-10 relative z-10">
          Loading your events...
        </p>
      )}
      {error && (
        <p className="text-center text-red-500 mt-4 relative z-10">{error}</p>
      )}
      {!loading && events.length === 0 && (
        <p className="text-center text-gray-400 mt-10 relative z-10">
          You haven’t registered for any events yet.
        </p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 relative z-10">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-gray-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 p-6"
          >
            <h3 className="text-xl font-bold text-blue-400">{event.title}</h3>
            <p className="text-gray-300 mb-2">{event.description}</p>
            <p className="text-sm text-gray-400">
              📅 {new Date(event.event_date).toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">
              👥 Capacity: {event.capacity}
            </p>

            <button
              onClick={() => handleUnregister(event.id)}
              className="
                mt-4 w-full py-2
                bg-linear-to-r from-red-500 to-red-700
                hover:from-red-600 hover:to-red-800
                text-white font-bold
                rounded-xl
                shadow-lg hover:shadow-2xl
                transform hover:-translate-y-1
                transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
              "
            >
              Unregister
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
