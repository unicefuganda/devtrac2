import os
import application
import unittest
import tempfile
from lib.services import *

class DistrictServiceTestCase(unittest.TestCase):

    def test_should_find_by_name(self):
        self.skipTest("Import of data has been disabled")
        service = DistrictService()
        district = service.find_by_name("gulu")
        self.assertEquals(district.name, "Gulu")
        self.assertEquals(district.subregion, "Acholi")

    def test_should_find_all(self):
        self.skipTest("Import of data has been disabled")
        service = DistrictService()
        districts = service.find_all()
        self.assertGreater(len(districts), 1)
        self.assertIsNotNone(districts[0].name)

class WFSServiceTestCase(unittest.TestCase):

    def test_should_find_features(self):
        self.skipTest("This hits an actual service. Skip until integration tests setup.")
        url = "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/ows"
        service = WFSService(url, 2)
        features = service.get_features("uganda_districts_2010")
        self.assertEqual(len(features), 2)
        self.assertIsNotNone(features[0]["AREA"])


if __name__ == '__main__':
    unittest.main()