import * as firebase from 'firebase';
import '@firebase/firestore';
import "@firebase/auth";
class Firestore {
  constructor() {
    if (!firebase.apps.length) {
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
    else {
      console.log('firebase app already running...')
    }
  }
  getAccountWithID(id, getSuccess, getUnsuccess) {
    let docRef =  firebase.firestore().collection('User').doc(id);
    docRef.get()
      .then(function (doc) {
        getSuccess(doc);
      })
      .catch(function (error) {
        getUnsuccess(error);
      });
  }
  updateAccountByID=(user,id,success,reject)=>{
    console.log("updateAccountByID")
    firebase.firestore().collection('User')
    .doc(id)
    .update(user)
    .then(function(){
      success(null);
    })
    .catch(function(error){
      reject(error)
    });
  }
  getAccountByStatus=(success,reject)=>{
    firebase.firestore().collection('User')
    .where('status','==','0')
    .get()
    .then(function(querySnapshot){
        success(querySnapshot);
    })
    .catch(function(error){
      reject(error);
    })
  }
  signIn = (email, password, success, reject) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        success(user)
      })
      .catch((error) => {
        reject(error)
      });
  }
  signOut = (success, reject) => {
    firebase.auth().signOut()
      .then(function () {
        success(null);
      })
      .catch(function (error) {
        reject(error);
      });
  }
  listeningCurrentUser = (getSuccess) => {
    firebase.auth().onAuthStateChanged(function (user) {
      getSuccess(user);
    });
  }
  createUser = (email, password,name, reject) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        console.log("firestore create success")
        var user = firebase.auth().currentUser;
        user.updateProfile({
          displayName: name,
        }).then(function () {
          console.log("firestore update user success")
          var account={
            fb:"-",
            ig:"-",
            line:"-",
            caption:"-",
            avatar:"-",
            type:"User",
            status:"0"
          }
          account.name=name
          account.createdDate=firebase.firestore.FieldValue.serverTimestamp();
          firebase.firestore().collection('User').doc(user.uid).set(account)
            .then(function (docRef) {
              console.log("firestore add user success")
            })
            .catch(function (error) {
              console.log("firestore update user success")
            });
        }).catch(function (error) {
          console.log("firestore update user fail")
        });
      })
      .catch(function (error) {
        reject(error);
      });
  }
  recoverAccount = (email, success, unsuccess) => {
    firebase.auth().sendPasswordResetEmail(email)
      .then(function () {
        success(null);
      })
      .catch(function (error) {
        unsuccess(error);
      });
  }

  addSong=(song,success,reject)=>{
    song.createdDate = firebase.firestore.FieldValue.serverTimestamp();
    firebase.firestore().collection('Song').add(song)
    .then(function(docRef){
      success(docRef);
    })
    .catch(function(error){
        reject(error);
    });
  };
  getAllSong= (success, reject) => {
    firebase
      .firestore()
      .collection('Song')
      .orderBy("createdDate")
      .get()
      .then(function (querySnapshot) {
        success(querySnapshot);
      })
      .catch(function (error) {
        reject(error);
      });
  };
  getAllPost= (success, reject) => {
    firebase
      .firestore()
      .collection('Post')
      .orderBy('createdDate','desc')
      .get()
      .then(function (querySnapshot) {
        success(querySnapshot);
      })
      .catch(function (error) {
        reject(error);
      });
  };
  addPost=(post,success,reject)=>{
    console.log('firebase post')
    post.createdDate = firebase.firestore.FieldValue.serverTimestamp();
    firebase.firestore().collection('Post').add(post)
    .then(function(docRef){
      success(docRef);
    })
    .catch(function(error){
        reject(error);
    });
  };
//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
  
//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

}
const firestore = new Firestore();
export default firestore;