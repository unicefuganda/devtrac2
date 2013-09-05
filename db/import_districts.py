from operator import itemgetter, attrgetter
import json
from pprint import pprint
import pymongo
from pymongo import MongoClient
import sys, os
local_path = os.path.dirname(os.path.abspath(__file__))

client = MongoClient()
db = client['reference']

with open("%s/uganda_districts_2011.json" % local_path) as districts_data:
    districts_json = json.load(districts_data)

    def find_attributes(feature): 
      return { 
        "D_06_ID": feature["properties"]["D_06_ID"],
        "name_2006": feature["properties"]["DNAME_2006"],
        "index_name": feature["properties"]["DNAME_2010"],
        "name": feature["properties"]["DNAME_2010"].capitalize(),
        "subregion": feature["properties"]["SUBREGION"].capitalize(),
        "unicef": feature["properties"]["UNICEF"],
        "area": feature["properties"]["AREA"],
        "perimeter": feature["properties"]["PERIMETER"],
        "hectares": feature["properties"]["HECTARES"],
        "registration_2011": feature["properties"]["HECTARES"]
      }

    features = filter(lambda d:d["properties"]["DNAME_2010"] != None , districts_json["features"])
    districts = map(find_attributes, features)

db.district.drop()
db.district.insert(districts)

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
  for village in sorted_villages:
    district = db.district.find_one({"index_name": village["District"]})
    add_subcounties_to_district(district, village)
    db.district.save(district)

print "inserted %s districts" % db.district.count()