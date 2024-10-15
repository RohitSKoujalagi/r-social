import React, { useEffect,Suspense } from 'react'
import { useUsers } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import PostsCard from './PostsCard';
import ProfilesSkeleton from './ProfilesSkeleton';
import {useParams} from 'react-router-dom'
const MyPosts = (user) => {

  let {currentUser}=useAuth();    
  let {handleLike,userArray}=useUsers();

  let {username}=useParams();

  
    // let currecurrentUser
  return (
    <>

    <h1 className='text-center text-3xl font-mono text-blue-800 mt-1 '> Posts</h1>
    <div className='flex flex-col flex-wrap  justify-start gap-x-1.5 gap-y-1.5 m-0 p-0 duration-800'>
        
        {
          
          (user.user==="all")?
          userArray && userArray.map((value, index, array) => {
            if (value?.posts?.length === 0) {
              return (
                ""
              );
            } else {
              return value?.posts?.map((val, ind) => {
                // ////console.log(val);
                return (
                  <Suspense key={ind} fallback={<ProfilesSkeleton/>}>

                    <PostsCard key={ind} post={val} />
                  </Suspense>
                  // <h1>{val?.posts?.title}</h1>

                );
              });
            }
          })
        :(user.user==="me")?
        userArray && userArray.map((value, index, array) => {
          if (value.uid===currentUser?.uid) {

            if(value?.posts?.length===0)
            {

              return (
                ""
              );
            }
            else
            {
              return value?.posts?.map((val, ind) => {
                // ////console.log(val);
                return (
                  <Suspense fallback={<ProfilesSkeleton/>}>
                    <PostsCard key={ind} post={val} />
                  </Suspense>
                  // <h1>{val?.posts?.title}</h1>

                );
              })
            }

          }

        }):
        <>
            {userArray && userArray.map((value, index, array) => {
              //console.log(value.username===username);
              
              
              if(value.username===username) {
              return value?.posts?.map((val, ind) => {
                // ////console.log(val);
                return (
                  <Suspense key={ind} fallback={<ProfilesSkeleton/>}>

                    <PostsCard key={ind} post={val} />
                  </Suspense>
                  // <h1>{val?.posts?.title}</h1>

                );
              });
            }
          })}
        </>

        
          
        }


        
         </div>
    </>
  )
}

export default MyPosts;