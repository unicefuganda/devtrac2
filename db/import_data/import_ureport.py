import csv
import sys, os
from pymongo import MongoClient

base_dir = os.path.abspath(os.path.dirname(__file__) + "/../../")

db = MongoClient().devtrac2
collection = db.ureport_questions
collection.remove()

with open("%s/db/poll_questions.csv" % base_dir, 'rUb') as csvfile: 
    reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
    for row in reader: 
        collection.insert({"question": row['question'], "_id": row['ID'], "id": row['ID'], "abbreviation": row['abbreviation']})