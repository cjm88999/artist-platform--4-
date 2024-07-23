import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCUVIF0kx4RfF9UtELQmCUTaj2EoSZzj90",
  authDomain: "fir-cohort-5a6d3.firebaseapp.com",
  databaseURL: "https://fir-cohort-5a6d3-default-rtdb.firebaseio.com",
  projectId: "fir-cohort-5a6d3",
  storageBucket: "fir-cohort-5a6d3.appspot.com",
  messagingSenderId: "184607382290",
  appId: "1:184607382290:web:b7403f603acea9991df1cb",
  measurementId: "G-PRLN9SF4ZR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error setting persistence: ", error);
  });

export { auth, db, storage };
