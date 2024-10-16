import React, { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineCamera } from "react-icons/ai"; // Import camera icon from react-icons
import { useAuth } from '../context/AuthContext';
import { getFirestore, doc, updateDoc,collection,query,where,getDocs} from "firebase/firestore"; 
import Loading from "./Loading";
import axios from "axios";
import { Cloudinary } from "cloudinary-core";
import { useUsers } from "../context/UserContext";
import {useNavigate} from 'react-router-dom';
import { useDebounce } from "./Debounce";


export default function SocialMediaForm() {
  const navigate=useNavigate();
  const { register, handleSubmit, formState: { errors,isSubmitting,isSubmitted } } = useForm();
  const [profilePic, setProfilePic] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [imgURL, setImgURL] = useState("")
  const [loading,setLoading]=useState(false);

  const cloudinaryCore = new Cloudinary({ cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME });

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm);
  const [show,setShow]=useState(false);
  const [exists,setExists]=useState(false);



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
  
  const updateUserData = async (uid, updatedData,data,uploadedImageUrl) => {
    try {
      // Reference to the user's document by UID
      const usersRef = collection(db, "users");
      // //console.log(usersRef)
      const q = query(usersRef, where("uid", "==", uid));
      // //console.log(q)
      const querySnapshot = await getDocs(q);
      // const wantedPhoto=await uploadResource(profilePic)
      // Update the user's data with updatedData
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnapshot) => {
          // Get document ID and update the document
          const userDocRef =  doc(db, "users", docSnapshot.id);;
          await updateDoc(userDocRef, updatedData).then(()=>{
            const updatedUser={
              ...currentUser, // Spread the current user details
              username: data.username,
              bio: data.bio,
              profilePictureURL: uploadedImageUrl
            }
          localStorage.setItem("user",JSON.stringify(updatedUser))

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
    if (profilePic) {
      try {
        setUploadStatus("Uploading...");
        const uploadedImageUrl = await uploadImageToCloudinary(imgURL);
        ////console.log("Image uploaded to Cloudinary at:", uploadedImageUrl);

        setUploadStatus("Upload successful!");
        const uid = currentUser.uid; // Replace with the actual user's UID
        const updatedData =  {
          username: data.username,
          bio: data.bio,
          profilePictureURL: uploadedImageUrl, // Add any fields you want to update
        };
        updateUserData(uid, updatedData,data,uploadedImageUrl);

        const updatedUser = {
          ...currentUser, // Spread the current user details
          username: data.username,
          bio: data.bio,
          profilePictureURL: uploadedImageUrl
        };
        //console.log(updatedUser)
      // localStorage.setItem("user",JSON.stringify(updatedUser))
        // Update the state with the modified user data
        // setCurrentUser(updatedUser);
        setIsFirstLogin(false);

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

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024; // Size in MB
      const fileType = file.type;
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      //console.log(file)

      if (fileSize > 3) {
        alert("File size exceeds 3MB");
        e.target.value = null; // Reset input value
        return;
      }
      if (!allowedTypes.includes(fileType)) {
        alert("File format not allowed. Please upload a JPG, JPEG, or PNG file.");
        e.target.value = null; // Reset input value
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setImgURL(file)
    setProfilePic(imageUrl);
    }
  };


  useEffect(() => {
    const checkUsername = async () => {
      if (!searchTerm) return; // skip query if input is empty
      setLoading(true);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', searchTerm));
      
      try {
        const querySnapshot = await getDocs(q);
        setExists(!querySnapshot.empty);
      } catch (error) {
        console.error("Error checking username: ", error);
        setExists(false);
      } finally {
        setLoading(false);
      }
    };

    checkUsername();
  }, [debouncedSearch, db]);
  

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10 border-2">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Profile</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
          required={true}
          value={searchTerm}
          onInput={(e) => {
            // console.log(e.target.value);
            
            setSearchTerm(e.target.value);
            if(e.target.value==="")
            {
              setShow(false);
            }
          }}
            type="text"
            {...register("username", { required: true,minLength:{
              value:3,message:"Username must have atleast 3 characters"
            },maxLength:{
              value:18,
              message:"Username must be atmost 18 characters"
            } })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Your username"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          {loading && <p>Checking Username...</p>}

          {(exists)?
          (debouncedSearch!=="")?
          <p className="text-red-500 text-sm mt-1">Username "{debouncedSearch}" already exists</p>:"":
          (debouncedSearch!=="")?
          <p className="text-green-500 text-sm mt-1">Username available</p>
          :""}
        </div>
        
        {/* Username Input */}
        <br/>
        {/* Profile Picture Input */}
        <div className="relative w-32 h-32 mx-auto">
          <label className="block text-sm font-medium text-gray-700 text-center mb-2">Profile Picture</label>
          <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg mx-auto">

              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                {/* <AiOutlineCamera size={40} /> */}
                {profilePic ? (
              <img
                src={profilePic}
                alt="Profile Preview"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                <AiOutlineCamera size={40} />
              </div>)}
            

            {/* Hover effect with Camera Icon */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
              <AiOutlineCamera size={40} className="text-white" />
              <input
                type="file"
                accept="image/jpeg, image/png, image/jpg"
                {...register("profilePic", { required: true })}
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleProfilePicChange}
              />
            </div>
          </div>
          {errors.profilePic && <p className="text-red-500 text-sm mt-1">Profile picture is required</p>}
        </div>
        </div>
              <br/><br/>
        {/* Bio Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            {...register("bio", { required: true, maxLength: 200 })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder={(currentUser?.bio)?currentUser.bio:"Tell us about yourself (Max 200 characters)"}
            rows="3" 
          />
          {errors.bio && <p className="text-red-500 text-sm mt-1">Bio is required (Max 200 characters)</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || exists}
          className={`w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-mono disabled:bg-slate-500 `}
          
        >Update
        </button>
           <span>{isSubmitting && <Loading type="spin" color="white"  height="20%" width="20%"/>}</span>
      </form>
      {uploadStatus && <p className="text-center text-3xl text-green-400">{uploadStatus}</p>}
    </div>
  );
}
