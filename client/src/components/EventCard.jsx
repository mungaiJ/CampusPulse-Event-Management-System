import { Link } from "react-router-dom";
import RegistrationButton from "./RegistrationButton";

function EventCard({ event }) {

  return (
    <div>

      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <p>{event.date}</p>

      <Link to={`/events/${event.id}`}>
        View Details
      </Link>

      <RegistrationButton eventId={event.id} />

    </div>
  );
}

export default EventCard;