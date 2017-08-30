  import firebase from 'firebase';

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAbcjGDj7D3_W-Pg5olqb8R2XPj85sREC0",
    authDomain: "msg-app-c02b8.firebaseapp.com",
    databaseURL: "https://msg-app-c02b8.firebaseio.com",
    projectId: "msg-app-c02b8",
    storageBucket: "msg-app-c02b8.appspot.com",
    messagingSenderId: "550449505319"
  };
  firebase.initializeApp(config);

  export const provider = new firebase.auth.GoogleAuthProvider();
  export const auth = firebase.auth();

  export default firebase;
