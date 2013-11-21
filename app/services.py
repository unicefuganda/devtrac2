import pymongo
from pymongo import MongoClient
import urllib
import simplejson as json

# eg "UGANDA, ACHOLI, GULU" 
class Locator(object):
    LEVELS = ["national", "region", "district", "subcounty", "parish"]

    def __init__(self, locator):
        self.locator = locator
        self.location_arr = self.locator.split(", ")
        self.level = len(self.location_arr)

    def __str__(self):
        return self.locator

    def level_name(self):
        return Locator.LEVELS[self.level - 1]

    def child_level_name(self): 
        return (Locator.LEVELS[self.level] if (self.level < len(Locator.LEVELS)) else None)

    def name(self):
        return self.location_arr[self.level - 1]

class AggregationService(object):

    
    def __init__(self, location_service):
        self.location_service = location_service

    def find(self, locator): 
        summary = self.__calc_summary(locator)

        children = self.location_service.children(locator)
        if (children != None):
            children_summaries = [self.__calc_summary(Locator(child['_id'])) for child in children['children']]
            summary['children'] = children_summaries
        return summary

    def __calc_summary(self, locator):
        child_count = self.location_service.children(locator)
        summary =  {
            "locator": str(locator),
            "info": {
                "health-center": self.location_service.points_count("health_center", str(locator)),
                "school": self.location_service.points_count("school", str(locator)),
                "water-point": self.location_service.points_count("water_point", str(locator))
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
        if (locator.child_level_name() == None):
            return None;

        children_entries = self.db.location_tree.find({
            "type": locator.child_level_name(), 
            ("location.%s" % locator.level_name()) : locator.name().upper() 
        })
        return { "child_type": locator.child_level_name(), "children": list(children_entries), "parent_type": locator.level_name() }

    def districts(self):
        return list(self.db.location_tree.find({"type": "district"}))

    def subcounties(self):
        return list(self.db.location_tree.find({"type": "subcounty"}))

    def parishes(self):
        return list(self.db.location_tree.find({"type": "parish"}))

class UReportService(object):

    def __init__(self, db):
        self.db = db

    def questions(self):
        return list(self.db.ureport_questions.find())

    def top5(self, locator, poll_id):
        cursor = self.db.ureport_responses.find({"location.%s" % locator.level_name(): locator.name(), "poll_id": poll_id})
        return list(cursor.sort("ID", 1).limit(5))

    def __convert_to_percent(self,pollResults):
        results = pollResults['results']
        rs = [int(result['count']) for result in results]
        total = sum(rs)

        def calc_percent(percent, total):
            result = float(percent)/total * 100
            return int("%0.0f" % result)

        percentages = [{'category': result['category'], 'category_id': result['category_id'], 'percent': calc_percent(result['count'], total) } for result in results]

        top = max(results, key=lambda x: x['count'])
        pollResults['results'] = percentages
        pollResults['top'] = top
        return pollResults


    def results(self, locator, poll_id):
        cursor = self.db.ureport_poll_categories.find_one({"locator": str(locator), "poll_id": poll_id})
        if (cursor == None):
            return None
        return self.__convert_to_percent(cursor)

    def child_results(self, locator, poll_id):
        cursor = self.db.ureport_poll_categories.find({"location.%s" % locator.level_name(): locator.name(), "poll_id": poll_id})
        return {"children": list(self.__convert_to_percent(result) for result in cursor)}

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

class SiteVisitService(object): 

    def __init__(self, db):
        self.db = db

    def all(self):
        return self.db.site_visits.find()