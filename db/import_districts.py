import json
from pprint import pprint
import pymongo
from pymongo import MongoClient

json_data=open('uganda_districts_2011.json')

data = json.load(json_data)

def find_attributes(feature): 
  return { 
    "D_06_ID": feature["properties"]["D_06_ID"],
    "name_2006": feature["properties"]["DNAME_2006"],
    "name_2010": feature["properties"]["DNAME_2010"],
    "subregion": feature["properties"]["SUBREGION"],
    "unicef": feature["properties"]["UNICEF"],
    "area": feature["properties"]["AREA"],
    "perimeter": feature["properties"]["PERIMETER"],
    "hectares": feature["properties"]["HECTARES"],
    "registration_2011": feature["properties"]["HECTARES"]
  }

districts = map(find_attributes, data["features"])
json_data.close()

client = MongoClient()
db = client['reference']

db.districts.drop()
db.districts.insert(districts)
print "inserted %s districts" % db.districts.count()