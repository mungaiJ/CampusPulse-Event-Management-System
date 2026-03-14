import { Link } from "react-router-dom";
import RegistrationButton from "./RegistrationButton";

export default function EventCard({ event, className = "" }) {
  return (
    <div
      className={`bg-gray-800 text-white rounded-2xl shadow-lg shadow-cyan-500/20 p-6 border border-gray-700 
                  hover:shadow-2xl hover:-translate-y-1 hover:scale-105 transition transform duration-300 ${className}`}
    >
      {/* Event Title */}
      <h3 className="text-xl md:text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
        {event.title}
      </h3>

      {/* Event Type Badge */}
      {event.type && (
        <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full shadow text-xs mb-3 animate-pulse">
          {event.type}
        </span>
      )}

      {/* Event Description */}
      <p
        title={event.description}
        className="text-gray-300 mb-4 line-clamp-2"
      >
        {event.description}
      </p>

      {/* Event Date */}
      <p className="text-sm text-gray-400 mb-4">
        📅 {new Date(event.event_date).toLocaleString()}
      </p>

      {/* Stats / Badges */}
      <div className="flex flex-wrap gap-2 text-xs mb-4">
        <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full shadow animate-pulse">
          Capacity: {event.capacity}
        </span>
        <span className="bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded-full shadow animate-pulse">
          Registered: {event.registrations_count}
        </span>
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full shadow animate-pulse">
          Remaining: {event.remaining_capacity}
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-2">
        <Link
          to={`/events/${event.id}`}
          className="text-blue-400 font-medium hover:text-blue-300 transition"
        >
          View Details →
        </Link>

        <RegistrationButton eventId={event.id} />
      </div>
    </div>
  );
}