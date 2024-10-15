import React,{useEffect,Suspense, useState, useCallback} from 'react'
import { useAuth } from '../context/AuthContext';
// import {currentUser} from '../context/AuthContext'
import ProfilePlaceholder from '../assets/ProfilePlaceholder.webp'
import { getFirestore, doc, setDoc, addDoc, collection,getDocs,query,where } from "firebase/firestore";

import {Outlet, useNavigate,useParams} from 'react-router-dom'
import {useUsers} from '../context/UserContext'

function UserProfile() {
//   const {currentUser,db} =useAuth();
  // const userCount=[];
//   const navigate=useNavigate();
  let { username } = useParams();
//   const [userDetail,setUserDetail]=useState()
  
  const {isFirstLogin,
    setIsFirstLogin,getUserDetailsById,getUsers,userArray,isFollowing,getValueByKey,getUserByKey}=useUsers();

    // let user=getUserByKey(userArray,username)
    //console.log(username)
    

      
//       const transformCloudinaryURL = (url) => {

//         if(url==="https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg")
//         {
//           return url;
//         }
//         if(url.includes("google"))
//         {
//           return url;
//         }
//         // Define the transformations you want to apply
//         const transformations = 'q_auto,f_auto,h_500,w_500,c_auto';
      
//         // Find the index where '/upload' occurs
//         const uploadIndex = url.indexOf('/upload') + '/upload'.length;
      
//         // Insert the transformations right after '/upload'
//         const transformedURL = url.slice(0, uploadIndex) + `/${transformations}` + url.slice(uploadIndex);
      
//         return transformedURL;
//       };

//   const srcSetter=()=>{
//     if(currentUser)
//     {
//       if(currentUser.profilePictureURL)
//       {
//         return transformCloudinaryURL(currentUser.profilePictureURL);
//       }
//       else{
//         return "https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg"
//       }
//     }
//     else{
//         return "https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg"
//     }
//   }

//   function handleProfileEdit(){
//     navigate("/r-social/firstLogin")
//   }


//   useEffect(()=>{
//     getValueByKey(userArray,currentUser.uid)
//   },[])

  return (
    <> 
         
       


{/* {
<div
    className="max-w-2xl border-2 border-cyan-100  mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900">
    <div className="rounded-t-lg h-32 overflow-hidden">
      
        <img className="object-cover object-top w-full" src='https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='Mountain'/>
    </div>
    <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
        <img  className="object-cover object-center h-32" src={srcSetter()} alt='Baingan Pic'/>
        
       
    </div>
    <div className="text-center mt-2">

        <h2 className="font-semibold">{currentUser && currentUser.username}</h2>
        <p className="text-gray-500">{currentUser && currentUser.bio}</p>
    </div>
    <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
        <li className="flex flex-col items-center justify-around">
            <svg className="w-4 fill-current text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path
                    d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>{currentUser && getValueByKey(userArray,"followers")
            }
            <div>{currentUser && currentUser.following.length}<span> Following</span></div>
        </li>
        <li className="flex flex-col items-center justify-between">
            <svg className="w-4 fill-current text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path
                    d="M7 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1c2.15 0 4.2.4 6.1 1.09L12 16h-1.25L10 20H4l-.75-4H2L.9 10.09A17.93 17.93 0 0 1 7 9zm8.31.17c1.32.18 2.59.48 3.8.92L18 16h-1.25L16 20h-3.96l.37-2h1.25l1.65-8.83zM13 0a4 4 0 1 1-1.33 7.76 5.96 5.96 0 0 0 0-7.52C12.1.1 12.53 0 13 0z" />
            </svg>
            <div>{currentUser && currentUser.followers.length}
            <span> Followers</span>
            </div>
        </li>
        <li className="flex flex-col items-center justify-around">
            <svg className="w-4 fill-current text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path
                    d="M9 12H1v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-8v2H9v-2zm0-1H0V5c0-1.1.9-2 2-2h4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v6h-9V9H9v2zm3-8V2H8v1h4z" />
            </svg>
            <div>{currentUser && currentUser.posts.length}
            <span> Posts</span>
            </div>
        </li>
    </ul>
    


</div>} */}

<h1>Hello {username}</h1>

    </>
  )
}

export default UserProfile;