import { registerForEvent } from "../services/api";
import { getCurrentUser } from "../services/auth";

export default function RegistrationButton({ eventId }) {
  const handleRegister = async () => {
    const user = getCurrentUser();

    if (!user) {
      alert("Please log in to register for events.");
      return;
    }

    try {
      const data = await registerForEvent(eventId, user.id);

      if (data.message) {
        alert(`Successfully registered! Remaining seats: ${data.remaining_capacity}`);
      } else {
        alert(data.error || "Registration failed.");
      }
    } catch {
      alert("Error registering for event.");
    }
  };

  return (
    <button
      onClick={handleRegister}
      className="bg-green-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-600 hover:scale-105 transition"
    >
      Register
    </button>
  );
}