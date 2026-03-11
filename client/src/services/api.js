const BASE_URL = "http://127.0.0.1:5000";

export const loginUser = async (data) => {

  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(data)
  });

  
  return res.json();
};

export const registerUser = async (data) => {

  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};

export const registerForEvent = async (eventId) => {

 const res = await fetch(`http://127.0.0.1:5000/events/${eventId}/register`, {

   method:"POST",
   credentials:"include"

 });

 return res.json();

};