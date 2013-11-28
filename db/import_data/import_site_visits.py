import csv
import sys, os
from pymongo import MongoClient
from parish_service import *

base_dir = os.path.abspath(os.path.dirname(__file__) + "/../../")

def import_site_visits(wfs_service, database, data_dir):
    collection = database["site_visits"]
    collection.remove()
    parish_service = ParishService(wfs_service)

    with open("%s/%s/devtrac_solr_view_sitevisits.csv" % (base_dir, data_dir), 'rUb') as csvfile: 
        reader = csv.DictReader(csvfile, delimiter='\t', quotechar='"')
        updated_rows = []
        for csv_row in reader: 
            if (csv_row['Latitude'] == '' or csv_row['Longitude'] == ''):
                continue
            parish = parish_service.find([float(csv_row['Longitude']), float(csv_row['Latitude'])])
            properties = parish["properties"]
            csv_row['Reg_2011'] = properties['Reg_2011']
            csv_row['PNAME_2006'] = properties['PNAME_2006']    
            csv_row['DNAME_2010'] = properties['DNAME_2010']
            csv_row['SNAME_2010'] = properties['SNAME_2010']
            updated_rows.append(csv_row)
        collection.insert(updated_rows)