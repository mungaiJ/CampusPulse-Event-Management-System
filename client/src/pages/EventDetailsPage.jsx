import { useParams } from "react-router-dom";

function EventDetailsPage(){

 const { id } = useParams();

 return(

  <div>

   <h2>Event Details</h2>

   <p>Event ID: {id}</p>

  </div>

 )

}

export default EventDetailsPage