import os
import application
import unittest
import tempfile
from lib.services import *

class DistrictServiceTestCase(unittest.TestCase):

  def test_should_find_by_name(self):
    service = DistrictService()
    district = service.find_by_name("gulu")
    self.assertEquals(district.name, "Gulu")
    self.assertEquals(district.subregion, "Acholi")

  def test_should_find_all(self):
    service = DistrictService()
    districts = service.find_all()
    self.assertGreater(len(districts), 1)
    self.assertIsNotNone(districts[0].name)

if __name__ == '__main__':
  unittest.main()