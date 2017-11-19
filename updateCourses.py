import requests
from bs4 import BeautifulSoup
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

# Use the application default credentials

cred = credentials.Certificate("/Users/jackv/serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://studybuddy-19f01.firebaseio.com/'
})
# db = firestore.client()
ref = db.reference('curriculum_search')

courses = {}


payload = {
   'year': '2017',
   'quarter': 'autumn',
   'page_size': '1000',
   'exclude_courses_without_sections': 'on'
}
headers = {"Authorization":"Bearer CA102B39-4731-4782-BF86-2A6C0EA80FD4"}
r = requests.get('https://ws.admin.washington.edu/student/v5/course', params=payload, headers=headers)
soup = BeautifulSoup(r.text, 'html.parser')

page_num = 1
courses_soup = soup.findAll("li")
while len(courses_soup) > 0:
   payload = {
      'year': '2017',
      'quarter': 'autumn',
      'page_size': '1000',
      'exclude_courses_without_sections': 'on',
      'page_start': page_num
   }
   headers = {"Authorization":"Bearer CA102B39-4731-4782-BF86-2A6C0EA80FD4"}
   r = requests.get('https://ws.admin.washington.edu/student/v5/course', params=payload, headers=headers)
   soup = BeautifulSoup(r.text, 'html.parser')
   courses_soup = soup.findAll("li")
   print page_num
   page_num += 1000
   for course_soup in courses_soup:
      # print courses_soup
      name = course_soup.find("span", class_="CourseTitleWithCourseTitleLong").string
      curriculum = course_soup.find("span", class_="courseuri__curriculum_abbreviation").string
      quarter = course_soup.find("span", class_="course_uri_qtr").string
      year = course_soup.find("span", class_="course_uri_year").string
      number = course_soup.find("span", class_="courseuri_course_number").string

      # if (courses[curriculum] == undefined)
      if curriculum in courses:
         courses[curriculum] = True
      else:
         courses.update({curriculum: True})
# print courses
ref.set(courses)
# for key in courses:
#    doc_ref = db.collection(u'courses').document(key)
#    doc_ref.set(courses[key])
