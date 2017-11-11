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

function updateProfile(storage) {
  storage.getDownloadURL().then(function(url) {
    console.log(url);
    var user = firebase.auth().currentUser;
    user.updateProfile({
      photoURL: url
    }).then(function() {
      document.getElementById("profile-pic").src = user.photoURL;
      console.log("Updated Photo URL");
    });
  });
}

var uploadCrop = new Croppie(document.getElementById('upload-demo'), {
    enableExif: true,
    viewport: {
        width: 250,
        height: 250,
        type: 'square'
    },
    boundary: {
        width: 300,
        height: 300
    },
    enableOrientation: true
});

$('#upload').on('change', function () { 
   var reader = new FileReader();
    reader.onload = function (e) {
      uploadCrop.bind({
         url: e.target.result
      }).then(function(){
         console.log('jQuery bind complete');
      });
      
    }
    reader.readAsDataURL(this.files[0]);
});


$('.upload-result').on('click', function (ev) {
   uploadCrop.result({
      type: 'blob',
      size: 'viewport'
   }).then(function (resp) {
    console.log(resp);
    storageRef.child('users/' + uid + '/profile.png').put(resp).then(function(snapshot) {
      console.log('Uploaded profile pic!');
      updateProfile(storageRef.child('users/' + uid + '/profile.png'));
    });
   });
});


function rotate(deg) {
  uploadCrop.rotate(deg);
}
