import React,{useRef} from 'react'
import { useUsers } from '../context/UserContext';
import { db } from '../../utils/init-firebase';
import { Firestore,collection,getDocs,doc, addDoc,onSnapshot,setDoc,query,updateDoc ,where,arrayUnion,getDoc,deleteDoc} from 'firebase/firestore';
import { v4 as uuidv4, v4 } from 'uuid';
import { useAuth } from '../context/AuthContext';
import { peerConnection } from '../../utils/RTC-vars';
import { set, update } from 'firebase/database';
// import {peerConnection} from '../../utils/RTC-vars';


function LiveStream() {

    // const {}=useUsers();
    const {currentUser}=useAuth();

    const unsubBroadcasterRef = useRef(null); // to hold the unsubscribe function for broadcaster's `onSnapshot`
     const unsubViewerRef = useRef(null);
     const unsub= useRef(null)
     const unsubs= useRef(null)




  const stopBroadCast= async() => { 
    
      const videoElement = document.getElementById('localVideo');
      const mediaStream = videoElement.srcObject;
      const tracks = mediaStream.getTracks();
      
      tracks.forEach(track => track.stop());
      peerConnection.close();
      
      if (unsubBroadcasterRef.current) unsubBroadcasterRef.current();
      if (unsubViewerRef.current) unsubViewerRef.current();
      if (unsub.current) unsub.current();

      
      
      
    }
    


    const startBroadcast = async () => {
      
      const viewerDocId=v4();
    const videoConstraints = {
    audio: true,
    video: {width: 600, height:500}
        };


       try {
        let stream=await navigator.mediaDevices.getUserMedia(videoConstraints)
             const videoElement = document.getElementById('localVideo');
             videoElement.srcObject = stream;
             
             videoElement.play();
             
             const roomsRef = collection(db,'rooms');
             
             const roomDocRef=doc(roomsRef);



            //    stream.getTracks().forEach(track => {
            //     console.log("== Adding track: ==", track);
            //     peerConnection.addTrack(track, stream);
            // });


           


             
             async function createOffer(viewerId)
             {
                console.log("++++ createOffer was called ++++ \n",viewerId,"\n");
                


              const peerConnection = new RTCPeerConnection(
                {
                    iceServers: [
              
                      // {urls: 'stun:stun1.l.google.com:19302'},
                    {
                      urls: "stun:stun.relay.metered.ca:80",
                    },
                    {
                      urls: "turn:asia.relay.metered.ca:80",
                      username: import.meta.env.VITE_STUN_UNAME,
                      credential: import.meta.env.VITE_STUN_PSWD,
                    },
                    {
                      urls: "turn:asia.relay.metered.ca:80?transport=tcp",
                      username: import.meta.env.VITE_STUN_UNAME,
                      credential: import.meta.env.VITE_STUN_PSWD,
                    },
                    {
                      urls: "turn:asia.relay.metered.ca:443",
                      username: import.meta.env.VITE_STUN_UNAME,
                      credential: import.meta.env.VITE_STUN_PSWD,
                    },
                    {
                      urls: "turns:asia.relay.metered.ca:443?transport=tcp",
                      username: import.meta.env.VITE_STUN_UNAME,
                      credential: import.meta.env.VITE_STUN_PSWD,
                    },
              
                    // { urls: "stun:stun.l.google.com:19302" },
                    // { urls: "stun:stun.l.google.com:5349" },
                    // { urls: "stun:stun1.l.google.com:3478" },
                    // { urls: "stun:stun1.l.google.com:5349" },
                    // { urls: "stun:stun2.l.google.com:5349" },
                    // { urls: "stun:stun3.l.google.com:3478" },
                    // { urls: "stun:stun3.l.google.com:5349" },
                    // { urls: "stun:stun4.l.google.com:19302" },
                    // { urls: "stun:stun4.l.google.com:5349" }
                    ] // STUN server to help with NAT traversal
                    
                    
                  }
                 );
               // Create a new room in Firestore




               stream.getTracks().forEach(track => {
                console.log("== Adding track: ==", track);
                peerConnection.addTrack(track, stream);
            });

              //  viewerId=roomDocRef.id;
              console.log(peerConnection);

              
              
              
              
              const viewerRef=collection(roomDocRef,`${viewerId}`)
              const viewerDocRef=doc(viewerRef,viewerDocId);



              const roomSnapshot=await getDoc(roomDocRef);
              console.log(roomSnapshot.id);
              
              try {
                if(roomSnapshot?.exists())
                {
                  if(!roomSnapshot?.data()?.offer)
                  {
                    const offer = await peerConnection.createOffer();
                    await peerConnection.setLocalDescription(offer);
  
                                    
                  const roomWithOffer = {
                    offer: {
                      type: offer.type,
                      sdp: offer.sdp
                    }
                  }
                  
                  
                   setDoc(roomDocRef, roomWithOffer).then(()=>{
                    console.log("Nice");

                    
                   }).catch((err)=>console.error(err)
                   );
                 console.log("Offer created and saved to Firestore");
  
                  }
                }
              } catch (error) {
                console.error(error)
              }

                 


                 
                 //  await setDoc(roomRef,{offer});
                //  peerConnection.onicecandidate =async (event) => {
                //    if (event.candidate) {
                //      console.log("===offerIceCandidates===");
                //      console.log(event.candidate.toJSON());



                //     await updateDoc(viewerDocRef, {
                //       "offerIceCandidates": arrayUnion(event.candidate.toJSON())
                //     });
                //    }
                //  };
                 
                const offerIceCandidates=collection(viewerDocRef,"offerIceCandidates")

                peerConnection.onicecandidate =async event => {
                  if (event.candidate) {
                    console.log("===offerCandidates===");
                    console.log(event.candidate.toJSON());
                    await addDoc(offerIceCandidates,event.candidate.toJSON());
                  }
                };
                

                 

                 
                 
               


                 unsubBroadcasterRef.current = onSnapshot(viewerDocRef, async (snapshot) => {
                  

                    if (snapshot.exists()) {
                      const data = snapshot.data();
                      // console.log('Room Got updated:', snapshot.id);
                  
                      if (data?.answer && !peerConnection.currentRemoteDescription) {
                        const answer = new RTCSessionDescription(data.answer);
                        console.log("Answer was recieved and setRemoteDecsription");
                         peerConnection.setRemoteDescription(answer).then(()=>{

                          const answerIceCandidates=collection(viewerDocRef,"answerIceCandidates")
                          unsubViewerRef.current = onSnapshot(answerIceCandidates, (snapshot) => {
                            snapshot.docChanges().forEach(async (change) => {
                              console.log("change in answerCandidates");
                          
                              if (change.type === 'added') {
                                console.log("%%%% answerCandidates added %%%%");
                          
                                const candidate = new RTCIceCandidate(change.doc.data());
                                console.log("Ice candidate of viewer ", candidate);
                          
                                await peerConnection.addIceCandidate(candidate);
                              }
                            });
                          });

  
                        }).catch(err=>console.log(err)
                        )
                      }
                    } else {
                      console.log("Viewer document not found:", viewerDocRef.id);
                    }

                  
                });




                peerConnection.addEventListener('icegatheringstatechange', () => {
                  console.log(
                      `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
                });
                
                // console.log(peerConnection.connectionState);

                
          
                peerConnection.addEventListener('connectionstatechange', (event) => {
                  console.log(`Connection state change: ${peerConnection.connectionState}`);
                  console.log(peerConnection.connectionState);
                  
          
                  if(peerConnection.connectionState==="connected")
                    {
                      //unsubscribe to listeners
                      if (unsubBroadcasterRef.current) unsubBroadcasterRef.current();
                      if (unsubViewerRef.current) unsubViewerRef.current();
                      // if (unsub.current) unsub.current();
              
              
                      console.log("connected 🥳");
              
                      const roomsRef = collection(db,'rooms');
                      // const roomDocRef=doc(roomsRef);
                      const viewerRef=collection(roomDocRef,`${viewerId}`)
                      const viewerDocRef=doc(viewerRef,viewerDocId);
                      console.log(viewerDocRef);

                      getDoc(viewerDocRef).then((doc)=>{
                        if(doc.exists())
                        {
                          console.log("doc exists");

                          deleteDoc(viewerDocRef).then(()=>{
                           console.log("viewer deleted");
    
                           
                          }).catch((err)=>{
                           console.log("viewer not deleted");
                           console.error(err);
                           
                          })

                        }
                        else
                        {
                          console.log("doc empty");
                          
                        }
                      }).catch((err)=>{
                        console.error(err);
                        
                      })
              
                      
                    }
          
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
          
                peerConnection.oniceconnectionstatechange = () => {
                  console.log(`ICE connection state change: ${peerConnection.iceConnectionState}`);
                  
                  if (peerConnection.iceConnectionState === 'failed') {
                    console.error("ICE connection failed. Restarting ICE...");
                    peerConnection.restartIce(); // Triggers ICE restart
                  } else if (peerConnection.iceConnectionState === 'disconnected') {
                    console.warn("ICE connection is disconnected.");
                    // Optionally, attempt to reconnect if it remains in disconnected state
                  }
                };
          
 


     
 
             }
             
                 const usersRef = collection(db,'users');
                 try {
                  
                   const q = query(usersRef, where("uid", "==", currentUser?.uid));
                   const querySnapshot = await getDocs(q);
                   
                   if (querySnapshot.empty) {
                     console.log("No user found with the provided UID.");
                     return;
                   }
                   // Iterate through results and update the userID field
                   querySnapshot.forEach(async (docSnapshot) => {
                     const userRef = doc(db, 'users', docSnapshot.id); // Get the document reference
                     await updateDoc(userRef, {
                       "roomID": roomDocRef.id,
                       "viewerDocId": viewerDocId // Update userID field
                     });
                     console.log("User ID updated successfully for:", docSnapshot.id);
                   });
               
                   
                 } catch (error) {
                   console.error("Error updating user ID:", error);
                 }
                 
                 await setDoc(roomDocRef,{"broadcasterId":currentUser?.uid})
                 console.log(currentUser?.uid);
                 


                // Listen for changes in the 'viewers' array
             unsub.current= onSnapshot(roomDocRef,docSnapshot => {
                if (docSnapshot.exists()) {
                
                      console.log("change in viewer list ");
                      
                      const roomData = docSnapshot?.data();
                      let viewers = roomData?.viewers ;
                      if(viewers!==undefined)
                      {
                        
                        console.log('Current viewers:', viewers);
                        console.log("recently added viewer 🕶️👓",viewers.slice(-1));
                        

                        createOffer(viewers?.slice(-1));

                      }
                      
                } 
              }, (error) => {
                console.error('Error getting document:', error);
              });
             
             //start x (n)


               

             
 
 

       } catch (error) {
          console.log(error);
          
       }
            

       

      //  peerConnection.addEventListener('icegatheringstatechange', () => {
      //   console.log(
      //       `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
      // });
      
      // // console.log(peerConnection.connectionState);
      // peerConnection.onconnectionstatechange((ev)=>{
      //   console.log(ev);
        
      // })
      

      // peerConnection.addEventListener('connectionstatechange', (event) => {
      //   console.log(`Connection state change: ${peerConnection.connectionState}`);
      //   console.log(peerConnection.connectionState);
        

      //   if(peerConnection.connectionState==="connected")
      //     {
      //       //unsubscribe to listeners
      //       if (unsubBroadcasterRef.current) unsubBroadcasterRef.current();
      //       if (unsubViewerRef.current) unsubViewerRef.current();
      //       if (unsub.current) unsub.current();
    
    
      //       console.log("connected 🥳");
    
      //       const roomsRef = collection(db,'rooms');
      //       const roomDocRef=doc(roomsRef);
      //       const viewerRef=collection(roomDocRef,`${viewerId}`)
      //       const viewerDocRef=doc(viewerRef,viewerDocId);
    
      //        deleteDoc(viewerDocRef).then(()=>{
      //         console.log("viewer deleted");
              
      //        }).catch((err)=>{
      //         console.log("viewer not deleted");
      //         console.error(err);
              
      //        })
            
      //     }

      // });
    
      // peerConnection.addEventListener('signalingstatechange', () => {
      //   console.log(`Signaling state change: ${peerConnection.signalingState}`);
      // });
    
      // peerConnection.addEventListener('iceconnectionstatechange ', () => {
      //   console.log(
      //       `ICE connection state change: ${peerConnection.iceConnectionState}`);
      // });

      // peerConnection.addEventListener('track', (event) => {
      //   console.log(
      //       `ICE connection state change: ${peerConnection.iceConnectionState}`);
      //       console.log(event);
            
      // });

      // peerConnection.oniceconnectionstatechange = () => {
      //   console.log(`ICE connection state change: ${peerConnection.iceConnectionState}`);
        
      //   if (peerConnection.iceConnectionState === 'failed') {
      //     console.error("ICE connection failed. Restarting ICE...");
      //     peerConnection.restartIce(); // Triggers ICE restart
      //   } else if (peerConnection.iceConnectionState === 'disconnected') {
      //     console.warn("ICE connection is disconnected.");
      //     // Optionally, attempt to reconnect if it remains in disconnected state
      //   }
      // };


      //clear viewer collection after the connected


      


      };



      

    const stopStreaming=() => { 

     }
      
      
      
  return (
    <>
    {/* <button className='text-2xl mx-8 rounded-md p-3 my-3 bg-green-500' onClick={startBroadcast}>
        Start
    </button> */}
    <button className='text-2xl mx-8 rounded-md p-3 my-3 bg-red-500' onClick={stopBroadCast}>
        Stop
    </button>

    <video id='localVideo' width={1280} height={720} className='mx-auto border-cyan-500 rounded-2xl border-4' autoPlay playsInline muted ></video>


    <button className='text-2xl mx-8 rounded-md p-3 my-3 bg-green-300' onClick={startBroadcast}>
        Go Live 🔴
    </button>

    <button className='text-2xl mx-8 rounded-md p-3 my-3 bg-green-300' onClick={stopStreaming}>
        End Live 
    </button>
    </>
  )
}

export default LiveStream