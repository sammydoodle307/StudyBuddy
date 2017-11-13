// Initialize Firebase
var config = {
  apiKey: "AIzaSyAwwg84Hj6EpSMc7RDxI3FGlzMEQojKNWo",
  authDomain: "studybuddy-19f01.firebaseapp.com",
  databaseURL: "https://studybuddy-19f01.firebaseio.com",
  projectId: "studybuddy-19f01",
  storageBucket: "studybuddy-19f01.appspot.com",
  messagingSenderId: "665903783375"
};
firebase.initializeApp(config);


$( document ).ready(function(){
  $(".button-collapse").sideNav();
  $('select').material_select();
});

var storageRef = firebase.storage().ref();
var db = firebase.firestore();

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var docRef = db.collection("users").doc(user.uid);
    docRef.get().then(function(doc) {
      console.log(doc.exists);
      if (doc.exists) {
        console.log("Document data:", doc.data());
        if (typeof authChange == 'function') { 
          authChange(user.uid, doc.data());
        }
      } else {
        if (window.location.pathname.toString() != "/profile.html") {
          window.location.replace("/profile.html");
        } else {
          Materialize.toast("Please update user information", 2000);
          if (typeof authChange == 'function') { 
            authChange(user.uid, undefined);
          }
        }
      }
    })
  } else if (window.location.pathname.toString() != "/login.html") {
    window.location.replace("/login.html");
  }
});

function logout() {
  firebase.auth().signOut().then(function() {
    console.log('Signed Out');
  }, function(error) {
    console.error('Sign Out Error', error);
  });
}

var addEvent = function(object, type, callback) {
  if (object == null || typeof(object) == 'undefined') return;
  if (object.addEventListener) {
      object.addEventListener(type, callback, false);
  } else if (object.attachEvent) {
      object.attachEvent("on" + type, callback);
  } else {
      object["on"+type] = callback;
  }
};