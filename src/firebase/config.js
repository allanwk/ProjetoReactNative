// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAedrloHDg9WcNl13dC_c0FBGKeB5OhkBA",
    authDomain: "myhealth-19126.firebaseapp.com",
    projectId: "myhealth-19126",
    storageBucket: "myhealth-19126.appspot.com",
    messagingSenderId: "139653810937",
    appId: "1:139653810937:web:992e8ec865c96b9fb4f028"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth_mod = getAuth(app);
const storage = getStorage(app);
const db = initializeFirestore(app, { experimentalForceLongPolling: true })

export { auth_mod, db, storage };