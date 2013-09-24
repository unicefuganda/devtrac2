from shapely.geometry import *
import fiona
import sys, os
local_path = os.path.dirname(os.path.abspath(__file__))

def plot_shapfile_to_parishes(parish_ploygons, file_name):
    with fiona.open('%s/data/%s' % (local_path,file_name), 'r') as source:

        sink_schema = source.schema.copy()
        sink_schema['geometry'] = 'Point'
        sink_schema['properties']['DNAME_2010'] = "str:35"
        sink_schema['properties']['SNAME_2010'] = "str:35"
        sink_schema['properties']['PNAME_2006'] = "str:35"

        with fiona.open('%s/data/replotted/%s' % (local_path,file_name), 'w', crs=source.crs, driver=source.driver, schema=sink_schema ) as sink:

            for f in source:
                point = shape(f['geometry'])

                try:
                    polygons_intersect = (x for x in parish_ploygons if point.intersects(x['shape'])).next()
                except Exception as inst:
                    print "This point is not in a parish"
                    print point
                    continue

                properties = polygons_intersect["properties"]
                f['properties']['PNAME_2006'] = properties['PNAME_2006']
                f['properties']['DNAME_2010'] = properties['DNAME_2010']
                f['properties']['SNAME_2010'] = properties['SNAME_2010']
                sink.write(f)

parish_ploygons = []

with fiona.open('%s/data/uganda_parish_10.shp' % local_path, 'r') as source:

    sink_schema = source.schema.copy()
    sink_schema['geometry'] = 'Point'

    for f in source:
        parish_ploygons.append({ 'shape': shape(f['geometry']), 'properties': f['properties'] })

# plot_shapfile_to_parishes(parish_ploygons, "health_centers.shp")
plot_shapfile_to_parishes(parish_ploygons, "Uganda Schools_234567.shp")
