import os
import application
import unittest
import tempfile
from app.services import *
from db.import_data.import_geonode import *
from pymongo import MongoClient
from mock import MagicMock

class LocatorTestCase(unittest.TestCase):

    def test_should_find_level_name_of_locator(self):
        self.assertEqual(Locator("UGANDA").level_name(), "national")
        self.assertEqual(Locator("UGANDA, ACHOLI").level_name(), "region")
        self.assertEqual(Locator("UGANDA, ACHOLI, GULU").level_name(), "district")
        self.assertEqual(Locator("UGANDA, ACHOLI, GULU, PATIKO").level_name(), "subcounty")
        self.assertEqual(Locator("UGANDA, ACHOLI, GULU, PATIKO, OTHER").level_name(), "parish")

    def test_should_find_child_level_name_of_locator(self):
        self.assertEqual(Locator("UGANDA").child_level_name(), "region")
        self.assertEqual(Locator("UGANDA, ACHOLI").child_level_name(), "district")
        self.assertEqual(Locator("UGANDA, ACHOLI, GULU").child_level_name(), "subcounty")
        self.assertEqual(Locator("UGANDA, ACHOLI, GULU, PATIKO").child_level_name(), "parish")
        self.assertEqual(Locator("UGANDA, ACHOLI, GULU, PATIKO, OTHER").child_level_name(), None)

class LocationServiceTestCase(unittest.TestCase):

    def setUp(self):
        self.db = MongoClient().location_tree
        self.db.location_tree.remove()
        self.db.location_tree.insert({
            "_id": "UGANDA, ACHOLI", 
            "type": "region",
            "location": { 
                "national": "UGANDA",
                "region": "ACHOLI"
        }})
        self.db.location_tree.insert({
            "_id": "UGANDA, ACHOLI, GULU", 
            "type": "district",
            "location": { 
                "national": "UGANDA",
                "region": "ACHOLI",
                "district": "GULU"
        }})
        self.db.location_tree.insert({
            "_id": "UGANDA, ACHOLI, AMURU", 
            "type": "district",
            "location": { 
                "national": "UGANDA",
                "region": "ACHOLI",
                "district": "AMURU"
        }})

    def test_find_children_of_location(self):
        locationService = LocationService(self.db)
        children = locationService.children(Locator("UGANDA, ACHOLI"))
        self.assertEqual(list((child['_id'] for child in children['children'])), ["UGANDA, ACHOLI, GULU", "UGANDA, ACHOLI, AMURU"])


class UReportTestCase(unittest.TestCase):

    def setUp(self):
        self.db = MongoClient().devtrac2_test
        self.db.ureport_questions.remove()
        self.db.ureport_responses.remove()
        self.db.ureport_questions.insert({"_id": 1, "question": "a_question"})
        self.db.ureport_questions.insert({"_id": 2, "question": "a_question_2"})

        self.db.ureport_responses.insert({
            "_id": 1, 
            "location": {
                "region": "ACHOLI"
            },
            "text": "text1"})

        self.db.ureport_responses.insert({
            "_id": 2, 
            "location": {
                "region": "ACHOLI",
                "district": "GULU"
            },
            "text": "text2"})

        self.db.ureport_responses.insert({
            "_id": 3, 
            "location": {
                "region": "ACHOLI",
                "district": "GULU",
                "parish": "OTHER"
            },
            "text": "text3"})

        self.db.ureport_responses.insert({
            "_id": 4, 
            "location": {
                "region": "ACHOLI",
                "district": "GULU",
                "parish": "PATIKO"
            },
                "text": "text4"})

        self.db.ureport_responses.insert({
            "_id": 5, 
            "location": {
                "region": "KAMPALA"
            },
            "text": "text7"})

        self.db.ureport_responses.insert({
            "_id": 6, 
            "location": {
                "region": "ACHOLI",
                "district": "GULU"
            },
            "text": "text5"})

        self.db.ureport_responses.insert({
            "_id": 7, 
            "location": {
                "region": "ACHOLI",
                "district": "GULU"
            },
            "text": "text6"})

    def test_should_find_all_questions(self):
        ureportService = UReportService(self.db)
        self.assertEqual(len(ureportService.questions()), 2)
        self.assertEqual(ureportService.questions()[0]['_id'], 1); 
        self.assertEqual(ureportService.questions()[0]['question'], "a_question"); 

    def test_should_find_top5_for_district(self):
        ureportService = UReportService(self.db)
        responses = [ report['text'] for report in ureportService.top5(Locator("UGANDA, ACHOLI"))]
        self.assertEqual(responses, ["text1", "text2", "text3", "text4", "text5"])



