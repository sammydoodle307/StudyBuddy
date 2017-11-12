$( document ).ready(function(){
  $(".button-collapse").sideNav();
});

var storageRef = firebase.storage().ref();
var uid = "";
var photURL = "";

firebase.auth().onAuthStateChanged(function(user) {
  console.log(window.location.pathname.toString());
  if (user) {
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    uid = user.uid;
    var providerData = user.providerData;
  } else if (!(window.location.pathname.toString() == "/login.html")) {
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