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
        return District.objects().exclude('geometry', 'unicef', 'subcounties').all().order_by("name")


# class WFSFeature(object):

#     def __init__(self, id, geometry, properties):
#         self.id = id
#         self.geometry = geometry
#         self.properties = properties

#     def __getitem__(self, key):
#         return self.properties[key]

class AggregationService(object):

    def find(self, locator): 
        mongo_client = MongoClient()
        database = mongo_client.devtrac2
        health_center_count = database.health_center_aggregation.find({'_id': locator.upper()})[0]['value']
        school_count = database.school_aggregation.find({'_id': locator.upper()})[0]['value']

        return {
            "locator": locator,
            "health_center_count": health_center_count,
            "school_count": school_count
        }

class WFSService(object):

    def __init__(self, url, maxFeatures=10000, test=False):
        self.url = url
        self.maxFeatures = maxFeatures 
        self.test = test

    def get_features(self, typeName):
        parameters = "service=WFS&version=1.0.0&request=GetFeature&typeName=%s&maxFeatures=%s&outputFormat=json" % (typeName, self.maxFeatures)
        
        if (self.test):
            url = "http://localhost:8080/" + typeName + ".json"
        else:
            url = "%s?%s" % (self.url, parameters)

        url_handler = urllib.urlopen(url)
        features = json.load(url_handler)["features"]
        return features




      

