import csv
import sys, os
from pymongo import MongoClient
from sets import Set

base_dir = os.path.abspath(os.path.dirname(__file__) + "/../../")

def import_ureport(db):

    collection = db.ureport_questions
    collection.remove()

    with open("%s/db/poll_questions.csv" % base_dir, 'rUb') as csvfile: 
        reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
        for row in reader: 
            collection.insert({"question": row['question'], "_id": row['ID'], "id": row['ID'], "abbreviation": row['abbreviation']})

    collection = db.ureport_responses
    collection.remove()

    location_tree = db.location_tree

    mismatching_districts = Set([])
    with open("%s/db/ureport_messages.csv" % base_dir, 'rUb') as csvfile: 
        reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
        for row in reader: 
            district = location_tree.find_one({"type": "district", "location.district": row['district'].upper() })
            if (district == None):
                mismatching_districts.add(row['district'])
            else: 
                collection.insert({"poll_id": row['poll_id'], "id": row['ID'], "text": row['text'], "district": row['district'], "locator": district['_id']})

    print "These districts were not found in the location_tree"
    print mismatching_districts