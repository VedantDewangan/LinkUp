import {
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseApp } from "./firebase";
import axios from "axios";

export const login = async ({ email, password, currentUser }) => {
  try {
    const firebaseAuth = getAuth(firebaseApp);
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    const user = userCredential.user;
    if (!user.emailVerified) {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      await sendEmailVerification(user);
      throw {
        code: "auth/email-not-verified",
        message: "Please verify your email before logging in.",
      };
    } else {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/update/verify-link`,
        currentUser
      );
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
