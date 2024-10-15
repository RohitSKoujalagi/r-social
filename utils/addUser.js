import { getFirestore, doc, setDoc, addDoc, collection } from "firebase/firestore";


const storeUser=async(user)=>{
try{
    const docRef= await addDoc(collection(db,"users"),
    {
      uid: user.uid,
      username: user.displayName,
      email: user.email,
      profilePictureURL: user.providerData[0].photoURL,
      bio: 'This is a bio',
      followers: [],
      following: [],
      accountPrivacy: 'public',
      notificationPreferences: {
        email: true,
        push: true
      },
      twoFactorEnabled: false,
      posts: [],
      accountStatus: 'active',
      verificationStatus: 'unverified',
      postsLiked:[]
    }
    //
    ).then((res)=>{

      ////console.log("Document written with ID: ", docRef.id);
      ////console.log("Response is", res._key.path.segments[1]);
    }).catch((err)=>{
        console.error(err)
    })
  }
  catch(err)
  {
    console.error(err)
  }

}

export default storeUser;