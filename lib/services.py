import pymongo
from pymongo import MongoClient
import urllib
import json

class AggregationService(object):

    def __init__(self):
        mongo_client = MongoClient()
        self.database = mongo_client.devtrac2


    def find(self, locator): 
        labels = { "region": "Regions", "district": "Districts", "subcounty": "Subcounties", "parish": "Parishes" }

        summary =  {
            "locator": locator,
            "info": [
                ["Health Centers", self.points_count("health_center", locator)],
                ["Schools", self.points_count("school", locator)],
                ["Water Points", self.points_count("water_point", locator)],
                
            ]
        }

        child_count = self.child_count(locator)
        if (child_count != None):
            summary['info'].append(["%s" % labels[child_count["type"]], child_count["count"]])
        return summary

    def points_count(self, dataset, locator):
        entry = self.database["%s_aggregation" % dataset].find({'_id': locator.upper()})
        return entry[0]['value'] if entry.count() > 0 else 0

    def child_count(self, locator):
        levels = ["national", "region", "district", "subcounty", "parish"]

        location_arr = locator.split(", ")
        location_name = location_arr[len(location_arr) - 1]
        location_type = levels[len(location_arr) - 1 ]

        if (len(location_arr) == len(levels)):
            return None;

        child_type = levels[len(location_arr)]

        count = self.database.location_tree.find({"type": child_type.lower(), ("location.%s" % location_type.lower()) : location_name.upper() }).count();
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