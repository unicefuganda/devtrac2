import os,sys
sys.path.append('/var/www/devtrac2')
os.environ['DEVTRAC_ENV'] = 'Production'
from application import app as application