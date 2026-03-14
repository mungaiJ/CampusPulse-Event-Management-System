const BASE_URL = "https://campuspulse-event-management-system.onrender.com";

// Events
export async function getEvents() {
  const res = await fetch(`${BASE_URL}/events`);
  if (!res.ok) throw new Error("Failed to load events");
  const data = await res.json();
  // ✅ Ensure each event has a type
  return data.map(ev => ({ ...ev, type: ev.type || "Other" }));
}

export async function getEvent(id) {
  const res = await fetch(`${BASE_URL}/events/${id}`);
  if (!res.ok) throw new Error("Failed to load event");
  const event = await res.json();
  return { ...event, type: event.type || "Other" }; // ✅ Default if missing
}

export async function registerForEvent(eventId, userId) {
  const res = await fetch(`${BASE_URL}/events/${eventId}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!res.ok) throw new Error("Failed to register");
  return res.json();
}

export async function unregisterFromEvent(eventId, userId) {
  const res = await fetch(`${BASE_URL}/events/${eventId}/register`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!res.ok) throw new Error("Failed to unregister");
  return res.json();
}

// Auth
export async function signupUser(data) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function loginUser(data) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// User events
export async function getMyEvents(userId) {
  const res = await fetch(`${BASE_URL}/users/${userId}/events`);
  if (!res.ok) throw new Error("Failed to load your events");
  return res.json();
}

// Admin
export async function createEvent(data) {
  const res = await fetch(`${BASE_URL}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateEvent(id, data) {
  const res = await fetch(`${BASE_URL}/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteEvent(id) {
  const res = await fetch(`${BASE_URL}/events/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function getAllEvents() {
  const res = await fetch(`${BASE_URL}/events`);
  if (!res.ok) throw new Error("Failed to load events");
  const data = await res.json();
  return data.map(ev => ({ ...ev, type: ev.type || "Other" }));
}