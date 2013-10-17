import csv
import sys, os
from pymongo import MongoClient
from sets import Set
from app.services import *
import itertools

base_dir = os.path.abspath(os.path.dirname(__file__) + "/../../")


def first(list, func):
    try:
        return (x for x in list if func(x)).next()
    except Exception as inst:
        return None

class UReportLocationMatcher(object):

    def __init__(self, locationService):
        self.districts = locationService.districts()
        self.subcounties = locationService.subcounties()
        self.parishes = locationService.parishes()

    def match_location(self, district, location, location_type, parish):
        location = None

        if (parish != None and parish != ""):
            location = first(self.parishes, lambda x: x['location']['parish'] == parish.upper())

        if (location_type == 'sub_county' ):
            location = first(self.subcounties, lambda x: x['location']['subcounty'] == location.upper())
        
        if (location == None):
            location = first(self.districts, lambda x: x['location']['district'] == district.upper())
        return location

def import_ureport_questions(db):
    collection = db.ureport_questions
    collection.remove()


    with open("%s/db/poll_questions.csv" % base_dir, 'rUb') as csvfile: 
        reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')

        for row in reader: 
            categories = row['categories'].split(",")
            collection.insert({"question": row['question'], "_id": row['ID'], "id": row['ID'], "abbreviation": row['abbreviation'], "categories": categories})

def import_ureport_categories(db, locationMatcher):
    collection = db.ureport_poll_categories
    collection.remove()

    with open("%s/db/ureport_poll_categories.csv" % base_dir, 'rUb') as csvfile: 
        reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
        sorted_result = sorted(reader, key=lambda x: (x['district'].upper(), x['poll_id']));
        for district_poll, group in itertools.groupby(sorted_result, lambda x: (x['district'].upper(), x['poll_id'])):
            rows = list(group)
            location = locationMatcher.match_location(district_poll[0], None, None, None)

            question = db.ureport_questions.find_one(rows[0]['poll_id'])
            results = []

            for index, category in enumerate(question['categories']): 
                category_row = first(rows, lambda r: r['category'] == category)
                if (category_row != None):
                    results.append({'count': category_row['count'], 'category': category_row['category'], 'category_id': index})
            if (location != None):
                collection.insert({"poll_id": rows[0]['poll_id'], "locator": location["_id"], "location": location["location"], "results": results })    
            else:
                print district_poll

def import_ureport_responses(data_dir, db, locationMatcher):
    collection = db.ureport_responses
    collection.remove()

    mismatching_districts = Set([])
    

    with open("%s/%s/ureport_messages.csv" % (base_dir, data_dir), 'rUb') as csvfile: 
        reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
        for row in reader:    

            location = locationMatcher.match_location(row['district'], row['standard_village'], row['village_type_id'], row['parish'])
            existing_record = collection.find_one({"_id": row['ID']})

            if (location != None and existing_record == None):
                collection.insert({
                    "_id": row['ID'],
                    "poll_id": row['poll_id'], 
                    "id": row['ID'], 
                    "text": row['text'].decode('cp1252'),
                    "village": row['standard_village'], 
                    "location": location["location"]
                })
            else:
                if (existing_record != None):
                    mismatching_districts.add(row['district'])

def import_ureport(data_dir, db):

    locationMatcher = UReportLocationMatcher(LocationService(db))
    import_ureport_questions(db)
    import_ureport_categories(db, locationMatcher)

    # import_ureport_responses(db)