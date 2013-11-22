from shapely.geometry import *
import fiona
import sys, os
from parish_service import *
from shapely import speedups
speedups.enable()
local_path = os.path.dirname(os.path.abspath(__file__))

data_folder = "/Application Data"

def find_closest_ploygon(polygons, point):
    distances = [(x['shape'].distance(point), x) for x in polygons]
    sorted_distances = sorted(distances, key=lambda x: x[0])
    return sorted_distances[0][1]

def plot_shapfile_to_parishes(file_name):
    with fiona.open("%s/%s" % (data_folder, file_name), 'r') as source:

        sink_schema = source.schema.copy()
        sink_schema['geometry'] = 'Point'
        sink_schema['properties']['Reg_2011'] = "str:35"
        sink_schema['properties']['DNAME_2010'] = "str:35"
        sink_schema['properties']['SNAME_2010'] = "str:35"
        sink_schema['properties']['PNAME_2006'] = "str:35"

        with fiona.open('%s/replotted/%s' % (data_folder, file_name), 'w', crs=source.crs, driver=source.driver, schema=sink_schema ) as sink:

            for f in source:
                polygon_intersect = parish_service.find(f['geometry']['coordinates'])
                properties = polygon_intersect["properties"]
                f['properties']['Reg_2011'] = properties['Reg_2011']
                f['properties']['PNAME_2006'] = properties['PNAME_2006']
                f['properties']['DNAME_2010'] = properties['DNAME_2010']
                f['properties']['SNAME_2010'] = properties['SNAME_2010']
                sink.write(f)

parish_service = ParishService()
# plot_shapfile_to_parishes(parish_ploygons, "water_points2.shp")
plot_shapfile_to_parishes("Uganda Schools.shp")
# plot_shapfile_to_parishes(parish_ploygons, "waterpoints_wgs84.shp")
