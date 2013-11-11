from shapely.geometry import *
import fiona
import sys, os
from shapely import speedups
speedups.enable()
local_path = os.path.dirname(os.path.abspath(__file__))

data_folder = "/Users/Thoughtworker/Google Drive/Thoughtworks Drive/Application Data"

class ParishService:
    
    def __init__(self):
        self.parish_polygons = []

        with fiona.open('%s/uganda_parish_10.shp' % data_folder, 'r') as source:

            sink_schema = source.schema.copy()
            sink_schema['geometry'] = 'Point'

            for f in source:
                self.parish_polygons.append({ 'shape': shape(f['geometry']), 'properties': f['properties'] })

        print "loaded shapes"

    def __find_closest_polygon(self, polygons, point):
        distances = [(x['shape'].distance(point), x) for x in polygons]
        sorted_distances = sorted(distances, key=lambda x: x[0])
        return sorted_distances[0][1]

    def find(self, coords): 
        point = shape({"type":"Point","coordinates":coords})

        try:
            polygon_intersect = (x for x in self.parish_polygons if point.intersects(x['shape'])).next()
            print "found plygon"
        except Exception as inst:
            print "couldnt find polygon"
            polygon_intersect = self.__find_closest_polygon(self.parish_polygons, point)
        return polygon_intersect