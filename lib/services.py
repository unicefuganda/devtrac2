import pymongo
from pymongo import MongoClient
import urllib
import json

from flask import Flask

class AggregationService(object):

    def find(self, locator): 

        labels = { "region": "Regions", "district": "Districts", "subcounty": "Subcounties", "parish": "Parishes" }

        mongo_client = MongoClient()
        database = mongo_client.devtrac2
        health_center_entry = database.health_center_aggregation.find({'_id': locator.upper()})
        health_center_count = health_center_entry[0]['value'] if health_center_entry.count() > 0 else 0

        school_entry = database.school_aggregation.find({'_id': locator.upper()})
        school_count = school_entry[0]['value'] if school_entry.count() > 0 else 0

        child_count = self.find_child_count(locator)

        return {
            "locator": locator,
            "info": [
                ["Health Centers", health_center_count],
                ["Schools", school_count],
                ["%s" % labels[child_count["type"]], child_count["count"]]
            ]
        }

    def find_child_count(self, locator):
        levels = ["national", "region", "district", "subcounty", "parish"]

        location_arr = locator.split(", ")
        location_name = location_arr[len(location_arr) - 1]
        location_type = levels[len(location_arr) - 1 ]
        child_type = levels[len(location_arr)]

        mongo_client = MongoClient()
        database = mongo_client.devtrac2

        count = database.location_tree.find({"type": child_type.lower(), ("location.%s" % location_type.lower()) : location_name.upper() }).count();
        return { "type": child_type, "count": count }

class WFSService(object):

    def __init__(self, url, maxFeatures=100000, test=False):
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