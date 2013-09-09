from operator import itemgetter, attrgetter
import json
from pprint import pprint
import pymongo
from pymongo import MongoClient
import sys, os
import itertools
local_path = os.path.dirname(os.path.abspath(__file__))


client = MongoClient()
db = client['reference']

with open("%s/uganda_districts_2011.json" % local_path) as districts_data:
    districts_json = json.load(districts_data)

    def find_attributes(feature): 
        return { 
            "index_name": feature["properties"]["DNAME_2010"],
            "name": feature["properties"]["DNAME_2010"].capitalize(),
            "subregion": feature["properties"]["SUBREGION"].capitalize(),
            "unicef": feature["properties"]["UNICEF"],
            "area": feature["properties"]["AREA"],
            "geometry": feature["geometry"]
        }

    features = filter(lambda d:d["properties"]["DNAME_2010"] != None , districts_json["features"])
    districts = map(find_attributes, features)

db.district.drop()
db.district.insert(districts)

db.district.create_index("index_name")
with open("%s/uganda_districts_2011_centroids.json" % local_path) as districts_data:
    districts_centroids_json = json.load(districts_data)
    features = filter(lambda d:d["properties"]["DNAME_2010"] != None , districts_centroids_json["features"])
    district_centroids = map(lambda x:{ "centroid": x["geometry"], "index_name": x["properties"]["DNAME_2010"] }, features)

    for district_centroid in district_centroids:
        district = db.district.find_one({"index_name": district_centroid["index_name"]})
        district["centroid"] = district_centroid["centroid"]
        db.district.save(district)

def add_subcounties_to_district(district, village):
    if (not district.has_key("subcounties")):
        district["subcounties"] = []  
    subcountry_name = village["Subcounty"]
    village_name = village["Village"]    
    
    subcounty = next((x for x in district["subcounties"] if (x["name"] == subcountry_name)), None)
    if (subcounty is None):
        district["subcounties"].append({"name": village["Subcounty"], "villages": [{"name": village_name}] })
    else:
        village = next((x for x in subcounty["villages"] if (x["name"] == village_name)), None)
        if (village is None):
            subcounty["villages"].append({"name": village_name})

with open("%s/uganda_villages.json" % local_path) as villages_data:
    villages_json = json.load(villages_data)
    sorted_villages = sorted(villages_json["rows"], key=itemgetter('District', 'Subcounty', 'Village'))
    for district_name, district_villages in itertools.groupby(sorted_villages, lambda x: x['District']):
        district = db.district.find_one({"index_name": district_name})
        for village in district_villages:
            add_subcounties_to_district(district, village)
        db.district.save(district)

print "inserted %s districts" % db.district.count()