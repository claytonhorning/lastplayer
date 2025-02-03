// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDh5XT1CcxbqYt9OVfNIRm2eKIPexox97s",
  authDomain: "lastplayer-dcfb1.firebaseapp.com",
  projectId: "lastplayer-dcfb1",
  storageBucket: "lastplayer-dcfb1.appspot.com",
  messagingSenderId: "858062404970",
  appId: "1:858062404970:ios:1f1346d5bf37a12fecf913",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
