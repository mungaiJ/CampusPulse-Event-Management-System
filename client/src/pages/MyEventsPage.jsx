import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/auth";
import { getMyEvents, unregisterFromEvent } from "../services/api";

const BASE_URL = "https://campuspulse-event-management-system.onrender.com";

export default function MyEventsPage() {
  const user = getCurrentUser();
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
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
    if (window.confirm("Are you sure you want to unregister from this event?")) {
      try {
        await unregisterFromEvent(eventId, user.id);
        loadEvents();
      } catch {
        setError("Failed to unregister from event");
      }
    }
  };

  const handleExportCalendar = () => {
    const icsContent = events
      .map((event) => {
        const startDate = new Date(event.event_date);
        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
        const formatDate = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

        return `BEGIN:VEVENT
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ""}
LOCATION:${event.location || ""}
UID:${event.id}@campuspulse.local
END:VEVENT`;
      })
      .join("\n");

    const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CampusPulse//Event Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
${icsContent}
END:VCALENDAR`;

    const blob = new Blob([icalContent], { type: "text/calendar" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-events.ics";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-gray-400 text-lg text-center">Please log in to view your events.</p>
      </div>
    );
  }

  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.event_date) >= now);
  const pastEvents = events.filter((e) => new Date(e.event_date) < now);

  const displayEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <div className="relative min-h-screen bg-gray-900 text-white px-8 py-12 overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-400 rounded-full blur-3xl opacity-30 animate-pulse z-0"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full blur-3xl opacity-30 animate-pulse z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-500 text-transparent bg-clip-text">
              My Events Dashboard
            </span>
          </h1>
          <p className="text-gray-300 text-lg">Welcome, {user.name} ({user.role})</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-xl p-6 border border-cyan-400">
            <p className="text-gray-300 text-sm">Total Registered</p>
            <p className="text-3xl font-bold text-cyan-400 mt-2">{events.length}</p>
          </div>
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-xl p-6 border border-blue-400">
            <p className="text-gray-300 text-sm">Upcoming</p>
            <p className="text-3xl font-bold text-blue-400 mt-2">{upcomingEvents.length}</p>
          </div>
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-xl p-6 border border-indigo-400">
            <p className="text-gray-300 text-sm">Attended</p>
            <p className="text-3xl font-bold text-indigo-400 mt-2">{pastEvents.length}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === "upcoming"
                  ? "bg-cyan-400 text-gray-900"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab("attended")}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === "attended"
                  ? "bg-cyan-400 text-gray-900"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Past Events
            </button>
          </div>

          {events.length > 0 && (
            <button
              onClick={handleExportCalendar}
              className="px-6 py-2 rounded-lg font-semibold bg-green-600 hover:bg-green-700 transition text-white"
            >
              Export to Calendar
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {loading && <p className="text-center text-gray-400 mt-10">Loading your events...</p>}

        {!loading && displayEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">
              {activeTab === "upcoming"
                ? "You haven't registered for any upcoming events yet."
                : "You haven't attended any events yet."}
            </p>
            <a
              href="/events"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:scale-105 transition"
            >
              Browse Events
            </a>
          </div>
        )}

        {!loading && displayEvents.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayEvents.map((event) => (
              <div
                key={event.id}
                className="bg-gray-800 bg-opacity-70 backdrop-blur-md text-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 p-6 border border-gray-700"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-blue-400 flex-1">{event.title}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      new Date(event.event_date) >= now
                        ? "bg-green-900 text-green-200"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {new Date(event.event_date) >= now ? "Upcoming" : "Attended"}
                  </span>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-2 text-sm text-gray-400 mb-4">
                  <p>📅 {new Date(event.event_date).toLocaleDateString()}</p>
                  <p>
                    🕐{" "}
                    {new Date(event.event_date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p>📍 {event.location}</p>
                  <p>🏷️ {event.type}</p>
                  <p>👥 {event.registrations_count || 0}/{event.capacity}</p>
                </div>

                {new Date(event.event_date) >= now && (
                  <button
                    onClick={() => handleUnregister(event.id)}
                    className="w-full py-2 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Unregister
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
