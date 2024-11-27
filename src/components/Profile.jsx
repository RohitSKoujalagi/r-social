import React,{useEffect,useRef, useState} from 'react'
import { useAuth } from '../context/AuthContext';
// import {currentUser} from '../context/AuthContext'
import ProfilePlaceholder from '../assets/ProfilePlaceholder.webp'
import { getFirestore, doc, setDoc, addDoc, collection,getDocs,query,where,deleteDoc, documentId,updateDoc,onSnapshot,getDoc, arrayUnion } from "firebase/firestore";

import {useNavigate,Outlet, useParams,NavLink, replace} from 'react-router-dom'
import {useUsers} from '../context/UserContext'
import FirstLoginForm from './FirstLoginForm';
import MyPosts from './MyPosts';
import { auth,db } from '../../utils/init-firebase';
import {peerConnection} from '../../utils/RTC-vars';


function Profile() {
  const {currentUser} =useAuth();

  // const userCount=[];

  const unsubBroadcasterRef = useRef(null); 

  let {username}=useParams();
  const navigate=useNavigate();

  const [userDetail,setUserDetail]=useState({});
  const [showPosts,setShowPosts]=useState(false);
  const [userType,setUserType]=useState();

  const posts=useRef(null);

  
  const {isFirstLogin,
    setIsFirstLogin,getUserDetailsById,getUsers,userArray,isFollowing,getValueByKey,setDisplayUser,displayUser,setIsFollowing,transformCloudinaryURL}=useUsers();


    const handlePosts=() => { 
      
      if(username==="me")
        {
          setUserType("me");
          setShowPosts((val)=>!val);
          
        }
        else
        {
          setUserType("specific");
          setShowPosts((val)=>!val);
        }
         posts.current?.scrollIntoView({ block: "center", behavior: 'smooth'});
     }



  const exitBroadcast=() => { 
    peerConnection.close();

    if (unsubBroadcasterRef.current) unsubBroadcasterRef.current();
   }

    const joinBroadcast = async () => {

      const roomId=userDetail?.roomID;

      
      const viewerDocId=userDetail?.viewerDocId;

      // const wantedDoc=doc("/rooms/bEu7AryAVZDOjgIYHRxX/typj9luV1BOqw4KxbbslbtTAzwY2 /aaca5db8-f80d-44da-a7ae-365b8d407c57")
      const roomDocRef = doc(db, 'rooms', roomId);  // Reference the room document
      const viewerColRef=collection(roomDocRef,`${currentUser.uid.trim()}`);
      // console.log("*****\n",viewerColRef,"\n*****");
      
      const viewerDocRef = doc(db,"rooms",roomId,currentUser.uid,userDetail.viewerDocId);
      // console.log("*****\n",viewerDocRef,"\n*****");
      // console.log(currentUser?.uid);
      const docRef=doc(db,"rooms",roomId,currentUser?.uid,viewerDocId);
      // onSnapshot(docRef,(snapshot)=>{
      //   //console.log(snapshot.data());
        
      //   getDoc(docRef)

      // })
      
      
      // //console.log(viewerDocRef);
      



      try {
        
        const docRef =  await getDoc(roomDocRef);
        const viewers=docRef?.data().viewers || [];
        console.log(viewers);
        
        if(!viewers.includes(currentUser?.uid))
        {
            await setDoc(roomDocRef,{"viewers":[...viewers,currentUser?.uid]});
            console.log("User not in []");
            

            // const viewerId=collection(roomRef,"offerCandidates") 

            // await setDoc(offerCandidates,)
        }
        else
        {
          console.log("Already a viewer");
        }
         
        
      } catch (error) {
        console.log("error: ",error);
        
      }


      console.log("room id from viewer (verify) ⚠️ ",userDetail?.roomID);
      console.log("#### viewerDocId (verify) ⚠️###  ",userDetail?.viewerDocId);
      
      
      // peerConnection.onicecandidate = async event => {
      //   if (event.candidate) {
      //     console.log("===Answer Ice Candidates coming===");
      //     console.log(event.candidate.toJSON());
      //     // addDoc(answerCandidates,event.candidate.toJSON());
      //     await updateDoc(docRef, {
      //       "answerIceCandidates": arrayUnion(event.candidate.toJSON())  
      //     });
      //   }
      // };
      const answerIceCandidates=collection(docRef,"answerIceCandidates")

      peerConnection.onicecandidate = event => {
        if (event.candidate) {
          console.log("===viewer Ice Candidates coming===");
          console.log(event.candidate.toJSON());
          addDoc(answerIceCandidates,event.candidate.toJSON());
        }
      };

      const remoteVideo = document.getElementById("remoteVideo");
      const video = document.createElement("video");
      console.log(remoteVideo);
      remoteVideo.autoPlay=true;
      remoteVideo.muted=true;
      
      
      peerConnection.ontrack = async (event) => {
        
        if (event.streams[0]) {
            video.srcObject=event.streams[0];
            console.log('Remote stream received:', event.streams[0]);
            remoteVideo.srcObject = event.streams[0];
        } else {
            console.warn("No stream found in ontrack event.");
        }
      };


      //get offer

      onSnapshot(roomDocRef,async snapshot=>{
        
        {
          if(peerConnection.connectionState!=="connected")
            {

              if(snapshot.exists())
              {
                // console.log("snapshot exists");
                
                const viewerData=snapshot.data();
      
                if(viewerData?.offer)
                {
                // console.log("have ");
    
                  try {
                    console.log("Offer: ", viewerData.offer);
                        const offer = new RTCSessionDescription(viewerData.offer);
                          peerConnection.setRemoteDescription(offer).then(()=>{
    
                            const offerIceCandidates=collection(docRef,"offerIceCandidates")
                            unsubBroadcasterRef.current=  onSnapshot(offerIceCandidates,(snapshot => {
                            
                              snapshot.docChanges().forEach(async change => {
                                console.log("change in offerIceCandidates");
                      
                                if (change.type === 'added') 
                                  {
                                  console.log("broadcaster added");
                                 
                                    
                                    const candidate = new RTCIceCandidate(change.doc.data());
                                     peerConnection.addIceCandidate(candidate)
                                  
                               
                                }
                              });
                            }));
    
                          }).catch(err=>console.error(err))
    
                          
    
                          console.log("remoteDesc was set at viewer END");
                          
                          const answer = await peerConnection.createAnswer();
                        await peerConnection.setLocalDescription(answer);
            
        
                        await setDoc(docRef, { 
                          answer: {
                          type: answer.type,
                          sdp: answer.sdp
                      } });
    
                  } catch (error) {
                    console.error(error);
                    
                  }
      
      
                
                                 
                }
                else
                {
                  console.log("no OFFER 😢");
                  
                }
              }
            }

        }


      })




    // Initialize an array to collect offerIceCandidates
        // let offerIceCandidatesArray = [];
        // const uniqueOfferIceCandidates = new Set();


        // unsubBroadcasterRef.current = onSnapshot(docRef,async (Qsnapshot) => {
        //   if (Qsnapshot.exists()) {
        //     const broadcasterData = Qsnapshot.data();
        //     const offerIceCandidates = broadcasterData?.offerIceCandidates?.slice(-1) || [];
        //     console.log("offerIceCandidate size \n", offerIceCandidates?.length);

        //     try {
        //       const candidate = new RTCIceCandidate(offerIceCandidates);

        //       await peerConnection.addIceCandidate(candidate)

        //       await updateDoc(docRef,{
        //         "answerIceCandidates":arrayUnion(candidate)
        //       })

        //     } catch (error) {
        //       console.error(error);
              
        //     }

        //     // offerIceCandidatesArray?.forEach(async (candidateData) => {
        //     //   const candidateString = JSON.stringify(candidateData);  // Convert candidate to string to use with Set

        //     //   if (!uniqueOfferIceCandidates.has(candidateString)) {
        //     //     uniqueOfferIceCandidates.add(candidateString);  // Add to Set to track unique candidates
        //     //     const candidate = new RTCIceCandidate(candidateData);
        //     //     console.log("Adding unique offer ICE candidate from broadcaster: ", candidate);
                
        //     //     try {
        //     //       await peerConnection.addIceCandidate(candidate);
        //     //       offerIceCandidatesArray.push(candidateData);  // Add to array only if successful
        //     //     } catch (error) {
        //     //       console.error("Error adding answer ICE candidate:", error);
        //     //     }
        //     //   }
        //     // });

        //     // // Push to Firestore only if there are new unique candidates
        //     // if (offerIceCandidatesArray.length > 0) {
        //     //   await updateDoc(viewerDocRef, {
        //     //     answerIceCandidates: arrayUnion(...offerIceCandidatesArray)
        //     //   });
        //     //   offerIceCandidatesArray = [];  // Reset the array after updating Firestore
        //     // }

        //     // Collect candidates in the array
           
        //   } else {
        //     console.log("***room snapshot dne");
        //   }
        // });


      



      
      

      
      




      peerConnection.addEventListener('icegatheringstatechange', () => {
        console.log(
            `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
      });
    
      peerConnection.addEventListener('connectionstatechange', () => {
        console.log(`Connection state change: ${peerConnection.connectionState}`);
      });
    
      peerConnection.addEventListener('signalingstatechange', () => {
        console.log(`Signaling state change: ${peerConnection.signalingState}`);
      });
    
      peerConnection.addEventListener('iceconnectionstatechange ', () => {
        console.log(
            `ICE connection state change: ${peerConnection.iceConnectionState}`);
      });

      peerConnection.addEventListener('track', (event) => {
        console.log(
            `ICE connection state change: ${peerConnection.iceConnectionState}`);
            console.log(event);
            
      });
      

      

      


          console.log(peerConnection.connectionState ," AND ", peerConnection.iceConnectionState);


    };
    


    
    

    useEffect(() => {
      
       userArray?.forEach((obj) => {
        const foundUser = userArray?.find(obj => obj.username === username);
      if (foundUser) {
        setUserDetail(foundUser);
      }
      });
    
    }, [userArray,username])



    
      


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

  function handleProfileEdit(){
    navigate("/r-social/firstLogin")
  }

  async function  handleProfileDelete()
  {
    if(confirm("Do you want to DELETE your account? 🥺"))
    {
      const user=auth.currentUser;

      if(user)
      {
        try {
          // Delete from Firestore

          const querySnapshot = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)));

          querySnapshot.forEach(async(docu)=>{
            const documentId=docu.id;
            await deleteDoc(doc(db, "users", documentId));
            return;
          })

          // Delete user from Firebase Auth
          await user.delete();

          alert(`User ${user.email} deleted successfully`);
          navigate("/r-social/register", { replace: true });

        } catch (error) {

          alert("Error deleting user account: ", error);
          navigate("/r-social/profile", { replace: true });
        }
    } else {
      // No user is currently signed in
      alert("No user is currently signed in.");
    }
    }
    else
    {
      alert("Welcome back Champ! 🥳🍾")
    }
    
  }


  useEffect(()=>{
    getValueByKey(userArray,currentUser?.uid);
    //console.log(isFollowing);

  },[])

  return (
    <> 
         
       

<div className='h-full overflow-hidden  flex    bg-slate-500'>

{(isFirstLogin && username==="me")?<FirstLoginForm/>:
<div
    className="max-w-2xl border-2 border-cyan-100  mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900 mb-10">
    <div className="rounded-t-lg h-32 overflow-hidden">
      
        <img className="object-cover object-top w-full" src='https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='Mountain'/>
    </div>
    <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
        <img  className="object-cover object-center h-32" src={(username==="me")?srcSetter():userArray && userDetail.profilePictureURL} alt='Baingan Pic'/>
        
       
    </div>
    <div className="text-center mt-2">

        <h2 className="font-semibold">{(username==="me")?(currentUser && currentUser.username):userDetail.username}</h2>
        <p className="text-gray-500">{(username==="me")?(currentUser && currentUser.bio):userDetail.bio}</p>
    </div>
    <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
        <li className="flex flex-col items-center justify-around">
        <NavLink to={`/r-social/profile/${username}/following`}>
            <svg className="w-4 fill-current text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path
                    d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            </NavLink>
            {/* {(username==="me")?(currentUser && getValueByKey(userArray,"followers")):getUserByKey(userArray,username,"followers").length 
            } */}
            <div>{(username==="me")?(currentUser && currentUser.following?.length):userArray && userDetail?.following?.length}<span> Following</span></div>
        </li>

        <li className="flex flex-col items-center justify-between">
            <NavLink to={`/r-social/profile/${username}/followers`}>
            <svg className="w-4 fill-current text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path
                    d="M7 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1c2.15 0 4.2.4 6.1 1.09L12 16h-1.25L10 20H4l-.75-4H2L.9 10.09A17.93 17.93 0 0 1 7 9zm8.31.17c1.32.18 2.59.48 3.8.92L18 16h-1.25L16 20h-3.96l.37-2h1.25l1.65-8.83zM13 0a4 4 0 1 1-1.33 7.76 5.96 5.96 0 0 0 0-7.52C12.1.1 12.53 0 13 0z" />
            </svg>
            </NavLink>
            <div>{(username==="me")?(currentUser && currentUser.followers?.length):userArray && userDetail?.followers?.length}
            <span> Followers</span>
            </div>
        </li>
        

        <li className="flex flex-col items-center justify-around">
         
          <button onClick={handlePosts}>

            <svg className="w-4 fill-current text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path
                    d="M9 12H1v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-8v2H9v-2zm0-1H0V5c0-1.1.9-2 2-2h4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v6h-9V9H9v2zm3-8V2H8v1h4z" />
            </svg>
          </button>
          
            <div>{(username==="me")?(currentUser?.posts?.length):(userArray && userDetail?.posts?.length)}
            <span> Posts</span>
            </div>
        </li>
       
    </ul>
    {username==="me" && <div className="p-4 border-t mx-8 mt-2">
        <div className="p-4  rounded-lg flex items-center justify-center">
        <button onClick={handleProfileEdit} className="  mx-auto rounded-full bg-blue-700 hover:shadow-lg font-semibold text-white px-6 py-2 flex items-center">
  Edit Profile
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current ml-2" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
    <path d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z"></path>
  </svg>
</button>
    </div>

    <div className="p-1   rounded-lg flex items-center justify-center">
        <button onClick={handleProfileDelete} className="  mx-auto rounded-full bg-red-600 hover:shadow-lg font-semibold text-white px-4 py-2 flex items-center">
          

  Delete Profile
  <svg fill="#000000" className="h-6 w-6 fill-current ml-2" x="0px" y="0px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
	 width="100" height="100" viewBox="0 0 50 50"
	 xmlSpace="preserve">
<g>
	<path d="M36.335,5.668h-8.167V1.5c0-0.828-0.672-1.5-1.5-1.5h-12c-0.828,0-1.5,0.672-1.5,1.5v4.168H5.001c-1.104,0-2,0.896-2,2
		s0.896,2,2,2h2.001v29.168c0,1.381,1.119,2.5,2.5,2.5h22.332c1.381,0,2.5-1.119,2.5-2.5V9.668h2.001c1.104,0,2-0.896,2-2
		S37.438,5.668,36.335,5.668z M14.168,35.67c0,0.828-0.672,1.5-1.5,1.5s-1.5-0.672-1.5-1.5v-21c0-0.828,0.672-1.5,1.5-1.5
		s1.5,0.672,1.5,1.5V35.67z M22.168,35.67c0,0.828-0.672,1.5-1.5,1.5s-1.5-0.672-1.5-1.5v-21c0-0.828,0.672-1.5,1.5-1.5
		s1.5,0.672,1.5,1.5V35.67z M25.168,5.668h-9V3h9V5.668z M30.168,35.67c0,0.828-0.672,1.5-1.5,1.5s-1.5-0.672-1.5-1.5v-21
		c0-0.828,0.672-1.5,1.5-1.5s1.5,0.672,1.5,1.5V35.67z"/>
</g>
</svg>

          </button>
    </div>
<br />
<NavLink to={"/r-social/profile/me/goLive"}>

    <div className="p-1  mx-auto rounded-full bg-red-600 hover:shadow-lg font-semibold text-white px-4 py-2 flex items-center  justify-center">
        
          

  Go LIVE  &nbsp;
  <svg width="25px" height="25px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <g id="🔍-Product-Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="ic_fluent_live_24_filled" fill="#FFFFFF" fillRule="nonzero">
            <path d="M6.34277267,4.93867691 C6.73329697,5.3292012 6.73329697,5.96236618 6.34277267,6.35289047 C3.21757171,9.47809143 3.21757171,14.5450433 6.34277267,17.6702443 C6.73329697,18.0607686 6.73329697,18.6939336 6.34277267,19.0844579 C5.95224838,19.4749821 5.3190834,19.4749821 4.92855911,19.0844579 C1.02230957,15.1782083 1.02230957,8.84492646 4.92855911,4.93867691 C5.3190834,4.54815262 5.95224838,4.54815262 6.34277267,4.93867691 Z M19.0743401,4.93867691 C22.9805896,8.84492646 22.9805896,15.1782083 19.0743401,19.0844579 C18.6838158,19.4749821 18.0506508,19.4749821 17.6601265,19.0844579 C17.2696022,18.6939336 17.2696022,18.0607686 17.6601265,17.6702443 C20.7853275,14.5450433 20.7853275,9.47809143 17.6601265,6.35289047 C17.2696022,5.96236618 17.2696022,5.3292012 17.6601265,4.93867691 C18.0506508,4.54815262 18.6838158,4.54815262 19.0743401,4.93867691 Z M9.3094225,7.81205295 C9.69994679,8.20257725 9.69994679,8.83574222 9.3094225,9.22626652 C7.77845993,10.7572291 7.77845993,13.2394099 9.3094225,14.7703724 C9.69994679,15.1608967 9.69994679,15.7940617 9.3094225,16.184586 C8.91889821,16.5751103 8.28573323,16.5751103 7.89520894,16.184586 C5.58319778,13.8725748 5.58319778,10.1240641 7.89520894,7.81205295 C8.28573323,7.42152866 8.91889821,7.42152866 9.3094225,7.81205295 Z M16.267742,7.81205295 C18.5797531,10.1240641 18.5797531,13.8725748 16.267742,16.184586 C15.8772177,16.5751103 15.2440527,16.5751103 14.8535284,16.184586 C14.4630041,15.7940617 14.4630041,15.1608967 14.8535284,14.7703724 C16.384491,13.2394099 16.384491,10.7572291 14.8535284,9.22626652 C14.4630041,8.83574222 14.4630041,8.20257725 14.8535284,7.81205295 C15.2440527,7.42152866 15.8772177,7.42152866 16.267742,7.81205295 Z M12.0814755,10.5814755 C12.9099026,10.5814755 13.5814755,11.2530483 13.5814755,12.0814755 C13.5814755,12.9099026 12.9099026,13.5814755 12.0814755,13.5814755 C11.2530483,13.5814755 10.5814755,12.9099026 10.5814755,12.0814755 C10.5814755,11.2530483 11.2530483,10.5814755 12.0814755,10.5814755 Z" id="🎨-Color">

</path>
        </g>
    </g>
</svg>

          
    </div>
</NavLink>


    </div>
}


{
  (username!=="me" && userArray && userDetail?.roomID!=="")?
  <>
  
  <button onClick={joinBroadcast} className='text-2xl rounded-lg  bg-green-400 p-4 m-4'>Join Live </button>
  <button onClick={exitBroadcast} className='text-2xl rounded-lg  bg-red-400 p-4 m-4'>Exit Live </button>
  <hr />
  </>
  :""
}
  <video width={1280} height={720} className='mx-auto border-cyan-500 rounded-2xl border-4' id="remoteVideo"  autoPlay playsInline></video>

</div>

}




</div>



  <div ref={posts} id='posts' >

 { showPosts &&  <MyPosts user={userType}/>}


  </div>
    </>
  )
}

export default Profile