import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const config = {
  apiKey: "AIzaSyCzjCVO7z6ezvKayVejY8C9LPQdbsUX0Ak",
  authDomain: "react-blog-demo-b5b7c.firebaseapp.com",
  projectId: "react-blog-demo-b5b7c",
  storageBucket: "react-blog-demo-b5b7c.appspot.com",
  messagingSenderId: "907595585255",
  appId: "1:907595585255:web:8f600dd1324a90933af442",
};
firebase.initializeApp(config);
export default firebase;