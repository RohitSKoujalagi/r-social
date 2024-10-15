import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDocs, collection, query, where,doc ,updateDoc} from "firebase/firestore";
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';

const Comment = ({ comment ,pid}) => {
  const { db,currentUser } = useAuth();
  
  // Function to fetch the profile image URL by username
  const getImageUrlByName = async (name) => {
    const querySnapshot = await getDocs(
      query(collection(db, "users"), where("username", "==", name))
    );
    
    let profilePictureURL = '';
    querySnapshot.forEach((doc) => {
      profilePictureURL = doc.data().profilePictureURL;
    });

    return profilePictureURL;
  };


  const getPostByPid = async (pid) => {
    const querySnapshot = await getDocs(collection(db, "users"));
    
    let foundPost = null;
    let foundComments=null;
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.posts) {
        const post = userData.posts.find(post => post.pid === pid);

        const comments=userData.posts.comments;

        if (post && comments) {
          foundPost = post;
          foundComments=comments;
          return; // Stop searching once we find the post
        }
      }
    });
  
    return {foundPost,foundComments};
  };


  async function  handleComment(pid,content)
  {
    

            const querySnapshot = await getDocs(collection(db, "users"));

            querySnapshot.forEach(async (docSnapShot)=>{
                const userData =  docSnapShot.data();

                const postIndex = userData.posts.findIndex(post => post.pid === pid);
                // //console.log(postIndex);

                if(postIndex!==-1)
                {

                    const updatedPosts = [...userData.posts];
                    updatedPosts[postIndex].comments.push(
                        {
                            name:currentUser?.username,
                            comment:content
                        }
                    );
    
                    const docRef = doc(db, "users", docSnapShot.id);
                    //console.log(updatedPosts);
                    
                  await updateDoc(docRef, {
                    posts: updatedPosts
                  });
                }
            })



        }

  

  // Using react-hook-form
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Submit handler
  const onSubmit = (data) => {
    //console.log(data);
    //  comment logic 
    handleComment(pid,data.comment);
    reset(); // Resets the form after submission
  };

  return (
    <section className=" dark:bg-gray-900 bg-slate-400 py-8 lg:py-16 antialiased">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
            Comments ({comment.length})
          </h2>
        </div>

        <form className="mb-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <label htmlFor="comment" className="sr-only">Your comment</label>
            <textarea
              id="comment"
              rows="6"
              className={`px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800 ${
                errors.comment ? 'border-red-500' : ''
              }`}
              placeholder="Write a comment..."
              {...register('comment', {
                required: 'Comment is required',
                minLength: {
                  value: 1,
                  message: 'Comment must be at least 1 character long'
                }
              })}
            ></textarea>
            {errors.comment && (
              <p className="text-red-500 text-sm mt-1">
                {errors.comment.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center bg-blue-500 text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
          >
            Post comment
          </button>
        </form>

        {comment?.map((value, index) => (
          <CommentItem key={index} value={value} getImageUrlByName={getImageUrlByName} />
        ))}
      </div>
    </section>
  );
};

// Separate component for individual comments
const CommentItem = ({ value, getImageUrlByName }) => {
  const [profileImageUrl, setProfileImageUrl] = useState('');

  useEffect(() => {
    const fetchProfileImage = async () => {
      const url = await getImageUrlByName(value.name);
      setProfileImageUrl(url);
    };
    
    fetchProfileImage();
  }, [value.name, getImageUrlByName]);

  return (
    <article className="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
      <NavLink to={`/r-social/profile/${value.name}`}>
      <footer className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <img
            className="mr-2 w-6 h-6 rounded-full"
            src={profileImageUrl || 'default_profile_picture_url'} // Set a default if profileImageUrl is empty
            alt={value.name}
          />
          <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
            {value.name}
          </p>
        </div>
      </footer>
      </NavLink>
      <p className="text-gray-500 dark:text-gray-400">{value.comment}</p>
    </article>
  );
};

export default Comment;
