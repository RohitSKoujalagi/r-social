import React,{Suspense, useEffect,useState} from 'react'
import { useUsers } from '../context/UserContext'
import { useAuth } from '../context/AuthContext'
import ProfilesSkeleton from './ProfilesSkeleton'
import ProfileCards from './ProfileCards'
import {useParams,useLocation} from 'react-router-dom'

const FollowerList = () => {

    let {isFollowing,userArray,setUsersIsFollowing,isUsersFollowing,userFollow}=useUsers();

    let {currentUser}=useAuth();
    const location = useLocation();
    
  const pathname = location.pathname; 
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


      const match = pathname.match(/\/profile\/(.*)\/followers$/);
      const extractedMe = match ? match[1] : null;
    //   //console.log(extractedMe);




  return (
    <>
    <h1 className='text-center text-3xl font-mono text-blue-800 mt-2 '>Followers</h1><br />
     <div className='flex flex-wrap flex-row justify-around gap-x-1.5 gap-y-1.5 m-0 p-0 duration-800 '>

      {
        (extractedMe==="me")?
        <>
        {

        userArray && userArray.map((value, index) => {
          if (value.following.includes(currentUser?.uid))
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

              if (matchingUser && value.following.includes(matchingUser.uid))
              {
                //console.log(value.username);
                
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

export default FollowerList