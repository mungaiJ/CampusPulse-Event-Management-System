import { useFormik } from "formik";
import { registerUser } from "../services/api";

function RegisterPage(){

 const formik = useFormik({

  initialValues:{
   name:"",
   email:"",
   password:""
  },

  onSubmit:(values)=>{
   registerUser(values)
  }

 })

 return(

  <form onSubmit={formik.handleSubmit}>

   <h2>Register</h2>

   <input name="name" placeholder="Name" onChange={formik.handleChange} />

   <input name="email" placeholder="Email" onChange={formik.handleChange} />

   <input name="password" type="password" placeholder="Password" onChange={formik.handleChange} />

   <button type="submit">Register</button>

  </form>

 )

}

export default RegisterPage