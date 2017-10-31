firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
   // document.getElementById("account-info").innerHTML += "<p>displayName: " + displayName + "</p>";
   // document.getElementById("account-info").innerHTML += "<p>email: " + email + "</p>";
   // document.getElementById("account-info").innerHTML += "<p>User ID: " + uid + "</p>";
   // document.getElementById("account-info").innerHTML += "<p>photoURL: <img style='width:50%' src='" + photoURL + "'></p>";
   document.getElementById("profile-pic").src = photoURL;
  }
});
