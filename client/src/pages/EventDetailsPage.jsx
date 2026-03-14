import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEvent } from "../services/api";

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEvent(id)
      .then(setEvent)
      .catch(() => setError("Failed to load event"));
  }, [id]);

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500">
        <p className="text-lg">{error}</p>
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-400">
        <p className="text-lg">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 px-6 py-12 flex justify-center">
      <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md shadow-2xl rounded-xl p-8 max-w-3xl border border-cyan-400">
        <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
          {event.title}
        </h2>

        {/* ✅ Type */}
        {event.type && (
          <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full shadow text-sm mb-4">
            {event.type}
          </span>
        )}

        <p className="text-gray-300 mb-4">{event.description}</p>
        <p className="text-gray-400 mb-2">📅 {new Date(event.event_date).toLocaleString()}</p>
        {event.location && <p className="text-gray-400 mb-2">📍 Location: {event.location}</p>}
        <p className="text-gray-400">
          👥 Capacity: {event.capacity} | Registered: {event.registrations_count} | Remaining: {event.remaining_capacity}
        </p>
      </div>
    </div>
  );
}