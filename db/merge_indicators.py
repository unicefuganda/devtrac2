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
        sink_schema['properties']['CompletePS_Perc'] = "float"

        with fiona.open('%s/uganda_districts_2011_with_indicators.json' % local_path, 'w', crs= district_geojson.crs, driver=district_geojson.driver, schema=sink_schema ) as sink:
            for district_row in district_geojson:
                if (not district_row['geometry'] == None):

                    indicators = district_indicators[district_row['properties']['DNAME_2010'].lower()]
                    if (indicators['CompletePS_Perc'] == ""):
                        continue
                    district_row['properties']['CompletePS_Perc'] = float(indicators['CompletePS_Perc'])
                    sink.write(district_row)

  

