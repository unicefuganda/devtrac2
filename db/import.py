import sys, os
base_dir = os.path.abspath(os.path.dirname(__file__) + "/../")
sys.path.append(base_dir)

from bson.code import Code
from pymongo import MongoClient
from lib import services

wfs_service = services.WFSService("http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/ows", test=True)

mongo_client = MongoClient()
database = mongo_client.devtrac2

dataset_mapping = {
    "health_center": "uganda_health_centers_replotted",
    "school": "uganda_schools_with_regions",
}

def import_dataset(db, dataset):
    features = wfs_service.get_features(dataset_mapping[dataset])
    collection = db[dataset]
    collection.remove()
    collection.insert(features)
     
    mapper = Code("""
        function() {
            emit(this.properties["Reg_2011"], 1);
            emit(this.properties["Reg_2011"] + ", " + this.properties["DNAME_2010"], 1);
            emit(this.properties["Reg_2011"] + ", " + this.properties["DNAME_2010"] + ", " + this.properties["SNAME_2010"], 1);
            emit(this.properties["Reg_2011"] + ", " + this.properties["DNAME_2010"] + ", " + this.properties["SNAME_2010"] + ", " + this.properties["PNAME_2006"], 1);
        }
        """)

    reducer = Code("""
        function(key, values) {
            var total = 0

            values.forEach(function(v) {
                total += v;
            });
            return total; 
        }
        """)

    collection.map_reduce(mapper, reducer, "%s_aggregation" % dataset)
    print database["%s_aggregation" % dataset].count()

import_dataset(database, "health_center")
import_dataset(database, "school")

