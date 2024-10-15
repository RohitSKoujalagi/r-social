import React,{useEffect,useState,useContext} from 'react'
import { useForm } from "react-hook-form";
import axios from 'axios';
import CryptoJS from 'crypto-js/md5';
import {useNavigate,NavLink,Navigate, replace} from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
// import { Bounce, Flip, Slide, ToastContainer, Zoom, toast } from 'react-toastify';
import Loading from './Loading';
// import 'dotenv/config'
// require('dotenv').config()
import notify from './notify';
import { useUsers } from '../context/UserContext';
export default function Login() {

  // const 
  // const value=useContext(CredContextP)
  const {currentUser,loginUzer,setCurrentUser}=useAuth();
  const {getUserDetailsById}=useUsers();
  // const history=useHistory()

  const navigate = useNavigate();


  const { register, handleSubmit,formState: { errors ,isSubmitting,isSubmitted} } = useForm();



  const onSubmit = async(data) => {

    try{
      loginUzer(data.email,data.password)
      .then(
        res=>{
          notify("Login Successful 🥳","success","bottom-center",1500);  
          ////console.log("Login done ",res.user.uid)
          getUserDetailsById(res.user.uid)
          navigate("/r-social/profile/me",{replace:true})
          setCurrentUser(res.user)
        }
      )
      .catch(err=>{
        if(err.message==="Firebase: Error (auth/invalid-credential).")
        {

          notify("Invalid User Credentials","error","bottom-center",4000);
        }
        else
        {
          notify(err.message,"error","bottom-center",4000);

        }
        
      })
    }
    catch(err)
    {
        console.error(err);
        notify(err.message,"error","bottom-center",4000);

    }

       
  }


  useEffect(()=>{
    if(currentUser !==null)
    {
      navigate("/r-social/")
    }
    
  },[currentUser])
  

  return (
    <>


 <div className={`flex bg-cyan-100 min-h-full  flex-1 flex-col border-2 border-cyan-200  shadow-2xl justify-center px-6 py-10 lg:px-8 m-auto w-80 my-5 rounded-md `}>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight text-blue-900">
           R-Social
          </h1> 
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Login
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <input
                  autoFocus={true}
                  id="email"
                  name="email"
                  type="email"
                  required
                  {...register('email', { required: true })}
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                />
              </div>
             
            </div>


            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                {...register('password', { required: true,minLength:{
                  value:8,message:"Password must have atleast 8 characters"
                },maxLength:{
                  value:16,
                  message:"Password must have maximum 16 characters"
                } })}
                  id="password"
                  name="password"
                  type="password"
                  required

                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {errors.password && <p role="alert" className='text-red-600'>{errors.password.message}</p>}
            </div>

            <div>
              <button
              disabled={isSubmitting || currentUser}
                type="submit"
                className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${(currentUser)?"disabled disabled:bg-slate-500":""}`}
              >
                Sign in <span>{isSubmitting && <Loading type="spin" color="white"/>}</span>
              </button>
            </div>
          
          </form>
                <br/>
                {!currentUser && <div>

                  <p>Not a Registered User?</p><NavLink to={"/r-social/register"}><p className='text-blue-700 font-semibold'>Register</p></NavLink>
                  </div>}

         
        </div>
      </div>

   
      
  
    </>
  )
}