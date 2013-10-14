import os
import application
import unittest
import tempfile
from app.services import *
from db.import_data.import_geonode import *
from pymongo import MongoClient
from mock import MagicMock


class UReportTestCase(unittest.TestCase):

    def setUp(self):
        self.db = MongoClient().devtrac2_test
        self.db.ureport_questions.remove()
        self.db.ureport_responses.remove()
        self.db.ureport_questions.insert({"_id": 1, "question": "a_question"})
        self.db.ureport_questions.insert({"_id": 2, "question": "a_question_2"})

        self.db.ureport_responses.insert({"_id": 1, "locator": "UGANDA, ACHOLI, GULU", "text": "text1"})
        self.db.ureport_responses.insert({"_id": 2, "locator": "UGANDA, ACHOLI, GULU", "text": "text2"})
        self.db.ureport_responses.insert({"_id": 3, "locator": "UGANDA, ACHOLI, GULU", "text": "text3"})
        self.db.ureport_responses.insert({"_id": 4, "locator": "UGANDA, ACHOLI, GULU", "text": "text4"})
        self.db.ureport_responses.insert({"_id": 5, "locator": "UGANDA, ACHOLI, GULU", "text": "text5"})
        self.db.ureport_responses.insert({"_id": 6, "locator": "UGANDA, ACHOLI, GULU", "text": "text6"})
        
        self.db.ureport_responses.insert({"_id": 7, "locator": "UGANDA, ACHOLI, OTHER", "text": "other text"})

    def test_should_find_all_questions(self):
        ureportService = UReportService(self.db)
        self.assertEqual(len(ureportService.questions()), 2)
        self.assertEqual(ureportService.questions()[0]['_id'], 1); 
        self.assertEqual(ureportService.questions()[0]['question'], "a_question"); 

    def test_should_find_top5_for_district(self):
        ureportService = UReportService(self.db)
        responses = [ report['text'] for report in ureportService.top5("UGANDA, ACHOLI, GULU")]
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