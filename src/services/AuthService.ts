import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

async function ensureUserProfile(user: User, role = 'student') {
  const userDoc = doc(db, 'users', user.uid);
  const existing = await getDoc(userDoc);
  if (!existing.exists()) {
    await setDoc(userDoc, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      role,
      createdAt: new Date().toISOString()
    });
  }
}

export const AuthService = {
  async register(email: string, pass: string, role: string = 'student') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;
      
      // Initialize profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        role: role,
        createdAt: new Date().toISOString()
      });
      
      return user;
    } catch (error) {
      console.error("Registration Error:", error);
      throw error;
    }
  },

  async login(email: string, pass: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      return userCredential.user;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  },

  async loginWithGoogle() {
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const user = credential.user;
      await ensureUserProfile(user);
      return user;
    } catch (error) {
      console.error("Google Login Error:", error);
      throw error;
    }
  },

  async loginWithGithub() {
    try {
      const credential = await signInWithPopup(auth, githubProvider);
      const user = credential.user;
      await ensureUserProfile(user);
      return user;
    } catch (error) {
      console.error("GitHub Login Error:", error);
      throw error;
    }
  },

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
      throw error;
    }
  },

  onAuthSync(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  async getUserProfile(uid: string) {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  }
};
