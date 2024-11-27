import React from 'react'
// import {} from 'firebase/firestore'
import { useUsers } from '../context/UserContext'
import { NavLink } from 'react-router-dom';

function Live() {


  const {userArray,setUserArray} =useUsers();

  return (
    <>
    <h1 className='text-3xl text-center text-blue-600'>Live sessions going on</h1>

    {
      userArray && userArray.map((val,ind,arr)=>{
        if(val.roomID!=="" )
        {
            return(<NavLink>
              {
                val.roomID
              }
            </NavLink>)
        }
        // return(<NavLink>
        //   {
        //     val.username
        //   }
        // </NavLink>)
      })
    }
    </>
  )
}

export default Live