import sys, os
import csv
base_dir = os.path.abspath(os.path.dirname(__file__) + "/../../")
sys.path.append(base_dir)

from shapely.geometry import *
import fiona
import sys, os
from shapely import speedups
speedups.enable()
local_path = os.path.dirname(os.path.abspath(__file__))

parish_ploygons = []

data_folder = "/Users/Thoughtworker/Google Drive/Thoughtworks Drive/Application Data"

with fiona.open('%s/uganda_parish_10.shp' % data_folder, 'r') as source:

    for f in source:
        parish_ploygons.append({ 'shape': shape(f['geometry']), 'properties': f['properties'] })


with open("%s/../UNICEF_activities_better_new.csv" % local_path, 'rUb') as csvfile: 
    reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
    projects = list(reader)

keys = set( projects[0].keys()) - set(['LONG', 'LAT'])

sink_schema = {'properties': {}}
sink_schema['geometry'] = 'Point'

for key in keys:
    sink_schema['properties'][key] = "str:35"


sink_schema['properties']['Reg_2011'] = "str:35"
sink_schema['properties']['DNAME_2010'] = "str:35"
sink_schema['properties']['SNAME_2010'] = "str:35"
sink_schema['properties']['PNAME_2006'] = "str:35"

os.system("rm -rf %s/projects" % local_path)

with fiona.open("%s/projects" % local_path, 'w', driver='ESRI Shapefile', schema = sink_schema) as source:
    
    for project in projects: 

        row = {
            'properties': {
                }, 
            'geometry': {"type":"Point","coordinates":[ float(project['long']), float(project['lat'])]} 
        }

        for key in keys:
            row['properties'][key] = project[key]

        point = shape(row['geometry'])

        try:
            polygon_intersect = (x for x in parish_ploygons if point.intersects(x['shape'])).next()
        except Exception as inst:
            print "This point is not in a parish"
            print point
            polygon_intersect = find_closest_ploygon(parish_ploygons, point)

        properties = polygon_intersect["properties"]
        row['properties']['Reg_2011'] = properties['Reg_2011']
        row['properties']['PNAME_2006'] = properties['PNAME_2006']
        row['properties']['DNAME_2010'] = properties['DNAME_2010']
        row['properties']['SNAME_2010'] = properties['SNAME_2010']

        source.write(row)