import json
import requests
import random
import string
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

cred = credentials.Certificate("/Users/jackv/serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://studybuddy-19f01.firebaseio.com/'
})

years = ["Freshman", "Sophmore", "Junior", "Senior"]
curr = "INFO"
num_of_users = 20

def get_random_users():
   users = []
   r = requests.get("https://randomuser.me/api/?nat=us&results=" + str(num_of_users))
   data = r.json()["results"]
   
   for user_data in data:
      user = {}
      user["photoURL"] = user_data["picture"]["large"]
      user["first"] = user_data["name"]["first"].capitalize()
      user["last"] = user_data["name"]["last"].capitalize()
      user["phone"] = user_data["phone"]
      user["email"] = user_data["email"]
      user["bio"] = user_data["login"]["username"]
      user["preferred"] = "pref_text"
      user["year"] = random.sample(years, 1)
      user["fake"] = True;
      users.append(user)

   return users

def get_course_choices():
   choices = db.reference("courses_search/" + curr).get()
   return choices

def pprint(parsed):
   print json.dumps(parsed, indent=4, sort_keys=True)

def get_random_uid():
   letters = string.ascii_letters + string.digits
   uid = ""
   for x in range(27):
      # print x
      uid += random.choice(letters)
   return uid 


def upload_user():
   users = get_random_users()
   courses = get_course_choices()
   for user in users:
      uid = get_random_uid()
      random_choices = random.sample(courses, 20)
      user_courses = {}
      for choice in random_choices:
         user_courses[curr + "_" + choice] = {
            "enabled": True,
            "name": courses[choice]
         }
         db.reference("user_courses/" + curr + "_" + choice + "/" + uid).set(True)
      user["courses"] = user_courses
      db.reference("users/" + uid).set(user)
      db.reference("shared_data/public_data/" + uid).set({
         "bio": user["bio"],
         "first": user["first"],
         "last": user["last"],
         "photoURL": user["photoURL"],
         "year": user["year"]
      })

def delete_fake_users():
   users = db.reference("users").get()
   for user in users:
      if (len(user) < 28):
         courses = users[user]["courses"]
         for course in courses:
            db.reference("user_courses/" + course + "/" + user).delete()
         db.reference("users/" + user).delete()
         db.reference("shared_data/public_data/" + user).delete()

# delete_fake_users()
upload_user()
# print get_random_users()
# print get_course_choices()