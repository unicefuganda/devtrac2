from data_models import *
import pymongo
from pymongo import MongoClient
import urllib
import json

from flask import Flask
from flask.ext.mongoengine import MongoEngine




class DistrictService(object):  

  def find_by_name(self, name):
    return District.objects(index_name=name.upper()).first()
    

  def find_all(self):
    return District.objects().exclude('geometry', 'unicef').all().order_by("name")


class WFSFeature(object):

  def __init__(self, id, geometry, properties):
    self.id = id
    self.geometry = geometry
    self.properties = properties

  def __getitem__(self, key):
    return self.properties[key]

class WFSService(object):

  def __init__(self, url, maxFeatures=10000):
    self.url = url
    self.maxFeatures = maxFeatures 

  def get_features(self, typeName):
    parameters = "service=WFS&version=1.0.0&request=GetFeature&typeName=%s&maxFeatures=%s&outputFormat=json" % (typeName, self.maxFeatures)
    url_handler = urllib.urlopen("%s?%s" % (self.url, parameters))
    features = json.load(url_handler)["features"]
    return map(lambda x: WFSFeature(x["id"], x["geometry"], x["properties"]), features)




      

