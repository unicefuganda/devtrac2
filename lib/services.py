from data_models import *
import pymongo
from pymongo import MongoClient

class DistrictService(object):

  def find_by_name(self, name):
    client = MongoClient()
    db = client['reference']
    district = db.districts.find_one({"name": name.upper()})
    return District(district["name"], district)