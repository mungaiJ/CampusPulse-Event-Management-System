import { useFormik } from "formik";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

function LoginPage(){

 const navigate = useNavigate();

 const formik = useFormik({

  initialValues:{
   email:"",
   password:""
  },

  onSubmit:(values)=>{

   loginUser(values).then(data => {

     if(data.success){
        alert("Login successful");
        navigate("/");
     } else{
        alert(data.error);
     }

   });

  }

 });

 return(

  <form onSubmit={formik.handleSubmit}>

   <h2>Login</h2>

   <input
   name="email"
   placeholder="Email"
   onChange={formik.handleChange}
   />

   <input
   name="password"
   type="password"
   placeholder="Password"
   onChange={formik.handleChange}
   />

   <button type="submit">Login</button>

  </form>

 )

}

export default LoginPage