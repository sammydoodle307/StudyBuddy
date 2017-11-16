
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
db.ref('courses').once("value").then(function(snapshot) {
  var data = snapshot.val();
  for (var currName in data) {
    autocomplete_data[currName] = null;
    var currCourses = data[currName];
    var course_numbers = Object.keys(currCourses);
    course_data[currName] = {}
    for (var i = 0; i < course_numbers.length; i++) {
      course_data[currName][course_numbers[i]] = null;
    }
  }
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
  $('.chips').on('chip.delete', function(e, chip){
    chipDeleted(chip);
  });
  $("#course-add > input").focus();
});

function updateSearch() {
  var chips = $('.chips-autocomplete').material_chip('data');
  if (chips.length > 0) {
    db.ref('courses/'+chips[0].tag).once("value").then(function(snapshot) {
      if (snapshot.exists()) {
        updateTable(snapshot.val(), chips);
      } else {
        console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });
  } else {
    document.getElementById("course-table-body").innerHTML = "";
  }
}

function updateTable(data, chips) {
  // console.log("Document data:", data);
  var table = document.getElementById("course-table-body");
  table.innerHTML = "";
  document.getElementById("table-loading").style.visibility = "visible";
  if (chips.length > 1) {
    for (var i = 1; i < chips.length; i++) {
      var course = data[chips[i].tag];
      addRow(table, course);
    }
  } else {
    for (var key in data) {
      var course = data[key];
      addRow(table, course);
    }
  }
  // $(".progress").hide();
  document.getElementById("table-loading").style.visibility = "hidden";
}

function addRow(table, course) {
  var row = document.createElement('tr');
  var curriculum = document.createElement('td');
  curriculum.appendChild(document.createTextNode(course.curriculum));
  row.appendChild(curriculum);
  var number = document.createElement('td');
  number.appendChild(document.createTextNode(course.number));
  row.appendChild(number);
  var name = document.createElement('td');
  name.appendChild(document.createTextNode(course.name.split("|")[0]));
  row.appendChild(name);
  table.appendChild(row);
}

function chipAdded(chip) {
  var chips = chip.tag.split(" ");
  if (chips.length > 1) {
    if (isNaN(chips[0])) {
      var start = 0;
      if (isNaN(chips[1])) {
        var initialChips = [{tag: chips[0].toUpperCase() + " " + chips[1].toUpperCase()}];
        start = 1;
      } else {
        var initialChips = [{tag: chips[0].toUpperCase()}];
      }
      
      for (var i = start; i < chips.length; i++) {
        if (!isNaN(chips[i])) {
          initialChips.push({tag: chips[i]});
        }
      }
      $('.chips-autocomplete').material_chip({
        placeholder: 'Curriculum Name',
        secondaryPlaceholder: 'Course Number',
        data: initialChips,
        autocompleteOptions: {
          data: course_data[chip.tag.toUpperCase()],
          limit: 10,
          minLength: 1
        }
      });
    }
  } else {
    if (isNaN(chip.tag)) {
      $('.chips-autocomplete').material_chip({
        placeholder: 'Curriculum Name',
        secondaryPlaceholder: 'Course Number',
        data: [{
          tag: chip['tag'].toUpperCase().replace(" ", ""),
        }],
        autocompleteOptions: {
          data: course_data[chip.tag.toUpperCase().replace(" ", "")],
          limit: 10,
          minLength: 1
        }
      });
    } else {
      // Test if first is num
    }
  }
  updateSearch();
  window.setTimeout(focusSearch, 50);
}

function focusSearch() {
  $("#course-add > input").focus();
}

function chipDeleted(chip) {
  if (isNaN(chip.tag)) {
    $('.chips-autocomplete').material_chip({
      placeholder: 'Curriculum Name',
      secondaryPlaceholder: 'Course Number',
      autocompleteOptions: {
        data: autocomplete_data,
        limit: 6,
        minLength: 1
      }
    });
  }
  updateSearch();
}
