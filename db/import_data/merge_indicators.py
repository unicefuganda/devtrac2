from shapely.geometry import *
import fiona
import sys, os
local_path = os.path.dirname(os.path.abspath(__file__))

import csv
district_indicators = {}
with open("%s/district_indicators.csv" % local_path, 'rUb') as csvfile: 
    reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
    for row in reader:
        district_indicators[row['District'].lower()] = row
    with fiona.open('%s/../static/javascript/geojson/uganda_districts_2011_005.json' % local_path, 'r') as district_geojson:
        
        sink_schema = district_geojson.schema.copy()
        # sink_schema['properties']['CompletePS_Perc'] = "float"
        sink_schema['properties']['School_Start_at6_Perc'] = "float"

        file_name = "uganda_districts_2011_with_school_start" 
        os.system("rm %s.json" % file_name)
        with fiona.open('%s/%s.json' % (local_path, file_name), 'w', crs= district_geojson.crs, driver=district_geojson.driver, schema=sink_schema ) as sink:
            for district_row in district_geojson:
                if (not district_row['geometry'] == None):

                    indicators = district_indicators[district_row['properties']['DNAME_2010'].lower()]
                    if (indicators['School_Start_at6_Perc'] == ""):
                        continue
                    district_row['properties']['School_Start_at6_Perc'] = float(indicators['School_Start_at6_Perc'])
                    sink.write(district_row)
        os.system("ogr2ogr %s.shp %s.json" % (file_name, file_name))

  

