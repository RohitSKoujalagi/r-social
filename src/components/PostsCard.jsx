import React,{useState,useEffect,useRef} from 'react'
// import { toast } from 'react-toastify';
import notify from './notify';
import { AiFillLike } from "react-icons/ai";
import { FaRegCommentAlt } from "react-icons/fa";
import { IoMdShare } from "react-icons/io";
import { useUsers } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { HiPlayPause } from "react-icons/hi2";
import Comment from './Comment';
import { collection ,getDocs,query,where} from "firebase/firestore";
import { useParams } from 'react-router-dom';

const PostsCard = (post) => {

  let {handleLike}=useUsers();
  let {currentUser,db}=useAuth();
  const {username}=useParams();

  const [showComment,setShowComment]=useState(false);

  
  const [isLiked,setIsLiked]=useState(false);
  const videoRef = useRef(null);




  async function checkLiked(pid) {
    try{
      const querySnapshot = await getDocs(query(collection(db, "users"), where("uid", "==", currentUser?.uid)));

      if (!querySnapshot.empty)
      {
        // //console.log(pid);
        
        querySnapshot.forEach(async (documentSnapshot) => {
          if(documentSnapshot.data().postsLiked.includes(pid))
          {
            setIsLiked(true);
          }
          else
          setIsLiked(false);
        })
      }
      else {
        ////console.log("User document not found.");

      }
    }
    catch(error)
    {
      console.error(error)
    }
  }



  const truncate = (str, maxLength) => {
 
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + '...';
  };

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      notify("Link copied to clipboard!","info","top-right",1000);
    }).catch((err) => {
      console.error("Failed to copy: ", err);
    });
  };

  useEffect(() => {
    setIsLiked(checkLiked(post.post.pid));
    // //console.log(checkLiked(post.post.pid));
    
  }, [currentUser])
  
// //console.log(post.post);




  return (
    <>
     <div className="max-w-md mx-auto  bg-white rounded-xl shadow-md overflow-hidden my-4 border-e-4 border border-blue-100">
      {/* Media (image/video) */}
      <div className="">
        {post.post.type === 'image' ? (
          <img src={post.post.mediaURL} alt="post media" className="w-full h-60 object-cover" />
        ) : (
          
          <video controls={(isLiked)}  id='post-video' className="w-full h-60 object-cover" preload='metadata' ref={videoRef}   >
            <source src={post.post.mediaURL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
        )}
      </div>

      {/* Title and description */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900">{post.post.title}</h3>
        <p className="text-gray-600 mt-2">{truncate(post.post.desc, 60)}</p>
      </div>

      {/* Action buttons */}
      <div className="border-t px-4 py-2 flex justify-between items-center">
        <button className="flex items-center space-x-1 text-slate-600 hover:text-blue-400" 
        onClick={()=>{  
          // ////console.log("Liked");
          setIsLiked(!isLiked);
          handleLike(post.post.uid,post.post.pid);
        }}>
          <i className="fas fa-heart"><AiFillLike color={(isLiked)?"blue":""} size={23} /></i>
          <span>{post.post.likes.length} Likes</span>
          {/* {//console.log(post.likes)} */}
        </button>

        <button className={`flex items-center space-x-1 text-gray-600 hover:text-blue-500 }`} onClick={()=>{
          setShowComment(!showComment);
        }}>
          <i className="fas fa-comment"><FaRegCommentAlt size={23} />
          </i>
          <span>Comments {post.post.comments.length}</span>
        </button>
        <button onClick={()=>copyToClipboard(`https://r-social.github.io/r-social/profile/${username}/posts`)} className="flex items-center space-x-1 text-gray-600 hover:text-blue-500">
          <i className="fas fa-share"><IoMdShare size={23} /></i>
          <span>Share</span>
        </button>
        {/* http://localhost:5173/profile/posts/something */}
      </div>
        {
          showComment && <Comment comment={post.post.comments} pid={post.post.pid}/>
        }
    </div>
    </>
  )
}

export default PostsCard