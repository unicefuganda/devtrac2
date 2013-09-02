from data_models import *
import pymongo
from pymongo import MongoClient

class DistrictService(object):  

  def convert_json_to_distirct(self, district_json):
    return District(district_json["name"], district_json["area"], district_json["subregion"], district_json)

  def find_by_name(self, name):
    client = MongoClient()
    db = client['reference']  
    district_json = db.districts.find_one({"name": name.upper()})
    return self.convert_json_to_distirct(district_json)
    

  def find_all(self):
    client = MongoClient()
    db = client['reference']
    districts = db.districts.find().sort("name")
    return map(self.convert_json_to_distirct, districts)