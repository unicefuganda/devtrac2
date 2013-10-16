import csv
import sys, os
from pymongo import MongoClient
from sets import Set
from app.services import *

base_dir = os.path.abspath(os.path.dirname(__file__) + "/../../")

def first(list, func):
    try:
        return (x for x in list if func(x)).next()
    except Exception as inst:
        return None

# class UReportLocationService(object):
    
#     def __init__(self): 
#         self.locations = []
#         with open("%s/db/locations.csv" % base_dir, 'rUb') as csvfile:         
#             reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
#             self.locations = list(reader)


#     def lookup_village(self, village):
#         locations = [location for location in self.locations if location['name'] == village]
#         print locations
#         if (len(locations) == 0):
#             return None;

#         find_lowest_level(location)
#         return locations[0]

#     def find_lowest_level(locations):
#         def find_level(location):
#             levels = {'village': 1, 'sub_village': 2, 'parish': 3,'sub_county': 4, 'district': 5 }
#             levels.contains_key('a')

#         sorted(locations, key=find_level)


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

def import_ureport(data_dir, db):

    collection = db.ureport_questions
    collection.remove()

    with open("%s/db/poll_questions.csv" % base_dir, 'rUb') as csvfile: 
        reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
        for row in reader: 
            collection.insert({"question": row['question'], "_id": row['ID'], "id": row['ID'], "abbreviation": row['abbreviation']})

    collection = db.ureport_responses
    collection.remove()

    mismatching_districts = Set([])
    locationMatcher = UReportLocationMatcher(LocationService(db))

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
                    "district": row['district'], 
                    "village": row['standard_village'], 
                    "locator": location["_id"],
                    "location": location["location"]
                })
            else:
                if (existing_record != None):
                    mismatching_districts.add(row['district'])

    print "These districts were not found in the location_tree"
    print mismatching_districts