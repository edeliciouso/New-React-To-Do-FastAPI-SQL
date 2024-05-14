import React, { useState, useEffect,  useContext } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({ children }){
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isGoogleUser, setIsGoogleUser] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    }, [])

    async function initializeUser(user) {
        if (user) {
          // Retrieve the user's name if available
          const { displayName } = user;
    
          // Update the currentUser state with the user's name
          setCurrentUser({ ...user, displayName });
    
          // check if the auth provider is google or not
          const isGoogle = user.providerData.some(
            (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
          );
          setIsGoogleUser(isGoogle);
    
          setUserLoggedIn(true);
        } else {
          setCurrentUser(null);
          setUserLoggedIn(false);
        }
    
        setLoading(false);
      }

    const value = {
        userLoggedIn,
        isGoogleUser,
        currentUser,
        setCurrentUser
      };

    return (
        <AuthContext.Provider value={value}>
          {!loading && children}
        </AuthContext.Provider>
      );
      
}