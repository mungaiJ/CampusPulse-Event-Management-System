import { useEffect, useState } from "react";
import { getEvents } from "../services/api";
import EventCard from "../components/EventCard";

function EventsPage(){

 const [events,setEvents] = useState([]);

 useEffect(()=>{

  getEvents().then(data => {
    setEvents(data);
  });

 },[])

 return(

  <div>

   <h1>Campus Events</h1>

   {events.map(event => (

    <EventCard
     key={event.id}
     event={event}
    />

   ))}

  </div>

 )

}

export default EventsPage