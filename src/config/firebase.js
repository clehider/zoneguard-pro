import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBOMOvsa-v2_JPyXKHDEa2wPCMqF2R1lLA",
  authDomain: "zonasrondas.firebaseapp.com",
  projectId: "zonasrondas",
  storageBucket: "zonasrondas.firebasestorage.app",
  messagingSenderId: "134076732900",
  appId: "1:134076732900:web:d60410e88a48c468f2e3f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log('Firebase inicializado correctamente');

export { db };