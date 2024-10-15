import React,{useContext,createContext,useState,useEffect, useRef} from "react";
import { getFirestore, doc, setDoc,updateDoc, addDoc, collection ,getDocs,query,where,onSnapshot,getDoc} from "firebase/firestore";
import { useAuth } from './AuthContext'
// import { realtimeDB } from '../../utils/init-firebase';
// import { ref, onValue,get } from "firebase/database";


const UserContext=createContext({
    userArray:[],
    
})

export const useUsers=()=>useContext(UserContext);


export default function UserContextProvider({children})
{
    const {db,currentUser,setCurrentUser}=useAuth();
    
    const [userArray,setUserArray]=useState([])
    const [isFollowing, setIsFollowing] = useState([])
    const [uzerFollowArray,setUzerFollowArray]=useState([]);
    // const [initialState,setInitialState]=useState(false)
    const [isFirstLogin, setIsFirstLogin] = useState(false);
    console.log(currentUser?.username);
    
    const users = [];
    const [isUsersFollowing, setUsersIsFollowing] = useState([])
    const [userFollow,setUserFollow]=useState([]);
    const [postsLoaded, setPostsLoaded] = useState(false);
    
    const getUsers=async()=>{
  
      try {
        // setIsLoading(true);
        const querySnapshot = await getDocs(query(collection(db, "users")));
        querySnapshot.forEach((doc) => {
        users.push(doc.data());
      }
    )  
    setIsFollowing(currentUser?.following)
    // //console.log(currentUser);

      } catch (error) {
        ////console.log("Error fetching users");
        // setIsLoading(false);

      }
      finally{
        // setIsLoading(false);
      
      }
  // setUserArray(users); 
  
  }

  // const getInitailUserFollowing=() => { 
  //     userArray.forEach((obj)=>{
  //       if(obj["uid"]===currentUser.uid)
  //       {
  //         setUzerFollowArray(obj["following"])
  //       }
  //     })
  //  }


  const getValueByKey = (arrayOfObjects,uid,key) => {
    arrayOfObjects.forEach((obj) => {
       


        if(uid===obj["uid"])
        {
         
          setCurrentUser(obj);
          
          return ;
          
        }
    });
  };



  const userExists=async (email) => { 
    const querySnapshot = await getDocs(query(collection(db, "users"), where("email", "==", email)));

    if(querySnapshot.empty)
    {
      return false;
    }
    else
    {
      return true;
    }

   }



  const getUserDetailsById=async(uid)=>{
    // ////console.log("I was called")
    ////console.log("Passed uid ",uid)
    const querySnapshot = await getDocs(query(collection(db, "users"), where("uid", "==", uid)));
    

    //console.log(querySnapshot)
   querySnapshot.forEach((doc) => 
    {
    //console.log(`${doc.id} => ${doc.data().uid}`);
    setCurrentUser(doc.data());
    setIsFollowing(doc.data().following)
    //console.log(doc.data())
    // localStorage.setItem("user",JSON.stringify(doc.data()));
    
  })

  }


  const getFollow=() => { 
    
   userArray && userArray.map((value,index,arr)=>{

      let userDetail=[
        ...userFollow,{
          uid:value.uid,
          followers:value.followers,
          following:value.following
        }
      ]

      setUserFollow(userDetail);
    })

   }


  // async function checkUserExists()
  // {
  //   const uzer=localStorage.getItem("user");
  //   // //console.log(JSON.parse(uzer));
  //   return (uzer)?JSON.parse(uzer) : null;
  // }


  
  async function handleLike(uid, pid) {
    try {
      // Get the user's document(s) from Firestore
      const querySnapshot = await getDocs(query(collection(db, "users"), where("uid", "==", uid)));
  
      // Check if any documents are returned
      if (!querySnapshot.empty) {
        // Loop through each document (since theoretically there could be more than one)
        querySnapshot.forEach(async (documentSnapshot) => {
          const userData =  documentSnapshot.data();
          const postIndex = userData.posts.findIndex(post => post.pid === pid);
  
          if (postIndex !== -1) 
            {
            // Check if the currentUser has already liked the post
            if (!userData.posts[postIndex].likes.includes(currentUser?.uid)) {
              // Add currentUser to the likes array of the specific post
              const updatedPosts = [...userData.posts];
              updatedPosts[postIndex].likes.push(currentUser?.uid);
  
              // Update the Firestore document with the modified posts array
              const docRef = doc(db, "users", documentSnapshot.id);
              await updateDoc(docRef, {
                posts: updatedPosts
              });

              //add pid to postsLiked
              
              
              ////console.log("Post liked successfully!");
              // return true;
            } else {
              // Undo Like
              const updatedPosts = [...userData.posts];
              updatedPosts[postIndex].likes = updatedPosts[postIndex].likes.filter(user => user !== currentUser?.uid);
  
              // Update the Firestore document with the modified posts array
              const docRef = doc(db, "users", documentSnapshot.id);
              await updateDoc(docRef, {
                posts: updatedPosts
              });
  
              ////console.log("Post unliked successfully!");
              // return false;

            }
          } else {
            ////console.log("Post not found.");
          }
        });
      } else {
        ////console.log("User document not found.");
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }


    try {
      // Get the user's document(s) from Firestore
      const querySnapshot = await getDocs(query(collection(db, "users"), where("uid", "==", currentUser?.uid)));
  
      // Check if any documents are returned
      if (!querySnapshot.empty) {
        // Loop through each document (since theoretically there could be more than one)
        querySnapshot.forEach(async (documentSnapshot) => {
          const userData =  documentSnapshot.data();
          //console.log(userData.postsLiked);
          if(!userData.postsLiked.includes(pid))
          {
            const docRef = doc(db, "users", documentSnapshot.id);
            let postsLiked=userData.postsLiked;
            postsLiked.push(pid);
              await updateDoc(docRef, {
                postsLiked: postsLiked
              });
              ////console.log("added pid to postsLiked");
                  
              
          }
          else
          {
            const index=userData.postsLiked.indexOf(pid);
            //console.log(index);
            let postsLikedArr=userData.postsLiked;
            postsLikedArr.splice(index,1);
            
            ////console.log("Removed : ",postsLikedArr);
            
            const docRef = doc(db, "users", documentSnapshot.id);
              await updateDoc(docRef, {
                postsLiked: postsLikedArr
              });
              ////console.log("removed pid from postsLiked");
          
          }

        });
      } else {
        ////console.log("User document not found.");
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  
    // ////console.log("i was liked");
  }
  
  


  async function handleFollow(xuid){

    // ////console.log("You : ",currentUser.uid+ (isFollowing.includes(xuid)?" Unfollowed ":" Followed "+xuid));
    // getUserFollowing()
    try{
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", xuid));
      const querySnapshot = await getDocs(q);
      let updatedData={}
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnapshot) => {
          let followerArr = docSnapshot.data().followers || [];

        if (!followerArr.includes(currentUser.uid)) {
          followerArr.push(currentUser.uid);
          // ////console.log("User Follow Process");

        }
        else{
          ////console.log("User Unfollow Process");
          followerArr=followerArr.filter((val)=>{
            return val!==currentUser.uid
          })
          // return;
        }

          const userDocRef =  doc(db, "users", docSnapshot.id);
          await updateDoc(userDocRef, { followers: followerArr }).then(()=>{
            // ////console.log("User updated successfully!");
          }).catch((err)=>{
            console.error(err)
          });
          // navigate("/r-social/profile/me")
          //setIsFollowing
        });
      } 
      else {
        ////console.log("No user found with the provided UID.");
      }

    }catch(err){
      console.error(err)
    }

   
    try {
      const usersRef = collection(db, "users");

      const q = query(usersRef, where("uid", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
     

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnapshot) => {
          let followingArr = docSnapshot.data().following || [];
        if (!followingArr.includes(xuid)) {
          followingArr.push(xuid); 
          setIsFollowing(followingArr);
          //console.log(isFollowing);

        }
        else{
          ////console.log("User ///");
          followingArr=followingArr.filter((val)=>{
            return val!==xuid
          })
          
        }
          const userDocRef =  doc(db, "users", docSnapshot.id);
          await updateDoc(userDocRef, { following: followingArr }).then(()=>{
            const updatedUzer={
              ...currentUser, // Spread the current user details
                following:followingArr
            }
          setIsFollowing(followingArr)

          // localStorage.setItem("user",JSON.stringify(updatedUzer))

          }).catch((err)=>{
            console.error(err)
          });
          ////console.log("User updated successfully!");
          // navigate("/r-social/profile/me")
        });
      } 
      else {
        ////console.log("No user found with the provided UID.");
      }
    } catch (error) {
      
    }

  }

  const value={
    userArray,
    setUserArray,
    users,
    getUsers,
    getUserDetailsById,
    isFirstLogin,
    setIsFirstLogin,
    
    setIsFollowing,
    isFollowing,
    handleFollow,
    userExists,
    uzerFollowArray,
    getValueByKey,
    isUsersFollowing,
     setUsersIsFollowing,
     userFollow,
     setUserFollow,
     handleLike,
     setPostsLoaded,
     postsLoaded,
  


    
   
}
  

useEffect(() => { 
  async function callFirst() {
    
    await getUsers();

    //  ////console.log("userArray is below \n",userArray)
  }
  callFirst();
  userArray && getFollow();
    }, [currentUser])



  useEffect(()=>{
          
   
          const usersRef = collection(db, 'users');
          const unsubscribe = onSnapshot(usersRef, (snapshot) => {
            const usersData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            }));
            ////console.log("onSnapshot called");
            
            setUserArray(usersData);
            setPostsLoaded(true);


            
          });
      
          // Cleanup the listener when the component unmounts
          return () => unsubscribe();
        },[])

        useEffect(() => {
          setIsFirstLogin((currentUser?.username==="" )?true:false)
        
        
        }, [currentUser])
        


        // useEffect(()=>{
        //     //console.log(currentUser?.username);
        //     ////console.log("use ");
            
            
        // },[currentUser])

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}