// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
import { initializeApp } from 'firebase/app';
	import { getFirestore } from 'firebase/firestore';
	import { getStorage } from 'firebase/storage';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCg-XmCsyjqjQ-1_9C_ZNNahz1zD-zxvdU",
  authDomain: "latihanw11.firebaseapp.com",
  projectId: "latihanw11",
  storageBucket: "latihanw11.firebasestorage.app",
  messagingSenderId: "1086555123390",
  appId: "1:1086555123390:web:2ad94f0c6200f1516df8ef"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
	export const storage = getStorage();
	export { app };