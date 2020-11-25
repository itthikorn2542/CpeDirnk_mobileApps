import * as firebase from 'firebase';
import 'firebase/storage';

class Storage {
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
        });
      } else {
        console.log('firebase apps already running...');
      }
    }
  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  uploadToFirebase = async (uri, id, success, reject) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    console.log('fetch ok')
    var ref = firebase
      .storage()
      .ref()
      .child('imagePost/' + id);
    ref
      .put(blob)
      .then(function (snapshot) {
        let uri = snapshot.ref.getDownloadURL()
        .then(function(uri){
            success(uri);
        })
        
      })
      .catch(function (error) {
        reject(error);
      });
  };
  ////////////////////////////////////////////////////////////////////////
  uploadToFirebase2 = async (uri, keys, success, reject,uploading) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    var uploadTask = firebase.storage().ref().child('imagePost/' + keys).put(blob);

    uploadTask.on('state_changed',function(snapshot){
      var progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
      uploading(progress);
    },function(error){
      reject(error);
    },function(){
      uploadTask.snapshot.ref.getDownloadURL()
      .then(function(uri){
        success(uri)
      })
    })
      
  };
  /////////////////////////////////////////////////////////////////////////
  uploadProfileToFirebase = async (uri, keys, success, reject,uploading) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    var uploadTask = firebase.storage().ref().child('imageProfile/' + keys).put(blob);

    uploadTask.on('state_changed',function(snapshot){
      var progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
      uploading(progress);
    },function(error){
      reject(error);
    },function(){
      uploadTask.snapshot.ref.getDownloadURL()
      .then(function(uri){
        success(uri)
      })
    })
      
  };


  ////////////////////////////////////////////////////////////////////////
    
  
    getList=(success,reject)=>{
      var ref =firebase.storage().ref().child('image');
      ref.listAll()
      .then(function(res){
        success(res);
      })
      .catch(function(error){
        reject(error);
      });
    }
  }
  const storage = new Storage();
  export default storage;
