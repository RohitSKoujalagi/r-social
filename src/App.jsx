import { useState,useEffect,Suspense,lazy, useCallback } from 'react'
import './App.css'
import Register from './components/Register'
import ComplexNavbar from './components/ComplexNavbar'
import { useAuth } from './context/AuthContext'
import { getFirestore, doc, setDoc, addDoc, collection ,getDocs,query} from "firebase/firestore";
const ProfileCards = lazy(() => import("./components/ProfileCards"));
// import ProfileCards from './components/ProfileCards'
import { useUsers } from './context/UserContext'
import MyPosts from './components/MyPosts'
import Loading from './components/Loading'
import ProfilesSkeleton from './components/ProfilesSkeleton'
import {Outlet} from 'react-router-dom'
// const MyPosts = lazy(() => import("./components/MyPosts"));

 function App() {
  // const [userArray,setUserArray]=useState([])
  // const {db} =useAuth();
  // const [isLoading, setIsLoading] = useState(true);

  const {userArray,setUserArray,getUsers,isFollowing,setIsFollowing,uzerFollowObj,setPostsLoaded,postsLoaded,transformCloudinaryURL} =useUsers();

  const {currentUser}=useAuth()

useEffect(()=>{

  // console.log(currentUser);
  
 currentUser && userArray && userArray.map((val,ind,arr)=>{
    if(val.uid===currentUser?.uid)
    {
      setIsFollowing(val.following);
      
      return; 
    }

    // //console.log(currentUser?.username);
    
  }) 
},[currentUser])//change madi ille


 


  return (
    <>

     <div className='flex flex-wrap flex-row justify-around gap-x-1.5 gap-y-1.5 m-0 p-0 duration-800 '>
    {
     userArray && userArray?.map((value,index,array)=>
      <>
       { (currentUser?.uid!==value.uid) &&  <Suspense fallback={<ProfilesSkeleton/>}>
     
         { (value.username!=="") && <ProfileCards key={index} username={value.username } followers={ value.followers?.length } following={ value.following?.length } userBio={value.bio } userPic={transformCloudinaryURL(value.profilePictureURL)} userUID={value.uid} isFollowing={isFollowing}  /> }      
        </Suspense>
      }
        </ >
        

      )
    }
    </div> 
     
    
    {postsLoaded && <>
    <hr className='  my-8  h-0.5 bg-slate-400 w-3/4 mx-auto' />
    <MyPosts user="all"/>
     </>}

      
    </>
  )
}

export default App;
