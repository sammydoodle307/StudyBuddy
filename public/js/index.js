
var search = $('input.autocomplete');
var course_data = {};
var curr_data = {};
var number_data = {};
var user_courses = {};

$(document).ready(function(){
  $('#addCourse').modal({
    ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
      focusSearch();
    },
    complete: function(modal, trigger) {
      $("#autocomplete-input").val("");
      updateCourseTable(null, {});
    },
    startingTop: '0%', // Starting top style attribute
    endingTop: '0%', // Ending top style attribute
  });
  $('#confirmRemoveCourse').modal();
  $('#userInfo').modal({
    ready: function(modal, trigger) {
      

      $('.carousel.carousel-slider').carousel({
        duration: 200,
        fullWidth: true,
        indicators: false,
        noWrap: false,
        // onCycleTo: function (ele, dragged) {
        //   console.log(ele);
        //   console.log($(ele).index()); // the slide's index
        //   console.log(dragged);
        // }
      });
      $('.carousel.carousel-slider').carousel("set", carouselIndex);
    }
  });
});

function authChange(uid, data) {
  console.log(uid);
  db.ref('users/' + uid + '/courses').on('value', function(snapshot) {
    user_courses = snapshot.val();
    var opened;
    $(".collapsible-header.active > .not-collapse > i").each(function() {
      opened = this.dataset.courseNumber;
    })

    $(".collapsible-header > .not-collapse > i").each(function() {
      db.ref('user_courses/' + this.dataset.courseNumber).off()
    })

    coursesUpdated(user_courses, opened);
    for (var cid in user_courses) {
      db.ref('user_courses/' + cid).on('value', function(snapshot, cid) {
        // console.log(snapshot.key, snapshot.val());
        var user_data = snapshot.val();
        var bodyElement = document.getElementById(snapshot.key + "_list").children[1];
        bodyElement.innerHTML = "";
        var usersLabel = document.createElement("h5");
        usersLabel.classList = "center";
        usersLabel.innerHTML = "Classmates";
        bodyElement.appendChild(usersLabel);
        
        // TODO No Classmates

        var collectionContainer = document.createElement("div");
        collectionContainer.style = "max-height:300px;overflow:auto;"
        var collection = document.createElement("ul");
        collection.classList = "collection";

        var usersToUpdate = [];
        index = 0;
        for (var userId in user_data) {
          if (userId != uid) {
            var avatarItem = document.createElement("li");
            avatarItem.classList = "collection-item avatar";
            var img = document.createElement("img");
            img.classList = "circle";
            img.classList += " " + userId + "_img";
            var title = document.createElement("span");
            title.classList = "title";
            title.classList += " " + userId + "_title";
            var content = document.createElement("p");
            content.classList += " " + userId + "_content";
            var secondaryContent = document.createElement("a");
            secondaryContent.classList = "secondary-content waves-effect waves-light btn-flat purple white-text"
            secondaryContent.innerHTML = "<span class='hide-on-small-only'>More </span>Info";
            secondaryContent.dataset.classId = snapshot.key;
            secondaryContent.dataset.userIndex = index;
            index++;
            secondaryContent.onclick = userInfoClicked;
            avatarItem.appendChild(img);
            avatarItem.appendChild(title);
            avatarItem.appendChild(content);
            avatarItem.appendChild(secondaryContent);
            collection.appendChild(avatarItem);
            usersToUpdate.push(userId);
          }
        }
        collectionContainer.appendChild(collection);
        bodyElement.appendChild(collectionContainer);

        for (var i = 0; i < usersToUpdate.length; i++) {
          var usersToUpdateID = usersToUpdate[i];
          db.ref("shared_data/public_data/" + usersToUpdateID).once("value").then(function(snapshot) {
            var usersToUpdateID = snapshot.key;
            var data = snapshot.val();
            $("." + usersToUpdateID + "_img").each(function() {
              if (data["photoURL"]) {
                this.src = data["photoURL"];
              } else {
                this.src = "defaultprofile.jpg"
              }
            });
            $("." + usersToUpdateID + "_title").each(function() {
              this.innerHTML = data["first"] + " " + data["last"];
            });
            $("." + usersToUpdateID + "_content").each(function() {
              this.innerHTML = "<p>" + data["year"] + "</p>";
            });
          });
        }
      });
    }

    $(':checkbox').change(function() {
      db.ref("users/" + uid + "/courses/" + this.id.replace("_checkbox", "") + "/enabled").set(this.checked);
      if (this.checked) {
        db.ref('user_courses/' + this.id.replace("_checkbox", "") + "/" + uid).set(true);
      } else {
        db.ref('user_courses/' + this.id.replace("_checkbox", "") + "/" + uid).remove();
      }
      updateSwitch(this.id.replace("_checkbox", ""), this.checked);
    });
    $(':checkbox').each(function() {
      updateSwitch(this.id.replace("_checkbox", ""), this.checked);
    });
  });
}

