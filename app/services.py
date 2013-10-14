import pymongo
from pymongo import MongoClient
import urllib
import json

class AggregationService(object):

    
    def __init__(self, location_service):
        self.location_service = location_service

    def find(self, locator): 
        summary = self.__calc_summary(locator)

        children = self.location_service.children(locator)
        if (children != None):
            children_summaries = [self.__calc_summary(child['_id']) for child in children['children']]
            summary['children'] = children_summaries
        return summary

    def __calc_summary(self, locator):
        child_count = self.location_service.children(locator)
        summary =  {
            "locator": locator,
            "info": {
                "health-center": self.location_service.points_count("health_center", locator),
                "school": self.location_service.points_count("school", locator),
                "water-point": self.location_service.points_count("water_point", locator)
            }
        }
    
        if (child_count != None):
            summary["type"] = child_count["parent_type"]
            summary['info'][child_count['child_type']] = len(child_count['children']) 
        return summary

class LocationService(object): 

    def __init__(self, db):
        self.db = db

    def points_count(self, dataset, locator):
        entry = self.db["%s_aggregation" % dataset].find({'_id': locator.upper()})
        return entry[0]['value'] if entry.count() > 0 else 0

    def children(self, locator):
        levels = ["national", "region", "district", "subcounty", "parish"]

        location_arr = locator.split(", ")
        location_name = location_arr[len(location_arr) - 1]
        location_type = levels[len(location_arr) - 1 ]

        if (len(location_arr) == len(levels)):
            return None;

        child_type = levels[len(location_arr)]

        children_entries = self.db.location_tree.find({"type": child_type.lower(), ("location.%s" % location_type.lower()) : location_name.upper() })
        return { "child_type": child_type, "children": list(children_entries), "parent_type": location_type }

class UReportService(object):

    def __init__(self, db):
        self.db = db

    def questions(self):
        return list(self.db.ureport_questions.find())

    def top5(self, locator):
        return list(self.db.ureport_responses.find({'locator': locator}).limit(5))

class WFSService(object):

    def __init__(self, url, maxFeatures=100000, test=False):
        self.url = url
        self.maxFeatures = maxFeatures 
        self.test = test

    def get_features(self, typeName):
        parameters = "service=WFS&version=1.0.0&request=GetFeature&typeName=%s&maxFeatures=%s&outputFormat=json" % (typeName, self.maxFeatures)
        
        if (self.test):
            url = "http://localhost:5000/static/test_geojson/" + typeName + ".json"
        else:
            url = "%s?%s" % (self.url, parameters)

        url_handler = urllib.urlopen(url)
        features = json.load(url_handler)["features"]
        return features