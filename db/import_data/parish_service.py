from shapely.geometry import *
import sys, os
from shapely import speedups
speedups.enable()
local_path = os.path.dirname(os.path.abspath(__file__))

class ParishService:
    
    def __init__(self, wfs_service):
        self.parish_polygons = []
        features = wfs_service.get_features("uganda_parish_2011_50")

        for f in features:
            self.parish_polygons.append({ 'shape': shape(f['geometry']), 'properties': f['properties'] })

    def __find_closest_polygon(self, polygons, point):
        distances = [(x['shape'].distance(point), x) for x in polygons]
        sorted_distances = sorted(distances, key=lambda x: x[0])
        return sorted_distances[0][1]

    def find(self, coords): 
        point = shape({"type":"Point","coordinates":coords})

        try:
            polygon_intersect = (x for x in self.parish_polygons if point.intersects(x['shape'])).next()
        except Exception as inst:
            polygon_intersect = self.__find_closest_polygon(self.parish_polygons, point)
        return polygon_intersect