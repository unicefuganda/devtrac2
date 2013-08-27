import os

ROOT_DIRECTORY = os.path.dirname(os.path.abspath(__file__)) 
TMP_DIRECTORY = os.path.join(ROOT_DIRECTORY, 'tmp')
CKAN_PACKAGE_SEARCH_URL = 'http://data.ug/api/3/action/package_search'