from pymongo import MongoClient
from import_geonode import import_dataset,import_locationTree
import sys, os
base_dir = os.path.abspath(os.path.dirname(__file__) + "/../")
sys.path.append(base_dir)
 
mongo_client = MongoClient()
database = mongo_client.devtrac2

from lib import services

wfs_service = services.WFSService("http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/ows", test=True)

import_dataset(wfs_service, database, "health_center", "uganda_health_centers_replotted")
import_dataset(wfs_service, database, "school", "uganda_schools_with_regions")
import_locationTree(wfs_service,database)   