import { useState, useEffect } from "react";
import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  exportEventsCsv,
  exportRegistrationsCsv,
  getEventStats,
} from "../services/api";

const BASE_URL = "https://campuspulse-event-management-system.onrender.com";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    totalUsers: 0,
  });
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    capacity: "",
    location: "",
    type: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("events");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      // Load events
      const eventsData = await getAllEvents();
      setEvents(eventsData);

      // Load users
      const usersRes = await fetch(`${BASE_URL}/users/all`);
      const usersData = await usersRes.json();
      setUsers(Array.isArray(usersData) ? usersData : usersData.users || []);

      // Load registrations
      const registrationsRes = await fetch(`${BASE_URL}/events/registrations/all`);
      const registrationsData = await registrationsRes.json();
      setRegistrations(Array.isArray(registrationsData) ? registrationsData : registrationsData.registrations || []);

      // Calculate stats
      setStats({
        totalEvents: eventsData.length,
        totalRegistrations: Array.isArray(registrationsData) ? registrationsData.length : registrationsData.registrations?.length || 0,
        totalUsers: Array.isArray(usersData) ? usersData.length : usersData.users?.length || 0,
      });
    } catch (err) {
      console.error("[v0] Error loading dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const payload = { ...form, created_by: user?.id };

      if (editingId) {
        await updateEvent(editingId, payload);
      } else {
        await createEvent(payload);
      }

      setForm({
        title: "",
        description: "",
        event_date: "",
        capacity: "",
        location: "",
        type: "",
      });
      setEditingId(null);
      loadDashboardData();
    } catch (err) {
      setError("Failed to save event");
    }
  };

  const handleEdit = (event) => {
    setForm({
      title: event.title,
      description: event.description,
      event_date: event.event_date ? event.event_date.slice(0, 16) : "",
      capacity: event.capacity,
      location: event.location,
      type: event.type || "",
    });
    setEditingId(event.id);
    setActiveTab("events");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id);
        loadDashboardData();
      } catch (err) {
        setError("Failed to delete event");
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await fetch(`${BASE_URL}/users/${userId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          loadDashboardData();
        } else {
          setError("Failed to delete user");
        }
      } catch (err) {
        setError("Failed to delete user");
      }
    }
  };

  const StatCard = ({ title, value, icon }) => (
    <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-xl p-6 border border-cyan-400">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-cyan-400 mt-2">{value}</p>
        </div>
        <div className="text-4xl text-blue-400 opacity-40">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white px-6 py-12 overflow-hidden">
      {/* Subtle background glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 opacity-20 blur-3xl rounded-full animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 opacity-20 blur-3xl rounded-full animate-pulse pointer-events-none"></div>

      <h1 className="text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
        Admin Dashboard
      </h1>
      <p className="text-center text-gray-400 mb-12">Manage events, users, and registrations</p>

      {/* Statistics */}
      <div className="max-w-6xl mx-auto mb-12 grid md:grid-cols-3 gap-6">
        <StatCard title="Total Events" value={stats.totalEvents} icon="📅" />
        <StatCard title="Total Registrations" value={stats.totalRegistrations} icon="✅" />
        <StatCard title="Total Users" value={stats.totalUsers} icon="👥" />
      </div>

      {error && (
        <div className="max-w-6xl mx-auto mb-6 p-4 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex gap-4 flex-wrap justify-between items-center">
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => setActiveTab("events")}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === "events"
                  ? "bg-cyan-400 text-gray-900"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Manage Events
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === "users"
                  ? "bg-cyan-400 text-gray-900"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Manage Users
            </button>
            <button
              onClick={() => setActiveTab("registrations")}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === "registrations"
                  ? "bg-cyan-400 text-gray-900"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Registrations
            </button>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                exportEventsCsv().catch(() => setError("Failed to export events"));
              }}
              className="px-4 py-2 rounded-lg font-semibold bg-green-600 hover:bg-green-700 transition text-white text-sm"
            >
              Export Events
            </button>
            <button
              onClick={() => {
                exportRegistrationsCsv().catch(() => setError("Failed to export registrations"));
              }}
              className="px-4 py-2 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 transition text-white text-sm"
            >
              Export Registrations
            </button>
          </div>
        </div>
      </div>

      {/* Events Tab */}
      {activeTab === "events" && (
        <div className="max-w-6xl mx-auto">
          {/* Event Form */}
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md shadow-2xl rounded-xl p-8 mb-12 border border-cyan-400">
            <h2 className="text-2xl font-semibold mb-6 text-center text-cyan-400">
              {editingId ? "Update Event" : "Create New Event"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Title
                </label>
                <input
                  name="title"
                  placeholder="Event Title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Description
                </label>
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
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="event_date"
                    value={form.event_date}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    placeholder="Capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Location
                </label>
                <input
                  name="location"
                  placeholder="Event Location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Event Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                >
                  <option value="">Select Event Type</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Conference">Conference</option>
                  <option value="Social">Social</option>
                  <option value="Academic">Academic</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Career">Career</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-blue-500 hover:to-cyan-400 transition transform hover:scale-105 shadow-lg"
                >
                  {editingId ? "Update Event" : "Create Event"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm({
                        title: "",
                        description: "",
                        event_date: "",
                        capacity: "",
                        location: "",
                        type: "",
                      });
                    }}
                    className="flex-1 py-3 rounded-lg font-semibold bg-gray-700 hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Events List */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-cyan-400">
              All Events ({events.length})
            </h2>
            {loading ? (
              <p className="text-gray-400 text-center py-8">Loading events...</p>
            ) : events.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No events created yet</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-gray-800 bg-opacity-70 backdrop-blur-md shadow-2xl rounded-xl p-6 border border-cyan-400 hover:shadow-cyan-500/40 transition transform hover:-translate-y-1"
                  >
                    <h3 className="text-xl font-bold text-blue-400 mb-2">{event.title}</h3>
                    <p className="text-gray-300 text-sm mb-3">{event.description?.slice(0, 100)}</p>
                    <div className="space-y-1 text-sm text-gray-400 mb-4">
                      <p>📅 {new Date(event.event_date).toLocaleDateString()}</p>
                      <p>🕐 {new Date(event.event_date).toLocaleTimeString()}</p>
                      <p>📍 {event.location}</p>
                      <p>👥 {event.registrations_count || 0}/{event.capacity}</p>
                      <p>🏷️ {event.type}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEdit(event)}
                        className="flex-1 px-3 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 font-semibold shadow-md text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold shadow-md text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-cyan-400">
            All Users ({users.length})
          </h2>
          {loading ? (
            <p className="text-gray-400 text-center py-8">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No users found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-800 border-b border-cyan-400">
                  <tr>
                    <th className="px-6 py-3 text-cyan-400 font-semibold">Name</th>
                    <th className="px-6 py-3 text-cyan-400 font-semibold">Email</th>
                    <th className="px-6 py-3 text-cyan-400 font-semibold">Role</th>
                    <th className="px-6 py-3 text-cyan-400 font-semibold">Joined</th>
                    <th className="px-6 py-3 text-cyan-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-800 transition">
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          user.role === "admin" ? "bg-red-900 text-red-200" : "bg-blue-900 text-blue-200"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Registrations Tab */}
      {activeTab === "registrations" && (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-cyan-400">
            All Registrations ({registrations.length})
          </h2>
          {loading ? (
            <p className="text-gray-400 text-center py-8">Loading registrations...</p>
          ) : registrations.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No registrations found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-800 border-b border-cyan-400">
                  <tr>
                    <th className="px-6 py-3 text-cyan-400 font-semibold">User</th>
                    <th className="px-6 py-3 text-cyan-400 font-semibold">Event</th>
                    <th className="px-6 py-3 text-cyan-400 font-semibold">Registered At</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="border-b border-gray-700 hover:bg-gray-800 transition">
                      <td className="px-6 py-4">{reg.user_name || reg.user_id}</td>
                      <td className="px-6 py-4">{reg.event_title || reg.event_id}</td>
                      <td className="px-6 py-4 text-gray-400">{new Date(reg.registered_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
