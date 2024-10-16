import React,{useEffect,Suspense, useState, useCallback} from 'react'
import { useAuth } from '../context/AuthContext';
// import {currentUser} from '../context/AuthContext'
import ProfilePlaceholder from '../assets/ProfilePlaceholder.webp'
import { getFirestore, doc, setDoc, addDoc, collection,getDocs,query,where } from "firebase/firestore";

import {useNavigate,Outlet, useParams,NavLink} from 'react-router-dom'
import {useUsers} from '../context/UserContext'
import FirstLoginForm from './FirstLoginForm';
import MyPosts from './MyPosts';


function Profile() {
  const {currentUser,db} =useAuth();
  // const userCount=[];
  let {username}=useParams();
  const navigate=useNavigate();

  const [userDetail,setUserDetail]=useState({});
  const [showPosts,setShowPosts]=useState(false);
  const [userType,setUserType]=useState();

  
  const {isFirstLogin,
    setIsFirstLogin,getUserDetailsById,getUsers,userArray,isFollowing,getValueByKey,setDisplayUser,displayUser,setIsFollowing,transformCloudinaryURL}=useUsers();


    const handlePosts=() => { 
      if(username==="me")
      {
        setUserType("me");
        setShowPosts((val)=>!val);
      }
      else
      {
        setUserType("specific");
        setShowPosts((val)=>!val);


      }
     }

    

    useEffect(() => {
      
       userArray?.forEach((obj) => {
        if(username===obj["username"])
          {            
            setUserDetail(obj);
            
            ////console.log("Mount"); 
          }
      });
    
    }, [userArray])


    
      


  const srcSetter=()=>{
    if(currentUser)
    {
      if(currentUser.profilePictureURL)
      {
        return transformCloudinaryURL(currentUser.profilePictureURL);
      }
      else{
        return "https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg"
      }
    }
    else{
        return "https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg"
    }
  }

  function handleProfileEdit(){
    navigate("/r-social/firstLogin")
  }


  useEffect(()=>{
    getValueByKey(userArray,currentUser?.uid);
    //console.log(isFollowing);

  },[])

  return (
    <> 
         
       

<div className='h-full overflow-hidden  flex    bg-slate-500'>

{(isFirstLogin && username==="me")?<FirstLoginForm/>:
<div
    className="max-w-2xl border-2 border-cyan-100  mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900 mb-10">
    <div className="rounded-t-lg h-32 overflow-hidden">
      
        <img className="object-cover object-top w-full" src='https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='Mountain'/>
    </div>
    <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
        <img  className="object-cover object-center h-32" src={(username==="me")?srcSetter():userArray && userDetail.profilePictureURL} alt='Baingan Pic'/>
        
       
    </div>
    <div className="text-center mt-2">

        <h2 className="font-semibold">{(username==="me")?(currentUser && currentUser.username):userDetail.username}</h2>
        <p className="text-gray-500">{(username==="me")?(currentUser && currentUser.bio):userDetail.bio}</p>
    </div>
    <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
        <li className="flex flex-col items-center justify-around">
        <NavLink to={`/r-social/profile/${username}/following`}>
            <svg className="w-4 fill-current text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path
                    d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            </NavLink>
            {/* {(username==="me")?(currentUser && getValueByKey(userArray,"followers")):getUserByKey(userArray,username,"followers").length 
            } */}
            <div>{(username==="me")?(currentUser && currentUser.following?.length):userArray && userDetail?.following?.length}<span> Following</span></div>
        </li>

        <li className="flex flex-col items-center justify-between">
            <NavLink to={`/r-social/profile/${username}/followers`}>
            <svg className="w-4 fill-current text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path
                    d="M7 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1c2.15 0 4.2.4 6.1 1.09L12 16h-1.25L10 20H4l-.75-4H2L.9 10.09A17.93 17.93 0 0 1 7 9zm8.31.17c1.32.18 2.59.48 3.8.92L18 16h-1.25L16 20h-3.96l.37-2h1.25l1.65-8.83zM13 0a4 4 0 1 1-1.33 7.76 5.96 5.96 0 0 0 0-7.52C12.1.1 12.53 0 13 0z" />
            </svg>
            </NavLink>
            <div>{(username==="me")?(currentUser && currentUser.followers?.length):userArray && userDetail?.followers?.length}
            <span> Followers</span>
            </div>
        </li>
        <li className="flex flex-col items-center justify-around">
          <button onClick={handlePosts}>

            <svg className="w-4 fill-current text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path
                    d="M9 12H1v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-8v2H9v-2zm0-1H0V5c0-1.1.9-2 2-2h4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v6h-9V9H9v2zm3-8V2H8v1h4z" />
            </svg>
          </button>
            <div>{(username==="me")?(currentUser?.posts?.length):(userArray && userDetail?.posts?.length)}
            <span> Posts</span>
            </div>
        </li>
    </ul>
    {username==="me" && <div className="p-4 border-t mx-8 mt-2">
        <div className="p-4  rounded-lg flex items-center justify-center">
        <button onClick={handleProfileEdit} className="  mx-auto rounded-full bg-blue-700 hover:shadow-lg font-semibold text-white px-6 py-2 flex items-center">
  Edit Profile
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current ml-2" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
    <path d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z"></path>
  </svg>
</button>
    </div>
    </div>
}

</div>}

</div>
{
  showPosts && <MyPosts user={userType}/>
}

    </>
  )
}

export default Profile