function updateSwitch(id, checked) {
  // console.log(id, checked);
  var listElement = document.getElementById(id + "_list");
  if (checked) {
    listElement.classList = "";
    $(listElement).off("click");
  } else {
    $('.collapsible').collapsible("close", listElement.dataset.index);
    listElement.classList = "disabled not-collapse";
    $(listElement).on("click", function(e) { e.stopPropagation(); });
  }
}

var carouselIndex;
function userInfoClicked() {
  var cid = this.dataset.classId;
  carouselIndex = this.dataset.userIndex;
  if (cid in user_courses) {
    db.ref('user_courses/' + cid).on('value', function(snapshot, cid) {
      // console.log(snapshot.key, snapshot.val());
      $('.carousel.carousel-slider').carousel("destroy");
      $(".carousel-item").each(function(i) {
        this.remove();
      })
      var user_data = snapshot.val();
      var usersToUpdate = [];


      var carouselContainer = document.getElementById("infoCarousel");
      var index = 0;
      for (var userId in user_data) {
        if (userId != uid) {
          usersToUpdate.push(userId);
          console.log(userId);
          var carouselItem = document.createElement("div");
          carouselItem.href = "#one";
          carouselItem.classList = "carousel-item";
          if (index == carouselIndex) {
            carouselItem.classList += " active";
            console.log("Active");
          }
          index++;
          var card = document.createElement("div");
          card.classList = "card";
          var cardImage = document.createElement("div");
          cardImage.classList = "card-image";
          var closeIconBtn = document.createElement("a");
          closeIconBtn.classList = "infoClose btn-floating btn-large waves-effect waves-light red"
          // closeIconBtn.onclick = closeInfo;
          var closeIcon = document.createElement("i");
          closeIcon.classList = "material-icons small right";
          closeIcon.innerHTML = "close";
          var cardImgElement = document.createElement("img");
          cardImgElement.src = "defaultprofile.jpg";
          cardImgElement.id = userId + "_img"

          var cardContent = document.createElement("div");
          cardContent.classList = "card-content";
          var title = document.createElement("title");
          title.classList = "card-title";
          title.id = userId + "_title"
          var year = document.createElement("h6");
          year.id = userId + "_year";
          var bio = document.createElement("p");
          bio.classList = "flow-text";
          bio.id = userId + "_bio";
          // bio.innerHTML = "Nam luctus ultrices magna, non vulputate tortor tristique sit amet. Fusce id ex mauris. Integer sed eros ligula. Nam a nulla nec ipsum feugiat lobortis. Etiam consequat sem eu ipsum laoreet, non interdum arcu mollis. Quisque vitae dui tincidunt amet.";

          closeIconBtn.appendChild(closeIcon)
          cardImage.appendChild(closeIconBtn);
          cardImage.appendChild(cardImgElement)
          card.appendChild(cardImage);
         
          // title.appendChild(firstName);
          // title.innerHTML += " ";
          // title.appendChild(lastName);
          cardContent.appendChild(title);
          cardContent.appendChild(year);
          cardContent.appendChild(bio);
          card.appendChild(cardContent);

          carouselItem.appendChild(card);
          carouselContainer.appendChild(carouselItem);
        }
      }


      for (var i = 0; i < usersToUpdate.length; i++) {
        var usersToUpdateID = usersToUpdate[i];
        db.ref("shared_data/public_data/" + usersToUpdateID).once("value").then(function(snapshot) {
          var usersToUpdateID = snapshot.key;
          var data = snapshot.val();
          $("#" + usersToUpdateID + "_img").each(function() {
            if (data["photoURL"]) {
              this.src = data["photoURL"];
            } else {
              this.src = "defaultprofile.jpg"
            }
          });
          $("#" + usersToUpdateID + "_title").each(function() {
            this.innerHTML = data["first"] + " " + data["last"];
          });
          $("#" + usersToUpdateID + "_year").each(function() {
            this.innerHTML = data["year"];
          });
          $("#" + usersToUpdateID + "_bio").each(function() {
            this.innerHTML = data["bio"];
          });
        });
      }

      $(".infoClose").on("click touchstart", closeInfo);
      $("#userInfo").modal("open");
    });
  }
}

