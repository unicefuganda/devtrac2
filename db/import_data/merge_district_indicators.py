from shapely.geometry import *
import fiona
import sys, os
base_dir = os.path.abspath(os.path.dirname(__file__) + "/../../")

import csv
district_indicators = {}

file_name = "uganda_districts_2011_with_indicators" 
os.system("rm %s.shp" % file_name)
os.system("rm %s.json" % file_name)

with open("%s/db/district_indicators.csv" % base_dir, 'rUb') as csvfile: 
    reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')

    for row in reader:
        district_indicators[row['District'].lower()] = row

    with fiona.open("%s/static/javascript/geojson/uganda_districts_2011_005.json" % base_dir, 'r') as district_geojson:

        properties = ["Pop_2010", "Pop_2011", "DPT3_perc", "DPT3_vacc", "Measles_Perc", "No_Measles", 
            "HF_Delivery_Perc", "Not_Del_HF", "Pit_LatCov_Perc", "No_Pit_Lat", "Safe_Water_Cov_Perc", 
            "No_Safe_Water", "School_Start_at6_Perc", "Not_start_at_6", "CompletePS_Perc", "Not_CompletingPS" ]
        
        sink_schema = district_geojson.schema.copy()
        
        for prop in properties:
            sink_schema["properties"][prop] = "str:35"

        with fiona.open('%s/%s.json' % (base_dir, file_name), 'w', crs= district_geojson.crs, driver=district_geojson.driver, schema=sink_schema ) as sink:
           for district_row in district_geojson:
               if (not district_row['geometry'] == None):
                   indicators = district_indicators[district_row['properties']['DNAME_2010'].lower()]

                   for prop in properties:
                        district_row['properties'][prop] = indicators[prop]

                   sink.write(district_row)

        os.system("ogr2ogr %s.shp %s.json" % (file_name, file_name))