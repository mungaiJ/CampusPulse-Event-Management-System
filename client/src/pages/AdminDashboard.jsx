import { useState, useEffect } from "react";
import { getAllEvents, createEvent, updateEvent, deleteEvent } from "../services/api";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    capacity: "",
    location: "",
    type: ""
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const data = await getAllEvents();
    setEvents(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    const payload = { ...form, created_by: user?.id };

    if (editingId) {
      await updateEvent(editingId, payload);
    } else {
      await createEvent(payload);
    }

    setForm({ title: "", description: "", event_date: "", capacity: "", location: "", type: "" });
    setEditingId(null);
    loadEvents();
  };

  const handleEdit = (event) => {
    setForm({
      title: event.title,
      description: event.description,
      event_date: event.event_date ? event.event_date.slice(0, 16) : "",
      capacity: event.capacity,
      location: event.location,
      type: event.type || ""
    });
    setEditingId(event.id);
  };

  const handleDelete = async (id) => {
    await deleteEvent(id);
    loadEvents();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white px-6 py-12 overflow-hidden">
      
      {/* Subtle background glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 opacity-20 blur-3xl rounded-full animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 opacity-20 blur-3xl rounded-full animate-pulse pointer-events-none"></div>

      <h1 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
        Admin Dashboard
      </h1>

      {/* Event Form */}
      <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md shadow-2xl rounded-xl p-8 mb-12 max-w-2xl mx-auto border border-cyan-400">
        <h2 className="text-2xl font-semibold mb-6 text-center text-cyan-400">
          {editingId ? "Update Event" : "Create New Event"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Title</label>
            <input
              name="title"
              placeholder="Event Title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Event Description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Date & Time</label>
              <input
                type="datetime-local"
                name="event_date"
                value={form.event_date}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Capacity</label>
              <input
                type="number"
                name="capacity"
                placeholder="Capacity"
                value={form.capacity}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Location</label>
            <input
              name="location"
              placeholder="Event Location"
              value={form.location}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Event Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            >
              <option value="">Select Event Type</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Social</option>
              <option value="Conference">Sports</option>
              <option value="Meetup">Academic</option>
              <option value="Meetup">Cultural</option>
              <option value="Meetup">Career</option>
              <option value="Other">...Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-blue-500 hover:to-cyan-400 transition transform hover:scale-105 shadow-lg"
          >
            {editingId ? "Update Event" : "Create Event"}
          </button>
        </form>
      </div>

      {/* Events List */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-cyan-400">All Events</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-gray-800 bg-opacity-70 backdrop-blur-md shadow-2xl rounded-xl p-6 border border-cyan-400 hover:shadow-cyan-500/40 transition transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-bold text-blue-400">{event.title}</h3>
              <p className="text-gray-300 mb-1">{event.description}</p>
              <p className="text-sm text-gray-400">📅 {new Date(event.event_date).toLocaleString()}</p>
              <p className="text-sm text-gray-400">👥 Capacity: {event.capacity}</p>
              <p className="text-sm text-gray-400">🏷️ Type: {event.type}</p>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={() => handleEdit(event)}
                  className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 shadow-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 shadow-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}