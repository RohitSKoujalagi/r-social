import React,{useEffect,useState,useRef, useContext,useMemo} from 'react'
import { useForm } from "react-hook-form";
import axios from 'axios';
// import CryptoJS from 'crypto-js/md5';
// import {CredContext} from '../context/credContext';
import {useNavigate,NavLink} from 'react-router-dom'
import {GoogleAuthProvider,updateProfile} from 'firebase/auth'
// import CredContextP from '../context/CredContext';
// import { useAuth0 } from "@auth0/auth0-react";
import { Bounce, Flip, Slide, ToastContainer, Zoom, toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import notify from './notify';
import Loading from './Loading';
import Login from './Login';
import storeUser from '../../utils/addUser';
import { getFirestore, doc, setDoc, addDoc, collection } from "firebase/firestore";
import { useUsers } from '../context/UserContext';
import { ref, set } from "firebase/database"
import { realtimeDB } from '../../utils/init-firebase';

export default function Register() {



  const navigate = useNavigate();
  // const [isReqSuccess,setIsReqSuccess]=useState(false);
  // const [profilePhoto, setProfilePhoto] = useState("something");
  // const [userEmails,setUserEmails]=useState([])
  // const [showError,setShowError]=useState(false)

  const { register, handleSubmit,formState: { errors,isSubmitting,isSubmitted} } = useForm();

  const {currentUser,registerUzer,loginWithProvider,setCurrentUser,db,}=useAuth();

  const {isFirstLogin,setIsFirstLogin,getUserDetailsById,userExists} =useUsers();

  //Realtime DB
  // const writeToDatabase =async (user) => {
  //   ////console.log("I was called 🥳")
  //   await set(ref(realtimeDB, 'users/' + user.uid), user)
  //   .then(() => {
  //     ////console.log("Data saved successfully!");
  //   }).catch((error) => {
  //     alert("Failed to save data: " + error.message);
  //   });
  // };

  const transformCloudinaryURL = (url) => {

    if(url==="https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg")
    {
      return url;
    }
    // Define the transformations you want to apply
    const transformations = 'q_auto,f_auto,h_500,w_500,c_auto';
  
    // Find the index where '/upload' occurs
    const uploadIndex = url.indexOf('/upload') + '/upload'.length;
  
    // Insert the transformations right after '/upload'
    const transformedURL = url.slice(0, uploadIndex) + `/${transformations}` + url.slice(uploadIndex);
  
    return transformedURL;
  };
  
  const srcSetter=()=>{

    
    if(currentUser)
    {
      if(currentUser.profilePictureURL)
      {
        return transformCloudinaryURL(currentUser.profilePictureURL);
      }
      else{
        return  "https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg"
      }
    }
    else{
        return "https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg"
    }
  }





  


  const handleSignInProvider=async()=>{
    return  loginWithProvider().then(async(result) => {

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      setIsFirstLogin(!(user.email));//check
      getUserDetailsById(user.uid)
      // if(userExists(user.email))
      // {
      //   navigate("/r-social/profile/me");
      //   return;
      // }
      // setCurrentUser(user)
      //console.log(user)

      try{

        
 
       //console.log(user)
 
       const docRef=await addDoc(collection(db,"users"),
       {
         uid: user.uid,
         username: "",
         email: user.email,
         profilePictureURL: user.providerData[0].photoURL,
         bio: 'This is a bio',
         followers: [],
         following: [],
         accountPrivacy: 'public',
         notificationPreferences: {
           email: true,
           push: true
         },
         twoFactorEnabled: false,
         posts: [],
         accountStatus: 'active',
         verificationStatus: 'unverified',
         postsLiked:[]
       }
 
       
       //
       ).then((res)=>{
         setIsFirstLogin(true);
         ////console.log("Document written with ID: ", res.id);
         ////console.log("Response is", res._key.path.segments[1]);
 
         
 
 
       }).catch((err)=>{
           console.error(err)
       })
 
     
 
       }
       catch(err){
         console.error(err)
       }


      navigate("/r-social/profile/me")
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      notify(errorMessage,"error","bottom-center",4000);
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  }




  


  const onSubmit = async (data) => {

//Wanted

try{
 await registerUzer(data.email,data.password).then(
  async (userCredential)=>{
      notify("User Registered Successfully 🥳","success","bottom-center",2000);  
      //console.log(userCredential);
      const user = userCredential.user;
      
      // //console.log(data);
      try{
        await updateProfile(user, { displayName: data.fname});

       srcSetter();

      //console.log(user)

      const docRef=await addDoc(collection(db,"users"),
      {
        uid: user.uid,
        username: "",
        email: user.email,
        profilePictureURL: srcSetter(),
        bio: 'This is a bio',
        followers: [],
        following: [],
        accountPrivacy: 'public',
        notificationPreferences: {
          email: true,
          push: true
        },
        twoFactorEnabled: false,
        posts: [],
        accountStatus: 'active',
        verificationStatus: 'unverified',
        postsLiked:[]
      }

      
      //
      ).then((res)=>{
        setIsFirstLogin(true);
        ////console.log("Document written with ID: ", res.id);
        ////console.log("Response is", res._key.path.segments[1]);

        


      }).catch((err)=>{
          console.error(err)
      })

    

      }
      catch(err){
        console.error(err)
      }

      navigate("/r-social/login",{replace:true})
    }
  ).catch(err=>{
    if(err.message==="Firebase: Error (auth/email-already-in-use).")
    {

      notify("User with this Email already exists!","error","bottom-center",4000);
      // setIsReqSuccess(true);
    }
    else{
      notify(err.message,"error","bottom-center",4000);
    }
  })
}
catch(err)
{
  // ////console.log("Error iz ",err)
  notify(err.message,"error","bottom-center",4000);

}


//Storing in Realtime DB


// //console.log(db)
  }



  useEffect(()=>{
    if(currentUser !==null)
    {
      navigate("/r-social/")
    }
    
  },[currentUser])

  

  return (
    <>
   

<div className={`flex bg-cyan-100 min-h-full  flex-1 flex-col border-2   border-cyan-200  shadow-2xl justify-center px-6 py-7 lg:px-8 m-auto w-80 my-5 rounded-md `}>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <img
            alt="R-Social"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          /> */}
          <h1 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight text-blue-900">
           R-Social
          </h1> 
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign Up
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                
                  id="email"
                  name="email"
                  type="email"
                  required
                  {...register('email', { required: true })}
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
             
            </div>

            <div>
              <label htmlFor="fname" className="block text-sm font-medium leading-6 text-gray-900">
                First Name
              </label>
              <div className="mt-2">
                <input
                {...register('fname', { required: true })}
                  id="fname"
                  name="fname"
                  type="text"
                  required
                  autoComplete="fname"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${(isSubmitting)?"disabled":""} ${(currentUser)?"disabled disabled:bg-slate-500":""}`}
              >
                Sign Up
              <span>{isSubmitting && <Loading type="spin" color="white"/>}</span>
              </button>


            </div>
          </form>
          <br/>
          <div className="flex items-center justify-center ">
    <button disabled={currentUser} onClick={handleSignInProvider} className={`px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-blue-600 bg-white dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150 ${(currentUser)?"disabled disabled:bg-slate-500":""}`}>
        <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"/>
        <span className='text-slate-600 font-mono size-30 '>Login with Google</span>
    </button>
</div>

         {!currentUser && <div>
          <p>Already a user?</p><NavLink to={"/r-social/login"}><p className='text-blue-700 font-semibold'>Login</p></NavLink>
          </div>}

        {
          // `The user is ${currentUser}`
        }
         
        </div>
      </div>
      <h1 className='text-center'>Just a Demo Project website made by Rohit S Koujalagi</h1>


   {/* <Login/> */}
      
  
    </>
  )
}