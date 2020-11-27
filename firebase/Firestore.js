import * as firebase from 'firebase';
import '@firebase/firestore';
import "@firebase/auth";
import 'firebase/storage';
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
  addGroup=(data,success,reject)=>{
    firebase.firestore().collection('Group').add(data)
    .then(function (docRef) {
      success(docRef);
      })
    .catch(function (error) {
      reject(error);
    });
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
  };
  updateAccountStatusByID=(user,id,success,reject)=>{
    console.log("updateAccountByID")
    firebase.firestore().collection('User')
    .doc(id)
    .update({
      status:user.status
    })
    .then(function(){
      success(null);
    })
    .catch(function(error){
      reject(error)
    });
  };
  getAccountByStatus=(success,reject)=>{
    firebase.firestore().collection('User')
    .where('status','==','1')
    .get()
    .then(function(querySnapshot){
        success(querySnapshot);
    })
    .catch(function(error){
      reject(error);
    })
  }
  getFriend(id,getSuccess,getUnsuccess){
    firebase.firestore().collection("Group")
      .where('member', 'array-contains', id)
      .get()
      .then(function (querySnapshot) {
        getSuccess(querySnapshot);
      })
      .catch(function (error) {
        getUnsuccess(error);
      });
  }
  sendMessage(message,success,reject){
    console.log(message);
      firebase.firestore().collection('Message')
      .add(message)
      .then(function(dogRef){
        success(dogRef)
      })
      .catch(function(error){
        reject(error)
      });
  }
  listeningMessage(room,success,reject){
    console.log("listeningMessage")
    firebase.firestore().collection('Message')
    .where('roomId', '==' ,room)
    .onSnapshot(function(snapshot){
      var message=[];
      snapshot.docChanges().forEach(function(change){
        if(change.type==="added"){
          message.push(change.doc.data())
        }
      })
      success(message)
    },function(error){
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
//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
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
  //////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
  getAllSong= (success, reject) => {
    firebase
      .firestore()
      .collection('Song')
      .get()
      .then(function (querySnapshot) {
        success(querySnapshot);
      })
      .catch(function (error) {
        reject(error);
      });
  };
  //////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
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
  //////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
  getPostWithID(id, getSuccess, getUnsuccess) {
    let docRef =  firebase.firestore().collection('Post').doc(id);
    docRef.get()
      .then(function (doc) {
        getSuccess(doc);
      })
      .catch(function (error) {
        getUnsuccess(error);
      });
  }
  //////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
  addPost=(post,success,reject)=>{
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
  deletePostByID=(id,success,reject)=>{
    firebase.firestore().collection('Post')
    .doc(id)
    .delete()
    .then(function(){
      success(null)
    })
    .catch(function(error){
      reject(error)
    });
  };
  //////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
  
  //////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
  
  //////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
  deleteSongByID=(id,success,reject)=>{
    firebase.firestore().collection('Song')
    .doc(id)
    .delete()
    .then(function(){
      success(null)
    })
    .catch(function(error){
      reject(error)
    });
  };
  //////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////GET ALL FOOD FROM FIREBASE////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
getAllFood= (success, reject) => {
  firebase
    .firestore()
    .collection('OrderFood')
    .orderBy("createdDate","desc")
    .get()
    .then(function (querySnapshot) {
      success(querySnapshot);
    })
    .catch(function (error) {
      reject(error);
    });
};
//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
addOrderFood=(food,success,reject)=>{
  food.createdDate = firebase.firestore.FieldValue.serverTimestamp();
  firebase.firestore().collection('OrderFood').add(food)
  .then(function(docRef){
    success(docRef);
  })
  .catch(function(error){
      reject(error);
  });

  
};
//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
deleteFoodByID=(id,success,reject)=>{
  firebase.firestore().collection('OrderFood')
  .doc(id)
  .delete()
  .then(function(){
    success(null)
  })
  .catch(function(error){
    reject(error)
  });
};

}
const firestore = new Firestore();
export default firestore;