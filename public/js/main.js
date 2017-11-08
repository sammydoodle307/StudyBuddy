$( document ).ready(function(){
  $(".button-collapse").sideNav();
  $('.modal').modal();
});

firebase.auth().onAuthStateChanged(function(user) {
  console.log(window.location.pathname.toString());
  if (user) {
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
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