function closeInfo() {
  console.log("Test");
  $('#userInfo').modal('close');
}

$("#addCourseBtn").one("click", function() {
  db.ref('curriculum_search').once("value").then(function(snapshot) {
    course_data = snapshot.val();
    for (var currName in course_data) {
      curr_data[currName] = null;
    }
    search.bind('input', inputUpdated);
    inputUpdated();
  });
});

function inputUpdated() {
  var currMatch = search.val().match("([A-z]| )+");
  if (currMatch != null) {
    var curr = search.val().match("([A-z]| )+")[0].trim().toUpperCase();
    if (curr in course_data) {
      if (course_data[curr] == true) {
        console.log("First");
        db.ref('courses_search/' + curr).once("value").then(function(snapshot) {
          var num_snap = snapshot.val();
          course_data[curr] = num_snap;
          if (!(curr in number_data)) {
            number_data[curr] = {}
          }
          for (var num in num_snap) {
            number_data[curr][curr + " " + num] = null;
          }
          search.autocomplete({
            data: number_data[curr],
            limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
            onAutocomplete: inputUpdated,
            minLength: 1
          });
          updateCourseTable(curr, course_data[curr]);
        });
      } else {
        console.log("Repeat");
        search.autocomplete({
          data: number_data[curr],
          limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
          onAutocomplete: inputUpdated,
          minLength: 1
        });
      }
    } else {
      search.autocomplete({
        data: curr_data,
        limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
        onAutocomplete: inputUpdated,
        minLength: 1
      });
    }
  }
  updateCourseTable(curr, course_data[curr]);
}

function changeClass() {
  var courseData = this.dataset.courseNumber;
  if (this.innerHTML == "close") {
    this.innerHTML = "add";
    db.ref('users/' + uid + '/courses/' + courseData).remove();
    db.ref('user_courses/' + courseData + "/" + uid).remove();
    Materialize.toast("Removed course: " + courseData.replace("-", " ").replace("_", " "), 1000);
  } else {
    this.innerHTML = "close";
    var id = courseData.split("_");
    var data = {};
    data[courseData] = {
      name: course_data[id[0].replace("-", " ")][id[1]],
      enabled: true
    };
    db.ref('users/' + uid + '/courses').update(data);
    db.ref('user_courses/' + courseData + "/" + uid).set(true);
    Materialize.toast("Added course: " + courseData.replace("-", " ").replace("_", " "), 1000);
  }
}

function confirmDeletePopup() {
  var courseData = this.dataset.courseNumber;
  var deleteBtn = document.getElementById("confirmDeleteBtn");
  document.getElementById("courseConfirmId").innerHTML = courseData.replace("-", " ").replace("_", " ");
  deleteBtn.dataset.courseNumber = courseData;
  deleteBtn.onclick = deleteConfirmed;
  $('#confirmRemoveCourse').modal('open');
}

function deleteConfirmed() {
  var courseData = this.dataset.courseNumber;
  db.ref('users/' + uid + '/courses/' + courseData).remove();
  db.ref('user_courses/' + courseData + "/" + uid).remove();
  Materialize.toast("Removed course: " + courseData.replace("-", " ").replace("_", " "), 1000);
}

