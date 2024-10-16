import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React,{useEffect, useState} from 'react'
import { useAuth } from '../context/AuthContext'
import {NavLink,Navigate, useNavigate} from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";
import { useUsers } from '../context/UserContext';
// import React,{useEffect} from 'react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}



export default function ComplexNavbar() {

  // const [localUser,setLocalUser]=useState(null);
  const navigate=useNavigate()
;
  const {logoutUzer,currentUser,setCurrentUser}=useAuth();
  const {transformCloudinaryURL}=useUsers();
  
  const navigation = [
    { name: 'Home', href: '/r-social/',show:(currentUser)?true:false},
    { name: 'Register', href: '/r-social/register',show:(currentUser)?false:true },
    { name: 'Sign in', href: '/r-social/login',show:(currentUser)?false:true },
    { name: 'Profile', href: '/r-social/profile/me',show:(currentUser)?true:false },
    { name: 'Post', href: '/r-social/post',show:(currentUser)?true:false },
    { name: 'Posts', href: '/r-social/profile/posts',show:(currentUser)?true:false },
  ]
  function logOut(){
    logoutUzer();
    // localStorage.setItem("user",null)
    setCurrentUser(null);///////
    navigate("/r-social/login")
  }


  const srcSetter=()=>{
    if(currentUser)
    {
      if(currentUser?.profilePictureURL)


      
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


  useEffect(()=>{
      //console.log(currentUser);
      
      
    
  },[currentUser])

  return (
    <Disclosure as="nav" className="bg-gray-800 top-0 right-0 left-0  ">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 ">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center font-mono text-white text-4xl">
              {/* <img
                alt="Your Company"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              /> */}
             <NavLink to={"/r-social/"}>R-Social</NavLink> 
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  
                  return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={
                        ({ isActive }) =>
                          classNames(
                            'rounded-md px-3 py-2 text-sm font-medium',(item.show)?"":"hidden ",
                            isActive ? 'bg-gray-900 text-cyan-500' : 'text-white hover:bg-gray-700 hover:text-white'
                          )
                    }
                  >
                  {item.name}
                  </NavLink>
                  )
})}

              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <NavLink to={"/r-social/search"}>
            <button
              type="button"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 mx-1 focus:ring-white focus:ring-offset-1 focus:ring-offset-gray-800"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Search</span>
              <IoSearchOutline size={25}/>
            </button>
            </NavLink>
            {/* <button
              type="button"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="h-6 w-6" />
            </button> */}

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              {currentUser && <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none ring-2 ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                   <img
                    
                    src={srcSetter()}
                    alt="User Profile"
                    className="h-8 w-8 rounded-full"
                  />
                </MenuButton>
              </div>}
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-in-out data-[leave]:ease-in"
              >
                <h1 className='text-blue-700 font-mono p-2 ml-2'>{currentUser && (currentUser?.username?.toUpperCase() || currentUser?.displayName?.toUpperCase())}</h1>
                <MenuItem>
                  <NavLink to={"/r-social/profile/me"} className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Your Profile
                  </NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink onClick={()=>{
                    (confirm("Do you wanna LOGOUT? "))? logOut():null;
                  }}  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Sign out
                  </NavLink>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {/* {currentUser && currentUser.username} */}
          {navigation.map((item) => {
            return (<NavLink
              key={item.name}
              as="NavLink"
              to={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={
                ({ isActive }) =>
                  classNames(
                    'block rounded-md px-3 py-2 text-base font-medium hover:cursor-pointer',(item.show)?"":"hidden ",
                    isActive ? 'bg-gray-900 text-cyan-300' : 'text-white hover:bg-gray-700 hover:text-white'
                  )
              }
            >
              <DisclosureButton>{item.name}</DisclosureButton>
            </NavLink>)
          })}
          
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
