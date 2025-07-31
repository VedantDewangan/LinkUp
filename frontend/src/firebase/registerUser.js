import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from "firebase/auth";
import { firebaseApp } from "./firebase";

export const registerUser = async ({ email, password }) => {
  try {
    const firebaseAuth = getAuth(firebaseApp);
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    const user = userCredential.user;
    await sendEmailVerification(user);
  } catch (error) {
    console.error("Firebase registration error:", error.message);
    throw error;
  }
};
