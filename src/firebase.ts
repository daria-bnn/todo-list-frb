// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCVPTm8diUKmECU75Aa6vVD7iCir3woskc',
  authDomain: 'todo-frb.firebaseapp.com',
  projectId: 'todo-frb',
  storageBucket: 'todo-frb.appspot.com',
  messagingSenderId: '325990290599',
  appId: '1:325990290599:web:55be0ec81213eebc157782',
  measurementId: 'G-8EVQHMKK6Y',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
