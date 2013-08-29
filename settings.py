import os

ROOT_DIRECTORY = os.path.dirname(os.path.abspath(__file__)) 
TMP_DIRECTORY = os.path.join(ROOT_DIRECTORY, 'tmp')
CKAN_PACKAGE_SEARCH_URL = 'http://data.ug/api/3/action/package_search'
CKAN_PACKAGE_SHOW_URL = 'http://data.ug/api/3/action/package_show'
CKAN_SCHOOLS_PACKAGE_ID = '2306d182-6f3b-460e-abd8-fe96c5269427'
CKAN_SCHOOLS_RESOURCE_URL = 'http://data.ug/storage/f/2013-02-21T115625/list_of_private_and_govt_schools.xls'