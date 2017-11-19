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
  $(".button-collapse").sideNav({
    draggable: true,
  });
  $('select').material_select();
});

var storageRef = firebase.storage().ref();
var db = firebase.database();
var uid;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var dbRef = db.ref('users/' + user.uid);
    dbRef.once('value').then(function(snapshot) {
      if (snapshot.exists() && snapshot.val().email != undefined) {
        console.log("Document data:", snapshot.val());
        if (typeof authChange == 'function') { 
          uid = user.uid;
          authChange(user.uid, snapshot.val());
        }
      } else {
        if (window.location.pathname.toString() != "/profile.html") {
          window.location.replace("/profile.html");
        } else {
          Materialize.toast("Please update user information", 2000);
          if (typeof authChange == 'function') { 
            authChange(user.uid, undefined);
          }
          db.ref("users/" + user.uid + "/photoURL").once("value").then(function(snapshot) {
            if (!snapshot.exists()) {
              db.ref("users/" + user.uid).update({
                photoURL: user.photoURL
              })
              db.ref("shared_data/public_data/" + user.uid).update({
                photoURL: user.photoURL
              })
            }
          });
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