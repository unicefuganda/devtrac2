import csv
import sys, os
from pymongo import MongoClient

base_dir = os.path.abspath(os.path.dirname(__file__) + "/../../")

district_indicators = {}
mongo_client = MongoClient()
database = mongo_client.devtrac2

fields = ["Pop_2011", "DPT3_perc", "Measles_Perc","HF_Delivery_Perc", "Pit_LatCov_Perc", "Safe_Water_Cov_Perc"]
collection = database["indicators"]
collection.remove()

with open("%s/db/district_indicators.csv" % base_dir, 'rUb') as csvfile: 
    reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
    for row in reader: 
        district = database.location_tree.find_one({"type" : "district", "location.district" : row['District'].upper()})
        if (district == None):
            continue

        region = district['location']['region']
        collection.insert({"_id":"UGANDA, %s, %s" % (region,row['District'].upper()), "indicators" : row})



       
