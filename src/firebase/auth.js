import { auth } from './firebase';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { collection, doc, setDoc, getDoc, getFirestore } from 'firebase/firestore'; // Correct imports for Firestore

const db = getFirestore();
console.log(db);

// export const doCreateUserWithEmailAndPassword = async (email, password) => {
//     try {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         // Add user to Firestore 'users' collection
//         await addDoc(collection(db, 'users'), {
//             uid: userCredential.user.uid,
//             email: email
//         });
//         return userCredential.user; // Return the user object after successful creation
//     } catch (error) {
//         console.error("Error creating user:", error);
//         throw error;
//     }
// }

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Add user to Firestore 'users' collection
        const userRef = doc(db, 'users', userCredential.user.uid);
        // Create a subcollection 'todos' for the user
        const todosRef = collection(userRef, 'todos');
        await setDoc(userRef, { email: email });
        await setDoc(doc(todosRef, 'initialTodo'), { task: 'Welcome to TodoList', completed: false });
        return userCredential.user; // Return the user object after successful creation
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}


export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
}

// export const doSignInWithGoogle = async() => {
//     const provider = new GoogleAuthProvider();
//     const result = await signInWithPopup(auth, provider);
//     return result;
// }

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Check if the user already exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
  
      // If the user doesn't exist in Firestore, add them
      if (!userDoc.exists()) {
        await setDoc(userRef, { email: user.email });
      }
  
      return user;
    } catch (error) {
      // Handle error here, such as displaying a message to the user
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

export const doSignOut = () => {
    return auth.signOut();
}