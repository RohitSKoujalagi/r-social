import React,{Suspense, useEffect,useState} from 'react'
import { useUsers } from '../context/UserContext'
import { useAuth } from '../context/AuthContext'
import ProfilesSkeleton from './ProfilesSkeleton'
import ProfileCards from './ProfileCards'
import {useParams,useLocation} from 'react-router-dom'
const FollowingList = () => {

    let {isFollowing,userArray,setUsersIsFollowing,isUsersFollowing,userFollow,transformCloudinaryURL}=useUsers();

    let {currentUser}=useAuth();
    const location = useLocation();
    
  const pathname = location.pathname; 



      const match = pathname.match(/\/profile\/(.*)\/following$/);
      const extractedMe = match ? match[1] : null;
      //console.log(extractedMe);




  return (
    <>
    <h1 className='text-center text-3xl font-mono text-blue-800 mt-2 '>Following</h1><br />
     <div className='flex flex-wrap flex-row justify-around gap-x-1.5 gap-y-1.5 m-0 p-0 duration-800 '>

      {
        (extractedMe==="me")?
        <>
        {

        userArray && userArray.map((value, index) => {
          if (value.followers.includes(currentUser?.uid))
             {
           
            return <ProfileCards key={index} username={value.username } followers={ value.followers.length } following={ value.following.length } userBio={value.bio } userPic={transformCloudinaryURL(value.profilePictureURL)} userUID={value.uid} isFollowing={isFollowing}  /> ;
          } 
          else {
            return null;
          }
        })
        }
        </>:
        <>
        {
            userArray && userArray.map((value, index) => {
              const matchingUser = userArray.find((user) => user.username === extractedMe.replace("%20"," "));

              if (matchingUser && value.followers.includes(matchingUser.uid))
              {
                
                return <ProfileCards key={index} username={value.username } followers={ value.followers.length } following={ value.following.length } userBio={value.bio } userPic={transformCloudinaryURL(value.profilePictureURL)} userUID={value.uid} isFollowing={isFollowing}  /> ;
              } 
              else {
                // //console.log(getUidByName(extractedMe))

                return null;
              }
            })
        }
        </>
      }      
    
    </div>   
    
    </>
  )
}

export default FollowingList