test_features = [
    {'properties' : 
        { 
            'Reg_2011': 'test_region',
            'DNAME_2010': "test_district",
            'SNAME_2010': "test_subcounty",
            'PNAME_2006': "test_parish"
        } 
    },
    {'properties' : 
        { 
            'Reg_2011': 'test_region',
            'DNAME_2010': "test_district",
            'SNAME_2010': "test_subcounty",
            'PNAME_2006': "test_parish"
        } 
    },
    {'properties' : 
        { 
            'Reg_2011': 'test_region',
            'DNAME_2010': "test_district",
            'SNAME_2010': "test_subcounty_2",
            'PNAME_2006': "test_parish_2"
        } 
    },
    {'properties' : 
        { 
            'Reg_2011': 'test_region',
            'DNAME_2010': "test_district_2",
            'SNAME_2010': "test_subcounty_2",
            'PNAME_2006': "test_parish_3"
        } 
    },
]


class ImportDataTestCase(unittest.TestCase):

    def setUp(self):
        self.database = MongoClient().devtrac2_test

    def test_should_import_and_aggregate_data(self):
        wfs_service = MagicMock()
        wfs_service.get_features.return_value = test_features

        import_dataset(wfs_service, self.database, "test", "test_feature")
        test_aggregation = self.database.test_aggregation

        self.assertEqual(self.database.test.count(), 4)
        self.assertEqual(test_aggregation.count(), 10)

        self.assertEqual(test_aggregation.find({'_id': 'UGANDA, test_region'})[0]['value'], 4) 

        self.assertEqual(test_aggregation.find({'_id': 'UGANDA, test_region, test_district'})[0]['value'], 3) 
        self.assertEqual(test_aggregation.find({'_id': 'UGANDA, test_region, test_district_2'})[0]['value'], 1) 

        self.assertEqual(test_aggregation.find({'_id': 'UGANDA, test_region, test_district, test_subcounty'})[0]['value'], 2)
        self.assertEqual(test_aggregation.find({'_id': 'UGANDA, test_region, test_district, test_subcounty_2'})[0]['value'], 1)
        self.assertEqual(test_aggregation.find({'_id': 'UGANDA, test_region, test_district_2, test_subcounty_2'})[0]['value'], 1)

        self.assertEqual(test_aggregation.find({'_id': 'UGANDA, test_region, test_district, test_subcounty, test_parish'})[0]['value'], 2)
        self.assertEqual(test_aggregation.find({'_id': 'UGANDA, test_region, test_district, test_subcounty_2, test_parish_2'})[0]['value'], 1)
        self.assertEqual(test_aggregation.find({'_id': 'UGANDA, test_region, test_district_2, test_subcounty_2, test_parish_3'})[0]['value'], 1)

        self.assertEqual(test_aggregation.find({'_id': 'UGANDA'})[0]['value'], 4)

    def test_should_create_location_tree(self):
        wfs_service = MagicMock()
        wfs_service.get_features.return_value = test_features

        import_locationTree(wfs_service, self.database)
        location_tree = self.database.location_tree

        self.assertEqual(location_tree.find({"type": "parish", "location.subcounty": "test_subcounty_2"}).count(), 2)
        self.assertEqual(location_tree.find({"type": "subcounty", "location.district": "test_district"}).count(), 2)
        self.assertEqual(location_tree.find({"type": "district", "location.region": "test_region"}).count(), 2)
        self.assertEqual(location_tree.find({"type": "region"}).count(), 1)



if __name__ == '__main__':
    unittest.main()