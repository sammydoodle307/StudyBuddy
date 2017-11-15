
function authChange(uid, data) {
   console.log(uid);
}


$( document ).ready(function(){
  

  // $('.chips').on('chip.delete', function(e, chip){
  //   console.log(chip);
  //   // you have the deleted chip here
  // });

  // $('.chips').on('chip.select', function(e, chip){
  //   console.log(chip);
  //   // you have the selected chip here
  // });
});


var autocomplete_data = {}
var course_data = {}
db.collection("courses").get().then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
    // console.log(doc.id, " => ", doc.data());
    // console.log(doc.data());
    autocomplete_data[doc.id] = null;
    course_numbers = Object.keys(doc.data());
    course_data[doc.id] = {}
    for (var i = 0; i < course_numbers.length; i++) {
      course_data[doc.id][course_numbers[i]] = null;
    }
  });
  console.log(course_data);
  $('.chips-autocomplete').material_chip({
    placeholder: 'Curriculum Name',
    secondaryPlaceholder: 'Course Number',
    autocompleteOptions: {
      data: autocomplete_data,
      limit: 6,
      minLength: 1
    }
  });
  $('.chips').on('chip.add', function(e, chip){
    chipAdded(chip);
  });
});

function chipAdded(chip) {
  if (isNaN(chip.tag)) {
    $('.chips-autocomplete').material_chip({
      placeholder: 'Curriculum Name',
      secondaryPlaceholder: 'Course Number',
      data: [{
        tag: chip['tag'],
      }],
      autocompleteOptions: {
        data: course_data[chip.tag],
        limit: 10,
        minLength: 1
      }
    });
  } else {

  }
  console.log($(".input")[0]);
  sleep(500);
  $(".input")[0].focus()
}
