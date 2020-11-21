import  * as firebase from 'firebase';
import '@firebase/firestore';
import "@firebase/auth";
class Firestore{
  constructor(){
    if(!firebase.apps.length){
        firebase.initializeApp({
          apiKey: "AIzaSyCnX22ROFfW8SXVYLcFFCqqMKkQq-LrCxg",
          authDomain: "cpedrink.firebaseapp.com",
          databaseURL: "https://cpedrink.firebaseio.com",
          projectId: "cpedrink",
          storageBucket: "cpedrink.appspot.com",
          messagingSenderId: "997146337679",
          appId: "1:997146337679:web:f3756157ddbd5f54dbabfa",
          measurementId: "G-4W9N9TL15C"
        }  
      )
    }
    else{
      console.log('firebase app already running...')
    }
  }
  // addUser=(User,success,reject)=>{
  //   User.createdDate=firebase.firestore.FieldValue.serverTimestamp();
  //   firebase.firestore().collection('User').add(User)
  //   .then(function (docRef) {
  //     success(docRef);
  //     })
  //   .catch(function (error) {
  //     reject(error);
  //   });
  // }
  
  signIn=(email,password,success,reject)=>{
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
      success(user)
    })
    .catch((error) => {
      reject(error)
    });
  }
  signOut=(success,reject)=>{
    firebase.auth().signOut()
    .then(function(){
      success(null);
    })
    .catch(function(error){
      reject(error);
    });
  }
  listeningCurrentUser=(getSuccess)=>{
    firebase.auth().onAuthStateChanged(function(user){
      getSuccess(user);
      });  
  }
  createUser=(email,password,reject)=>{
    firebase.auth().createUserWithEmailAndPassword(email,password)
    .then((user) => {
      console.log("firestore create success")
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: "Jane Q. User",
        photoURL: "https://example.com/jane-q-user/profile.jpg"
      }).then(function() {
        console.log("firestore update user success")
      }).catch(function(error) {
        console.log("firestore update user fail")
      });
    })
    .catch(function(error){
      reject(error);
    });
  }
  recoverAccount=(email,success,unsuccess)=>{
    firebase.auth().sendPasswordResetEmail(email)
    .then(function(){
      success(null);
    })
    .catch(function(error){
      unsuccess(error);
    });
  } 
  
}
const firestore = new Firestore();
export default firestore;