import csv
import sys, os
from pymongo import MongoClient
from parish_service import *

base_dir = os.path.abspath(os.path.dirname(__file__) + "/../../")

district_indicators = {}
mongo_client = MongoClient()
database = mongo_client.devtrac2

fields = ["Title", "District", "Subject", "Author", "Date Visited", "Location", "Placetype", "Link"]
collection = database["site_visits"]
collection.remove()

parish_service = ParishService()

with open("%s/db/site_visits.csv" % base_dir, 'rUb') as csvfile: 
    print "hello!"
    reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
    for row in reader: 
        parish = parish_service.find([float(row['x']), float(row['y'])])
        properties = parish["properties"]
        row['Reg_2011'] = properties['Reg_2011']
        row['PNAME_2006'] = properties['PNAME_2006']
        row['DNAME_2010'] = properties['DNAME_2010']
        row['SNAME_2010'] = properties['SNAME_2010']
        collection.insert(row);