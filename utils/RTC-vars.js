// // Saving the response in the iceServers array
// const iceServers = await response.json();

export const peerConnection = new RTCPeerConnection(
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
      ,
      // iceCandidatePoolSize: 10,
    }
);

//  export  let localStream=null;
//   export let remoteStream=null;

  