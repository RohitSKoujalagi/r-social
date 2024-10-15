import React, { useState,useEffect,useRef } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineCamera } from "react-icons/ai"; 
import { FiUpload } from "react-icons/fi";
import {ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
// import {firebase} from 'firebase/storage'
// import firebase from 'firebase/app';
// Import camera icon from react-icons
import { useAuth } from '../context/AuthContext';
import { getFirestore, doc, updateDoc,collection,query,where,getDocs} from "firebase/firestore"; 
import Loading from "./Loading";
import axios from "axios";
import { Cloudinary } from "cloudinary-core";
import { useUsers } from "../context/UserContext";
import {useNavigate} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { storage } from "../../utils/init-firebase";


export default function AddPost() {
  const navigate=useNavigate();
  const { register, handleSubmit, formState: { errors,isSubmitting,isSubmitted } } = useForm();
  const [progress,setProgress]=useState("0%")
  const [mediaURL, setMediaURL] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [imgURL, setPostMediaURL] = useState("");
  const [mediaType,setMediaType]=useState(null);
  const [file,setFile]=useState(null);
  const videoRef = useRef(null);


  const cloudinaryCore = new Cloudinary({ cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME });

  const {currentUser,registerUzer,loginWithProvider,setCurrentUser,db,isFirstLogin}=useAuth();

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

  const {setIsFirstLogin}=useUsers()
  const srcSetter=()=>{
    if(currentUser)
    {
      if(currentUser.mediaURLtureURL)
      {
        return transformCloudinaryURL(currentUser.mediaURLtureURL);
      }
      else{
        return "https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg"
      }
    }
    else{
        return "https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg"
    }
  }

  // const storeInPosts

  const uploadImageToCloudinary = async (file) => {
    const cloudinaryURL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append("file", file); // The actual image file
    formData.append("upload_preset", "userProfile");

    try {
      const response = await axios.post(cloudinaryURL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      ////console.log("Cloudinary Response:", response.data);
      return response.data.secure_url; // Return the uploaded image URL
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      throw error;
    }
  };

  const uploadVideo = async(file,pid,data) => {
    const storageRef =  ref(storage,`posts/${currentUser.uid}/${pid}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.ceil(progress));
        //console.log('Upload progress:', progress)
      },
      (error) => {
        console.error('Error  uploading video:', error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          //console.log('File available at', downloadURL);

          const postData =  {
            posts: [...currentUser.posts,
              {
                pid:pid,
                title:data.title,
                desc:data.desc,
                mediaURL:downloadURL,
                type:mediaType,
                comments:[],
                postURL:`http://localhost:5173/${currentUser.username}/posts/${data.title}`,
                likes:[],
                uid:currentUser.uid,
                

              }
            ],

          };
          addPost(currentUser.uid,postData,data,downloadURL);

        });
      }
    );
  };
  //Store in users DB
  const addPost = async (uid, postData,data,uploadedImageUrl) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnapshot) => {
          const userDocRef =  doc(db, "users", docSnapshot.id);;
          await updateDoc(userDocRef, postData).then(()=>{
            const updatedUser={
              ...currentUser, 
              
               posts: postData.posts
    
              
            }
          // localStorage.setItem("user",JSON.stringify(updatedUser))

          }).catch((err)=>{
            console.error(err)
          });
          ////console.log("User updated successfully!");
          navigate("/r-social/profile/me")
        });
      } 
      else {
        ////console.log("No user found with the provided UID.");
      }
  
      ////console.log("User updated successfully!");
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  };

  const onSubmit = async(data) => {
    //console.log(data);
    setUploadStatus("Uploading...");
    if (mediaURL) {
      try {
        setUploadStatus("Uploading...");
        let pid=uuidv4();
        if(mediaType==="image")
        {

          const uploadedImageUrl = await uploadImageToCloudinary(imgURL);
          ////console.log("Image uploaded to Cloudinary at:", uploadedImageUrl);
  
          setUploadStatus("Upload successful!");
          // const uid = currentUser.uid; 
          const postData =  {
            posts: [...currentUser.posts,
              {
                pid:pid,
                title:data.title,
                desc:data.desc,
                mediaURL:transformCloudinaryURL(uploadedImageUrl),
                type:mediaType,
                comments:[],
                postURL:`http://localhost:5173/${currentUser.username}/posts/${data.title}`,
                likes:[],
                uid:currentUser.uid,
                

              }
            ],

          };
          addPost(currentUser.uid, postData,data,uploadedImageUrl);
  
          // const updatedUser = {
          //   ...currentUser, // Spread the current user details
          //   username: data.username,
          //   bio: data.bio,
          //   mediaURLtureURL: uploadedImageUrl
          // };
          // //console.log(updatedUser)
        }

        else{
          

          uploadVideo(file,pid,data);
          
        }
      // localStorage.setItem("user",JSON.stringify(updatedUser))
        // Update the state with the modified user data
        // setCurrentUser(updatedUser);
        // setIsFirstLogin(false);

      } catch (error) {
        setUploadStatus("Upload failed");
        console.error("Error uploading the image:", error);
      }
    } else {
      alert("Please select an image to upload");
    }

      
    // Example usage:
    //console.log(currentUser)
    
  };

  const handlePostMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024; // Size in MB
      const fileType = file.type;
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "video/mp4"];
      //console.log(file);

      if(fileType ==="image/jpg" || fileType ==="image/jpeg" || fileType ==="image/png" )
      {
        setMediaType("image");
      }
      else if(fileType ==="video/mp4")
      {
        setMediaType("video");
      }
      else
      {
        setMediaType(null);
      }

      if (fileSize > 10) {
        alert("File size exceeds 10MB");
        e.target.value = null; // Reset input value
        return;
      }
      if (!allowedTypes.includes(fileType)) {
        alert("File format not allowed. Please upload a JPG, JPEG, PNG, or MP4 file.");
        e.target.value = null; // Reset input value
        return;
      }

      const mediaURL = URL.createObjectURL(file);
      setPostMediaURL(file);
      setFile(file);
      setMediaURL(mediaURL);
      //console.log(mediaURL);
      
    }
  };


  useEffect(() => {

    if(mediaType==="video")
    {

      const timeoutId = setTimeout(() => {
        videoRef.current.play();
      }, 2000); // 2000 milliseconds = 2 seconds
      return () => clearTimeout(timeoutId);
    }

  }, [file]);
  

  return (
    <div className="max-w-md mx-auto bg-orange-100 border-blue-700 shadow-lg rounded-lg p-6 mt-10 border-2">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">Post</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Username Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            {...register("title", { required: true,minLength:{
              value:2,message:"Title must have atleast 2 characters"
            },maxLength:{
              value:120,
              message:"Password must have maximum 120 characters"
            } })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        <br/>
        {/* Profile Picture Input */}
        <div className="relative w-32 h-32 mx-auto">
          <label className="block text-sm font-medium text-gray-700 text-center mb-2">Image/Video</label>
          <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg mx-auto">

              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                {/* <AiOutlineCamera size={40} /> */}
                
              {(mediaURL)?(mediaType==="image")?<img
                src={mediaURL}
                alt="Post Preview"
                className="w-full h-full object-cover rounded-full"
              />:"":
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                {/* <AiOutlineCamera size={40} /> */}
              <FiUpload size={40} color="blue"/>

              </div>}
           
                
              
            

            {/* Hover effect with Camera Icon */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
              {/* <AiOutlineCamera size={40} className="text-white" /> */}
              <FiUpload color="white" size={40}/>
              <input
                type="file"
                accept="image/jpeg, image/png, image/jpg, video/mp4"
                {...register("postMedia", { required: false })}
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handlePostMediaChange}
              />
            </div>
          </div>
          {/* {errors.postMedia && <p className="text-red-500 text-sm mt-1">Post Medi is required</p>} */}
        </div>
        </div>
        <div className="text-center p-4   shadow-blue">
          
        {(file && mediaType==="video" && mediaURL)?<><p className="">Video Preview</p>
          <video ref={videoRef} className="rounded-md shadow-2xl shadow-slate-500" controls  preload="true" loop  src={mediaURL} > </video>
        </>:""}
        </div>
        
              <br/><br/>
        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register("desc", { required: false, maxLength: 200 })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder={"Tell us about the post (Max 200 characters)"}
            rows="3" 
          />
          {/* {errors.bio && <p className="text-red-500 text-sm mt-1">Bio is required (Max 200 characters)</p>} */}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-mono`}
        >
          Post <span>{isSubmitting && <Loading type="spin" color="white" height="20%" width="20%"/>}</span>
        </button>
      </form>
      {uploadStatus && <p className="text-center text-3xl text-green-400">{uploadStatus}</p>}

      {
        uploadStatus && progress && <p className="text-center text-3xl text-green-700">{progress}%</p>
      }
    </div>
  );
}
