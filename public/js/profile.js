$( document ).ready(function(){
  $('.modal').modal({
    ready: function(modal, trigger) {
      initCroppie();
      $("#croppie-container").show();
    },
    complete: function(modal, trigger) {
      $("#croppie-container").hide();
    }
  });
  $("#croppie-container").hide();
});

function authChange(uid, data) {
  if (data == undefined) {
    var user = firebase.auth().currentUser;
    var photoURL = user.photoURL;
    if (photoURL == null) {
      photoURL = "defaultprofile.jpg";
    }
    var name = user.displayName.split(" ");
    document.getElementById("profile-pic").src = photoURL;
    document.getElementById("first").value = name[0];
    document.getElementById("last").value = name[name.length - 1];
    document.getElementById("email").value = user.email;
    Materialize.updateTextFields();
  } else {
    var user = firebase.auth().currentUser;
    var photoURL = user.photoURL;
    if (photoURL == null) {
      photoURL = "defaultprofile.jpg";
    }
    document.getElementById("profile-pic").src = photoURL;
    document.getElementById("first").value = data["first"];
    document.getElementById("last").value = data["last"];
    document.getElementById(data["preferred"]).checked = true;
    document.getElementById("email").value = user.email;
    document.getElementById("phone").value = data["phone"];
    document.getElementById("year").value= data["year"];
    document.getElementById("bio").value = data["bio"];
    $('select').material_select();
    Materialize.updateTextFields();
  }
}

function loadProfile(storage) {
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

function updateInfo() {
  var info = {}
  info["first"] = document.getElementById("first").value;
  info["last"] = document.getElementById("last").value;
  info["preferred"] = $("input[name=preferred]:checked").val();
  info["phone"] = document.getElementById("phone").value;
  info["year"] = document.getElementById("year").value;
  info["bio"] = document.getElementById("bio").value;
  blankValue = false;
  for (var key in info) {
    var value = info[key];
    if (value == "") {
      blankValue = true;
      document.getElementById(key).classList.add("invalid");
    }
  }
  $('select').material_select();

  if (!blankValue) {
    var user = firebase.auth().currentUser;
    console.log(user.uid)
    db.collection("users").doc(user.uid).set({
      first: info["first"],
      last: info["last"],
      preferred: info["preferred"],
      phone: info["phone"],
      year: info["year"],
      bio: info["bio"]
    }).then(function() {
      console.log("Updated info!");
    });
  }
}

var uploadCrop;

$("#year").on("change", function() {
  document.getElementById("year").classList.remove("invalid");
  document.getElementById("year").classList.add("valid");
  $('select').material_select();
  console.log("Test")
});

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
    var uid = firebase.auth().currentUser.uid;
    uploadCrop.result({
      type: 'blob',
      size: 500
    }).then(function (resp) {
      document.getElementById("profile-pic").src = URL.createObjectURL(resp);
      storageRef.child('users/' + uid + '/profile.png').put(resp).then(function(snapshot) {
        console.log('Uploaded profile pic!');
        loadProfile(storageRef.child('users/' + uid + '/profile.png'));
      });
    });
  });
  $('#upload').trigger("change");
}

addEvent(window, "resize", function(event) {
  initCroppie();
});

document.getElementById('phone').addEventListener('keyup',function(evt){
  var phoneNumber = document.getElementById('phone');
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  phoneNumber.value = phoneFormat(phoneNumber.value);
});

document.getElementById('phone').value = phoneFormat(document.getElementById('phone').value);

function numberPressed(evt){
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  if(charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 36 || charCode > 40)){
    return false;
  }
  return true;
}

function phoneFormat(input){
  input = input.replace(/\D/g,'');
  input = input.substring(0,10);
  var size = input.length;
  if(size == 0){
    input = input;
  } else if (size < 4){
    input = '('+input;
  } else if (size < 7){
    input = '('+input.substring(0,3)+') '+input.substring(3,6);
  } else {
    input = '('+input.substring(0,3)+') '+input.substring(3,6)+' - '+input.substring(6,10);
  }
  return input; 
}

