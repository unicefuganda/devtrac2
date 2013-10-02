from bson.code import Code

def import_dataset(wfs_service, db, data_type, feature_name):
    features = wfs_service.get_features(feature_name)
    collection = db[data_type]
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

    collection.map_reduce(mapper, reducer, "%s_aggregation" % data_type)