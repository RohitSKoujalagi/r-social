import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useUsers } from '../context/UserContext'
import { NavLink } from 'react-router-dom';
const ProfileCards = ({userBio,username,followers,following,userPic,userUID,isFollowing,setFlag,flag}) => {

    const {setIsFollowing,handleFollow,uzerFollowArray,uzerFollowObj}=useUsers();
    const [userFollow,setUserFollow]=useState(followers);
    
    const {currentUser}=useAuth();

    const truncate = (str, maxLength) => {
        if (str.length <= maxLength) return str;
        return str.slice(0, maxLength) + '...';
      };
  return (
    <>
    <div className={`h-auto pt-6 mt-2  items-stretch `}>

    <div className="max-w-sm  mx-auto bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2 hover:shadow-blue-300">
        <div className="border-b px-4 pb-6">
            <div className="text-center my-4">
                <NavLink to={`/r-social/profile/${username}`}>
                <img className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4"
                    src={userPic || "https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg"} alt="Profile Pic"/>
                    </NavLink>
                <div className="py-2">
                    <h3 className="font-bold text-2xl text-gray-800 dark:text-white mb-1">{truncate(username,20)}</h3>
                    <div className="inline-flex text-gray-700 dark:text-gray-300 items-center">
                        <svg className="h-5 w-5 text-gray-400 dark:text-gray-600 mr-1" fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path className=""
                                d="M5.64 16.36a9 9 0 1 1 12.72 0l-5.65 5.66a1 1 0 0 1-1.42 0l-5.65-5.66zm11.31-1.41a7 7 0 1 0-9.9 0L12 19.9l4.95-4.95zM12 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                        </svg>
                        {truncate(userBio,28)}
                    </div>
                </div>
            </div>
            <div className="flex gap-2 px-2">
                <button
                    
                    onClick={(e)=>{
                        handleFollow(e.target.value);
                        // setFlag((val)=>!val);
                        
                    }}
                    value={userUID}
                    className={`flex-1 rounded-full bg-blue-600 dark:bg-blue-800 text-white dark:text-white antialiased font-bold hover:bg-blue-800 dark:hover:bg-blue-900 px-4 py-2 ${(currentUser.username===username)?" invisible ":""}`  }>
                    {(isFollowing?.includes(userUID))?"Following":"Follow"}
                    
                
                </button>
               
                {/* <input type="hidden" value={userUID} name="followBtn" /> */}
                {/* <button
                disabled={true}  
                    className="flex-1 rounded-full border-2 border-gray-400 dark:border-gray-700 font-semibold text-black dark:text-white px-4 py-2">
                    Message
                </button> */}
            </div>
        </div>
        <div className="px-4 py-4">
            <div className="flex gap-2 items-center text-gray-800 dark:text-gray-300 mb-4">
            <NavLink to={`/r-social/profile/${username}/followers`}>
                <svg className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path className=""
                        d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2z" />
                </svg>
                    </NavLink>
                <span><strong className="text-black dark:text-white">{followers}</strong> Followers </span>
                <NavLink to={`/r-social/profile/${username}/following`}>
                <svg className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path className=""
                        d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2z" />
                </svg>
                </NavLink>
                <span><strong className="text-black dark:text-white">{following}</strong> Following </span>
            </div>
            {/* <div className="flex">
                <div className="flex justify-end mr-2">
                    <img className="border-2 border-white dark:border-gray-800 rounded-full h-10 w-10 -mr-2"
                        src="https://randomuser.me/api/portraits/men/32.jpg" alt=""/>
                    <img className="border-2 border-white dark:border-gray-800 rounded-full h-10 w-10 -mr-2"
                        src="https://randomuser.me/api/portraits/women/31.jpg" alt=""/>
                    <img className="border-2 border-white dark:border-gray-800 rounded-full h-10 w-10 -mr-2"
                        src="https://randomuser.me/api/portraits/men/33.jpg" alt=""/>

                    <span
                        className="flex items-center justify-center bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white font-semibold border-2 border-gray-200 dark:border-gray-700 rounded-full h-10 w-10">
                        +69
                    </span>
                </div>
            </div> */}
        </div>
    </div>

</div>

    </>
  )
}

export default ProfileCards