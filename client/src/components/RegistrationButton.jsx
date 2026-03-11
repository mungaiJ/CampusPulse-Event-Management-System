import { registerForEvent } from "../services/api";

function RegistrationButton({ eventId }){

 const handleRegister = () => {

  registerForEvent(eventId).then(data => {

    if(data.success){
      alert("Successfully registered!");
    } else{
      alert(data.error);
    }

  });

 };

 return(

  <button onClick={handleRegister}>
   Register for Event
  </button>

 )

}

export default RegistrationButton