var first = true;
function coursesUpdated(data, openedId) {
  var classlist = document.getElementById("class-list");
  classlist.innerHTML = "";
  if (data != null) {
    var index = 0;
    for (var key in data) {
      var curr = key.split("_")[0];
      var num = key.split("_")[1];
      var name = data[key].name;
      var enabled = data[key].enabled;
      var courseId = key;
      var listElement = document.createElement("li");
      listElement.id = courseId + "_list";
      listElement.dataset.index = index;
      index++;
      var header = document.createElement("div");
      header.classList = "collapsible-header";
      var courseName = document.createElement("div");
      courseName.classList = "truncate trunc-name";
      courseName.innerHTML = curr.replace("-", " ") + " " + num + " - " + name;
      header.appendChild(courseName);
      var rightDiv = document.createElement("div");
      rightDiv.classList = "not-collapse";
      var toggleDiv = document.createElement("div");
      toggleDiv.classList = "switch class-toggle";
      var toggle = document.createElement("label");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.checked = enabled;
      input.id = courseId + "_checkbox";
      input.classList = "class-checkbox";
      toggle.appendChild(input);
      var span = document.createElement("span");
      span.classList = "lever";
      toggle.appendChild(input);
      toggle.appendChild(span);
      toggleDiv.appendChild(toggle);
      rightDiv.appendChild(toggleDiv);
      var removeBtn = document.createElement("i");
      removeBtn.classList = "material-icons class-remove-btn";
      removeBtn.innerHTML = "close";
      removeBtn.onclick = confirmDeletePopup;
      removeBtn.dataset.courseNumber = courseId;
      rightDiv.appendChild(removeBtn);
      header.appendChild(rightDiv);
      var body = document.createElement("div");
      body.classList = "collapsible-body";
      body.appendChild(document.createElement("br"));
      body.appendChild(document.createElement("br"));
      if (openedId == courseId) {
        header.classList += " active";
        body.style.display = "block";
        first = false;
      }
      listElement.appendChild(header);
      listElement.appendChild(body);
      classlist.appendChild(listElement);
    }
  } else {
    var listElement = document.createElement("li");
    var header = document.createElement("div");
    header.classList = "collapsible-header";
    header.innerHTML = "No Courses Added";
    listElement.appendChild(header);
    classlist.appendChild(listElement);
  }
  $(".not-collapse").on("click", function(e) { e.stopPropagation(); });
  $('.collapsible').collapsible();
}

function focusSearch() {
  search.focus();
}

function enterPressAlert(e, input) {
  var code = (e.keyCode ? e.keyCode : e.which);
  if(code == 13) { //Enter keycode
    search.blur()
  }
}

function updateCourseTable(curr, data) {
  var table = document.getElementById("course-table-body");
  table.innerHTML = "";
  var numbers = search.val().match(/\d+/g);
  if (numbers != null) {
    if (data != null) {
      for (var i = 0; i < numbers.length; i++) {
        var name = data[numbers[i]];
        if (name != undefined) {
          addRow(table, curr, numbers[i], name);
        }
      }
    }
  } else {
    for (var num in data) {
      var name = data[num];
      addRow(table, curr, num, name);
    }
    window.setTimeout(focusSearch, 100);
  }
}

function addRow(table, curr, num, name) {
  var row = document.createElement('tr');
  var curriculum = document.createElement('td');
  curriculum.appendChild(document.createTextNode(curr));
  curriculum.classList += " table-curr";
  row.appendChild(curriculum);
  var number = document.createElement('td');
  number.appendChild(document.createTextNode(num));
  number.classList += " table-num";
  row.appendChild(number);
  var course_name = document.createElement('td');
  course_name.appendChild(document.createTextNode(name));
  course_name.classList += " table-name";
  row.appendChild(course_name);
  var add = document.createElement('td')
  var icon = document.createElement('i');
  icon.classList += "material-icons class-change-btn right";
  icon.onclick = changeClass;
  icon.dataset.courseNumber = curr.replace(" ", "-") + "_" + num;
  icon.id = curr.replace(" ", "-") + "_" + num; //Redundant
  if (user_courses == null || user_courses[icon.dataset.courseNumber] == null) {
    icon.appendChild(document.createTextNode("add"));
  } else {
    icon.appendChild(document.createTextNode("close"));
  }
  add.appendChild(icon);
  add.classList += " table-add";
  row.appendChild(add);
  table.appendChild(row);
}
