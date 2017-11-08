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


$uploadCrop = $('#upload-demo').croppie({
    enableExif: true,
    viewport: {
        width: 200,
        height: 200,
        type: 'square'
    },
    boundary: {
        width: 300,
        height: 300
    }
});


$('#upload').on('change', function () { 
   var reader = new FileReader();
    reader.onload = function (e) {
      $uploadCrop.croppie('bind', {
         url: e.target.result
      }).then(function(){
         console.log('jQuery bind complete');
      });
      
    }
    reader.readAsDataURL(this.files[0]);
});


$('.upload-result').on('click', function (ev) {
   $uploadCrop.croppie('result', {
      type: 'canvas',
      size: 'viewport'
   }).then(function (resp) {
   });
});
