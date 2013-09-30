from shapely.geometry import *
import fiona
import sys, os
from shapely import speedups
speedups.enable()
local_path = os.path.dirname(os.path.abspath(__file__))

data_folder = "/Users/Thoughtworker/Google Drive/Thoughtworks Drive/Application Data"

def find_closest_ploygon(polygons, point):
    print "find closest"
    distances = [(x['shape'].distance(point), x) for x in polygons]
    # print distances
    sorted_distances = sorted(distances, key=lambda x: x[0])
    print "found closest"
    return sorted_distances[0][1]

def plot_shapfile_to_parishes(parish_ploygons, file_name):
    with fiona.open("%s/%s" % (data_folder, file_name), 'r') as source:

        sink_schema = source.schema.copy()
        sink_schema['geometry'] = 'Point'
        sink_schema['properties']['Reg_2011'] = "str:35"
        sink_schema['properties']['DNAME_2010'] = "str:35"
        sink_schema['properties']['SNAME_2010'] = "str:35"
        sink_schema['properties']['PNAME_2006'] = "str:35"

        with fiona.open('%s/replotted/%s' % (data_folder, file_name), 'w', crs=source.crs, driver=source.driver, schema=sink_schema ) as sink:

            for f in source:
                point = shape(f['geometry'])

                try:
                    polygon_intersect = (x for x in parish_ploygons if point.intersects(x['shape'])).next()
                except Exception as inst:
                    print "This point is not in a parish"
                    print point
                    polygon_intersect = find_closest_ploygon(parish_ploygons, point)

                properties = polygon_intersect["properties"]
                f['properties']['Reg_2011'] = properties['Reg_2011']
                f['properties']['PNAME_2006'] = properties['PNAME_2006']
                f['properties']['DNAME_2010'] = properties['DNAME_2010']
                f['properties']['SNAME_2010'] = properties['SNAME_2010']
                sink.write(f)

parish_ploygons = []

with fiona.open('%s/uganda_parish_10.shp' % data_folder, 'r') as source:

    sink_schema = source.schema.copy()
    sink_schema['geometry'] = 'Point'

    for f in source:
        parish_ploygons.append({ 'shape': shape(f['geometry']), 'properties': f['properties'] })


# plot_shapfile_to_parishes(parish_ploygons, "health_centers.shp")
plot_shapfile_to_parishes(parish_ploygons, "Uganda Schools.shp")
# plot_shapfile_to_parishes(parish_ploygons, "waterpoints_wgs84.shp")
