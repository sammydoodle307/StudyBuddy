firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
   document.getElementById("profile-pic").src = photoURL;
  }
});

$( document ).ready(function(){
  $('.modal').modal({
    ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
      $("#croppie-container").show();
      initCroppie();
    },
    complete: function() {
      $("#croppie-container").hide();
    }
  });
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

var uploadCrop;

function initCroppie() {
  $('#upload').off("change");
  $('.upload-result').off("click");
  if (uploadCrop) {
    uploadCrop.destroy();
  }

  var width = Math.min($("#croppie-container").width(), 300);
  uploadCrop = new Croppie(document.getElementById('upload-demo'), {
    enableExif: true,
    viewport: {
        width: width - 50,
        height: width - 50,
        type: 'square'
    },
    boundary: {
        width: width,
        height: width
    },
    enableOrientation: true,
    showZoomer: false
  });

  $('#upload').on('change', function () { 
    if (this.files[0] != undefined) {
      var reader = new FileReader();
      reader.onload = function (e) {
        uploadCrop.bind({
          url: e.target.result
        }).then(function(){
           // console.log('jQuery bind complete');
        });
      }
      reader.readAsDataURL(this.files[0]);
    }
  });

  $('.upload-result').on('click', function (ev) {
     uploadCrop.result({
        type: 'blob',
        size: 500
     }).then(function (resp) {
      console.log(resp);
      document.getElementById("profile-pic").src = URL.createObjectURL(resp);
      storageRef.child('users/' + uid + '/profile.png').put(resp).then(function(snapshot) {
        console.log('Uploaded profile pic!');
        updateProfile(storageRef.child('users/' + uid + '/profile.png'));
      });
     });
  });

  $('#upload').trigger("change");
}


addEvent(window, "resize", function(event) {
  initCroppie();
});

$("#croppie-container").hide();


function rotate(deg) {
  uploadCrop.rotate(deg);
}


