// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDeiFhjjtvx2aUuhxy0JNNBktdQ9cYlhOk",
    authDomain: "ai-project-management-97c0e.firebaseapp.com",
    projectId: "ai-project-management-97c0e",
    storageBucket: "ai-project-management-97c0e.firebasestorage.app",
    messagingSenderId: "857244791086",
    appId: "1:857244791086:web:35be9ad73cc1e865534abf",
    measurementId: "G-P8EV6LD300"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);