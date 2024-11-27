import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider,useParams } from 'react-router-dom'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import Profile from './components/Profile.jsx'
import ComplexNavbar from './components/ComplexNavbar.jsx'
import { Bounce, Flip, Slide, ToastContainer, Zoom, toast } from 'react-toastify';
import Comment from './components/Comment.jsx'

import { createContext, useContext, useState } from "react";
import AuthContextProvider from './context/AuthContext.jsx'
import Loading from './components/Loading.jsx'
import UserContextProvider from './context/UserContext.jsx'
import PageNotFound from './components/PageNotFound.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import FirstLoginForm from './components/FirstLoginForm.jsx'
import UserProfile from './components/UserProfile.jsx'
import FollowingList from './components/FollowingList.jsx'
import FollowerList from './components/FollowerList.jsx'
import AddPost from './components/AddPost.jsx'
import MyPosts from './components/MyPosts.jsx'
import SearchPage from './components/SearchPage.jsx'
import LiveStream from './components/LiveStream.jsx'
import Live from './components/Live.jsx'




const router = createBrowserRouter([
  {
    path: "/r-social/",
    element:
      <>
      <ProtectedRoute>
      <ComplexNavbar/>          
        <App />

      </ProtectedRoute>
      </>,
  },
        {
          path: "/r-social/firstLogin",
          element:          
            <FirstLoginForm />
          ,
        },
        {
          path: "/r-social/setting",
          element: <>
          <ProtectedRoute>
      
            Not yet made
          </ProtectedRoute>
            </>,
        },
        {
          path: "/r-social/profile",
          children:
            [
              {
                path:":username",
                element:<>
                <ProtectedRoute>              
                <ComplexNavbar/>
                <Profile />
                </ProtectedRoute>  
                </>

              }
            ]
        },

        {
          path:"/r-social/profile/me/following",
          element:<>
          <ProtectedRoute>

          <ComplexNavbar/>
          <FollowingList/>
          </ProtectedRoute>
          </>
        },
        {
          path:"/r-social/profile/posts",
          element:<>
          <ProtectedRoute>

          <ComplexNavbar/>
          <MyPosts user="all"/>
          </ProtectedRoute>
          </>
        },
        {
          path:"/r-social/profile/me/posts",
          element:<>
          <ProtectedRoute>

          <ComplexNavbar/>
          <MyPosts user="me"/>
          </ProtectedRoute>
          </>
        },
        {
          path:"/r-social/profile/:username/following",
          element:<>
          <ProtectedRoute>

          <ComplexNavbar/>
          
          <FollowingList/>
          </ProtectedRoute>
          </>
        },
        {
          path:"/r-social/profile/:username/posts",
          element:<>
          <ProtectedRoute>

          <ComplexNavbar/>
          
          <MyPosts user="specific"/>
          </ProtectedRoute>
          </>
        },
        {
          path:"/r-social/profile/:username/followers",
          element:<>
          <ProtectedRoute>

          <ComplexNavbar/>
          <FollowerList/>          
          </ProtectedRoute>
          </>
        },
        {
          path:"/r-social/profile/:username/goLive",
          element:<>
          <ProtectedRoute>

          <ComplexNavbar/>
          <LiveStream/>          
          </ProtectedRoute>
          </>
        },
        {
          path:"/r-social/live",
          element:<>
          
          <ComplexNavbar/>
          <Live/>          
          
          </>
        },
        {
          path:"/r-social/search",
          element:<>
          <ProtectedRoute>
          
          <ComplexNavbar/>
          <SearchPage/>          
          </ProtectedRoute>
          </>
        },
      
 

  {
    path: "/r-social/register",
    element: <>
    
      
     <ComplexNavbar/>          
    
    <Register />
    
    
</>,
  },

  {
    path: "/r-social/post",
    element: <>
    <ProtectedRoute>
      <ComplexNavbar/>
     <AddPost/>         
    
    </ProtectedRoute>
    
</>,
  },
  

  {
    path: "/r-social/login",
    element: <>
      

      <ComplexNavbar/>          
      <Login />
      
      
</>,
  },
  
  {
    path: "*",
    element: <>
      <PageNotFound />
    </>
  }
]);


createRoot(document.getElementById('root')).render(
  

  <>

    <AuthContextProvider>
      <UserContextProvider>
        
         
          
          <RouterProvider router={router} />
          <ToastContainer />
        
      </UserContextProvider>
    </AuthContextProvider>


  </>
   
)
