import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { getFirestore, query, where, getDocs, collection, orderBy, limit } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from './Debounce';
import { NavLink } from 'react-router-dom';
import ProfilesSrchSkeleton from './ProfilesSrchSkeleton';
import PostsCard from './PostsCard'

const SearchPage = () => {

  const { db } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [postSearchResults, setPostSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show,setShow]=useState({user:false,post:false});


  const [debouncedSearch] = useDebounce(searchTerm);

  const transformCloudinaryURL = (url) => {
    if (url === "https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg") {
      return url;
    }
    const transformations = 'q_auto,f_auto,h_500,w_500,c_auto';
    const uploadIndex = url.indexOf('/upload') + '/upload'.length;
    const transformedURL = url.slice(0, uploadIndex) + `/${transformations}` + url.slice(uploadIndex);
    return transformedURL;
  };

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi')); // Split by the search term, case-insensitive
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ?
        <span key={index} className="text-blue-500">{part}</span> :
        part
    );
  };

  useEffect(() => {
    const searchUsers = async () => {
      if(searchTerm==="" || debouncedSearch==="")
      {
        // ////console.log("empty");
        
        setUserSearchResults([]);
        setPostSearchResults([]);
      }
      if (!debouncedSearch) return;
      setLoading(true);
      // Fetch all possible users that match by prefix (using a wide range search)
      const q = query(
        collection(db, 'users'),
        orderBy('username'), // Order by username to fetch a reasonable range
        limit(50) // Limit to prevent too large results, adjust as needed
      );

      const querySnapshot = await getDocs(q);
      const allUsers = querySnapshot.docs.map(doc => doc.data());

      // Now filter users in a case-insensitive manner
      const filteredUsers = allUsers.filter(user =>
        user.username.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      const filteredPosts = allUsers
  .flatMap(user => user.posts) // Combine all users' posts into a single array
  .filter(post => 
    post.title.toLowerCase().includes(debouncedSearch.toLowerCase()) // Filter posts by title
  );

      //console.log(filteredPosts);
      

      setUserSearchResults(filteredUsers);
      setPostSearchResults(filteredPosts);
      setLoading(false);
    };

    searchUsers();
  }, [debouncedSearch, db]);

  return (
    <>
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-2 border-2">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Search</h2>
        <div className="flex flex-col space-y-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if(e.target.value==="")
                {
                  setShow({user:false,post:false});
                }
              }}
              className="w-full rounded-lg px-3 py-2 bg-gray-100 text-gray-800 outline-none focus:ring-2 ring-2 ring-blue-900 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm"
              placeholder="Search Users & Posts...🔍"
            />
          </div>
          {loading ? (
            <ProfilesSrchSkeleton/>
          ) : (

            <>
            <br />
  Users &nbsp;
<div className="flex flex-wrap gap-3 justify-start text-center">
  {userSearchResults.length > 0 ?
  
  userSearchResults.map((user) => (
    <NavLink key={user.uid} to={`/r-social/profile/${user.username}`}>
    <div 
      className="rounded-lg w-40 h-30 flex flex-col justify-center items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 shadow-sm"
    >
      <div className="text-center mb-2">
        {highlightText(user.username, debouncedSearch)}
      </div>
      <span className="relative h-14 w-14 rounded-full overflow-hidden">
        <img
          src={transformCloudinaryURL(user.profilePictureURL)}
          alt=""
          className="h-full w-full object-cover rounded-full"
        />
      </span>
    </div>
    </NavLink>
  )):  (debouncedSearch==="" && show.user) &&<div className="text-gray-500 w-full text-center">No users found matching "{debouncedSearch}".</div>}
</div>
<br />
Posts 
<div className="flex flex-wrap gap-3 justify-start text-center">
  
{postSearchResults.length > 0 ? (
    postSearchResults.map(post => (
      <div key={post.id} className="rounded-lg w-60 h-auto flex flex-col justify-start items-start px-3 py-2 bg-gray-100 hover:bg-gray-200 shadow-sm">
        <div className="font-medium text-blue-500 mb-1">
        </div>
        <div className="text-gray-600 text-sm w-full ">
        {highlightText(post.title, debouncedSearch)}
        </div>
      </div>
    ))
  ) : (debouncedSearch==="" && show.post ) &&(
    <div className="text-gray-500 w-full text-center">No posts found matching "{debouncedSearch}".</div>
  )}
</div>
            </>

          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
