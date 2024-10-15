import { useContext, createContext, useState, useEffect } from 'react'
import { auth, db } from '../../utils/init-firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getFirestore, doc, setDoc,updateDoc, addDoc, collection ,getDocs,query,where,onSnapshot,getDoc} from "firebase/firestore";



const AuthContext = createContext()



export default function AuthContextProvider({ children }) {

    const [currentUser, setCurrentUser] = useState(null)
    // const [userData,setUserData]=useState(null)

    const provider = new GoogleAuthProvider();

    const getUserDetailsById=async(uid)=>{
        const querySnapshot = await getDocs(query(collection(db, "users"), where("uid", "==", uid)));
       querySnapshot.forEach((doc) => 
        {
        setCurrentUser(doc.data());
        // //console.log(doc.data())
      })
    
      }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            //console.log(user);
            
            if (user) {
                getUserDetailsById(user?.uid);
                
            }
            else {

                setCurrentUser(null);
            }

        })

        return () => {
            unsubscribe()
        }
    }, [])


    useEffect(() => {
      ////console.log("Auth Rendered");
      

    }, [])
    

    function registerUzer(email, password) {

        return createUserWithEmailAndPassword(auth, email, password)
    }
    async function loginUzer(email, password) {

        return setPersistence(auth, browserLocalPersistence)
            .then(() => {
                // Now sign in the user
                return signInWithEmailAndPassword(auth, email, password);
            })
    }

    function logoutUzer() {
        return signOut(auth);
    }

    function loginWithProvider() {
        return signInWithPopup(auth, provider)

    }

    const value = {
        currentUser,
        setCurrentUser,
        registerUzer,
        loginUzer,
        logoutUzer,
        loginWithProvider,
        db

    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    // //console.log(useContext(AuthContext))
    return useContext(AuthContext)
}