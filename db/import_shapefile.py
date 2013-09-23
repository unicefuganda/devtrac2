from shapely.geometry import *
import fiona
polygons = []

with fiona.open('data/uganda_parish_10.shp', 'r') as source:

    sink_schema = source.schema.copy()
    sink_schema['geometry'] = 'Point'

    for f in source:
        polygons.append({ 'shape': shape(f['geometry']), 'properties': f['properties'] })
            
with fiona.open('data/health_centers.shp', 'r') as source:

    sink_schema = source.schema.copy()
    sink_schema['geometry'] = 'Point'
    sink_schema['properties']['DNAME_2010'] = "str:35"
    sink_schema['properties']['SNAME_2010'] = "str:35"
    sink_schema['properties']['PNAME_2006'] = "str:35"

    with fiona.open('data/health_centers_with_parishes.shp', 'w', crs=source.crs, driver=source.driver, schema=sink_schema ) as sink:

        for f in source:
            point = shape(f['geometry'])

            polygons_intersects = [x for x in polygons if point.intersects(x['shape'])]

            if (len(polygons_intersects) == 0):
                print "This point is not in a parish"
                print point
            else: 
                properties = polygons_intersects[0]["properties"]
                f['properties']['PNAME_2006'] = properties['PNAME_2006']
                f['properties']['DNAME_2010'] = properties['DNAME_2010']
                f['properties']['SNAME_2010'] = properties['SNAME_2010']
                sink.write(f)