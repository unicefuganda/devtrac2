from bson.code import Code

def import_dataset(wfs_service, db, data_type, feature_name):
    features = wfs_service.get_features(feature_name)
    collection = db[data_type]
    collection.remove()

    collection.insert(features)

    mapper = Code("""
        function() {
            emit("UGANDA, " + this.properties["Reg_2011"], 1);
            emit("UGANDA, " + this.properties["Reg_2011"] + ", " + this.properties["DNAME_2010"], 1);
            emit("UGANDA, " + this.properties["Reg_2011"] + ", " + this.properties["DNAME_2010"] + ", " + this.properties["SNAME_2010"], 1);
            emit("UGANDA, " + this.properties["Reg_2011"] + ", " + this.properties["DNAME_2010"] + ", " + this.properties["SNAME_2010"] + ", " + this.properties["PNAME_2006"], 1);
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

    collection.map_reduce(mapper, reducer, "%s_aggregation" % data_type)
    db["%s_aggregation" % data_type].insert({ "_id": "UGANDA",  "value": len(features) })


def import_locationTree(wfs_service, db):
    features = wfs_service.get_features("uganda_parish_2011_50")

    collection = db["location_tree"]
    collection.remove()

    def insert_if_not_exists(obj):
        if (collection.find_one({"_id": obj["_id"]}) == None):
            collection.insert(obj)
    
    locations = []
    for feature in features: 

        location = { 
            "national": "UGANDA",
            "region":  feature['properties']['Reg_2011'] 
        };

        region = { "type": "region", "location": location, "_id": "UGANDA, " + feature['properties']["Reg_2011"] }
        insert_if_not_exists(region)

        location['district'] = feature['properties']['DNAME_2010']

        district = { 
            "type": "district", 
            "location": location, 
            "_id": "UGANDA, " + feature['properties']["Reg_2011"] + ", " + feature['properties']["DNAME_2010"] }
        insert_if_not_exists(district)

        location['subcounty'] = feature['properties']['SNAME_2010']

        subcounty = { 
            "type": "subcounty", 
            "location": location, 
            "_id": "UGANDA, " + feature['properties']["Reg_2011"] + ", " + feature['properties']["DNAME_2010"] + ", " + feature['properties']["SNAME_2010"]}
        insert_if_not_exists(subcounty)

        location["parish"] = feature['properties']['PNAME_2006']
        parish = { 
            "type": "parish", 
            "location": location, 
            "_id": "UGANDA, " + feature['properties']["Reg_2011"] + ", " + feature['properties']["DNAME_2010"] + ", " + feature['properties']["SNAME_2010"] + ", " + feature['properties']['PNAME_2006']
        }
        insert_if_not_exists(parish)
    collection.insert({"type": "national", "location": {}, "_id": "UGANDA" })
