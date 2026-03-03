import { AiFillPicture } from "react-icons/ai";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaBell, FaFacebookF, FaGoogle, FaMessage } from "react-icons/fa6";
import {Form, Input, Button ,DatePicker, Select, SelectItem} from "@heroui/react";
import { useForm , Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Register() {

  const navigate=useNavigate()
  const [isLoading,setisloading]=useState(false)

  const schema =z.object({
    name:z.string().min(1, "Please Enter Your Name"),
    username:z.string().min(3, "Please Enter a valid username"),
    email:z.email("enter valid email"),
    password:z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"please Enter valid Passord"),
    rePassword: z.string(),
    dateOfBirth: z.coerce.date()
  .refine(function(value){
    const today = new Date();
    const age = today.getFullYear() - value.getFullYear();
    return age > 18;
  }, {
    message: "User age must be above 18"
  })
  .transform(function(value) {
    return value.toISOString(); 
  }),
    gender:z.enum(["male","female"])
  }).refine(function({password, rePassword}){
  return password === rePassword; 
}, {
  message: "Password and repassword should be the same", 
  path: ["rePassword"] 
})

  

  const {register,handleSubmit,control ,formState}=useForm({
    defaultValues:{
      name:"",
      username:"",
      email:"",
      password:"",
      rePassword:"",
      dateOfBirth:null,
      gender:""
    },
    mode:"onSubmit",
    resolver:zodResolver(schema)
  })
  console.log(formState.errors)
  const { errors, isValid } = formState; 

console.log("Errors:", errors);
console.log("Is Valid:", isValid); 

  function handleRegister(values) {
    toast.promise(
      axios.post("/api/users/signup", {
        name: values.name,
        username: values.username,
        email: values.email,
        password: values.password,
        rePassword: values.rePassword,
        dateOfBirth: values.dateOfBirth,
        gender: values.gender
      }),
      {
        loading: 'Saving...',
        success: function (response) {
          setisloading(false)
          navigate("/Login")
          return response.data.message
        },
        error: function (err) {
          return err.response?.data?.message || "Registration failed"
        },
      }
    );
    setisloading(true)
  }

  return (
    <div className="grid grid-cols-12 min-h-screen">
      <div className="bg-blue-500 col-span-6">
       <div className="mt-9 ms-9">
        <span className="text-2xl font-bold text-white bg-amber-400 px-3.5 pb-2 pt-1 rounded-lg border-0">S</span>
        <span className="text-2xl  text-white ms-5 font-bold">SocialHub</span>
       </div>
       <div className="mt-18 ms-8">
        <h2 className="text-4xl text-white font-bold">Conncet width <br /> <span className="text-blue-300">amazing people</span></h2>
        <p className="text-white mt-4">Join millions of users sharing moments, ideas, and building <br /> meaningful connections every day</p>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 mt-18 ms-7 me-6 gap-5">
       <div className="flex gap-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-2 hover:scale-105 transition-transform duration-200 text-white">
        <div className="bg-green-500 p-3 rounded-xl"><FaMessage size={20} className=" text-green-600"/>
</div>
        <div className="pb-0">
          <h4>Real-time Chat</h4>
          <span>Instant messaging</span>
        </div>
        </div>
       <div className="flex gap-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-2 hover:scale-105 transition-transform duration-200 text-white">
        <div className="bg-blue-400 p-3 rounded-xl"><AiFillPicture size={20} className="text-white"/>
</div>
        <div className="pb-0">
          <h4>Real-time Chat</h4>
          <span>Instant messaging</span>
        </div>
        </div>
        <div className="flex gap-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-2 hover:scale-105 transition-transform duration-200 text-white">
        <div className="bg-purple-500 p-3 rounded-xl"><FaBell size={20}/>
</div>
        <div className="pb-0">
          <h4>Real-time Chat</h4>
          <span>Instant messaging</span>
        </div>
        </div>
        <div className="flex gap-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-2 hover:scale-105 transition-transform duration-200 text-white">
        <div className="bg-teal-400/20  p-3 rounded-xl"><BsFillPeopleFill size={20} className="text-green-300"/>
</div>
        <div className="pb-0">
          <h4>Real-time Chat</h4>
          <span>Instant messaging</span>
        </div>
        </div>
       </div>

      </div>

      <div className="col-span-6 bg-gray-100">
      <div className=" py-12 flex justify-center items-center">
        <div  className="w-full bg-white max-w-lg mx-auto p-8 rounded-2xl shadow space-y-5">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Create Account</h2>
          <div className="flex justify-center gap-1">
            <p>Already have an account?</p>
          <a href="/login" className="text-blue-400">Sign in</a>
          </div>
        </div>
        <div className="flex justify-center gap-3">
          <div className="bg-white border border-gray-300 px-12 py-2 rounded-xl flex justify-center gap-2.5 cursor-pointer">
            <FaGoogle size={20} className="text-red-500 "/>
            <p className="text-gray-500">Google</p>
          </div>
          <div className="bg-blue-600 px-12 py-2 rounded-xl flex justify-center gap-2.5 cursor-pointer">
            <FaFacebookF size={20} className="text-white"/>
            <p className="text-white">FaceBook</p>
          </div>
        </div>
        <div className="seperator text-gray-400 text-sm relative text-center after:w-1/3 after:h-px after:bg-linear-to-r after:from-transparent after:via-gray-400/40 after:to-transparent after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 before:w-1/3 before:h-px before:bg-linear-to-r before:from-transparent before:via-gray-400/40 before:to-transparent before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 undefined">
        or continue with email
        </div>

            <Form onSubmit={handleSubmit(handleRegister)}>
      <div className="w-full">
        <Input
          isRequired
          errorMessage={({validationDetails}) => {
            if (validationDetails.valueMissing) {
              return "Please enter a valid name";
            }
          }}
          {...register("name")}
          label="Name"
          labelPlacement="outside"
          name="name"
          placeholder="Enter your name"
          type="text"
        />
        {formState.errors.name && <p>{formState.errors.name.message}</p>}
      </div>
      <div className="w-full">
        <Input
          isRequired
          errorMessage={({validationDetails}) => {
            if (validationDetails.valueMissing) {
              return "Please enter a valid username";
            }
          }}
          {...register("username")}
          label="Username"
          labelPlacement="outside"
          name="username"
          placeholder="Enter your username"
          type="text"
        />
        {formState.errors.username && <p>{formState.errors.username.message}</p>}
      </div>

       <div className="w-full">
        <Input
        isRequired
        errorMessage="Please enter a valid email"
        {...register("email")}
        label="Email"
        labelPlacement="outside"
        name="email"
        autoComplete="new-email"
        placeholder="Enter your email"
        type="email"
      />
      {formState.errors.email&&<p>{formState.errors.email.message}</p>}
       </div>
      <div className="w-full">
        <Input
        isRequired
        errorMessage="Please enter a valid password"
        {...register("password")}
        label="password"
        labelPlacement="outside"
        name="password"
        autoComplete="new-password"
        placeholder="Enter your password"
        type="password"
      />
      {formState.errors.password&&<p>{formState.errors.password.message}</p>}
      </div>
      <div className="w-full">
         <Input
        isRequired
        {...register("rePassword")}
        errorMessage="Please enter a valid password"
        label="confirm password"
        labelPlacement="outside"
        name="rePassword"
         autoComplete="new-password" 
        placeholder="Enter your password"
        type="password"
      />
      {formState.errors.rePassword&&<p>{formState.errors.rePassword.message}</p>}
      </div>
    <div className="flex gap-2">
  <div className="w-full">
    <Controller
      name="dateOfBirth"
      control={control}
      render={({ field }) => (
        <DatePicker
          {...field}
          label="Birth date"
          className="max-w-71"
          errorMessage="Please enter your age"
        />
      )}
    />
    {formState.errors.dateOfBirth&&<p>{formState.errors.dateOfBirth.message}</p>}
  </div>
  
  <div className="w-full">
    <Controller
      name="gender"
      control={control}
      render={({ field }) => (
        <Select
          {...field}
          label="Gender"
          placeholder="Select Your gender"
          errorMessage="Please select your gender"
        >
          <SelectItem key="male">Male</SelectItem>
          <SelectItem key="female">Female</SelectItem>
        </Select>
      )}
    />
    {formState.errors.gender&&<p>{formState.errors.gender.message}</p>}
  </div>
</div>
      <Button 
      isLoading={isLoading}
  type="submit" 
  variant="bordered"
  isDisabled={!isValid}
    className={`
    ${!isValid 
      ? "cursor-not-allowed opacity-50 bg-gray-200" 
      : "cursor-pointer hover:bg-blue-500 hover:text-white"
    }
  `}
>
  Craete Account
</Button>
    </Form>


        

        </div>
      </div>
      </div>
    </div>
  )
}
