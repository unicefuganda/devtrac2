from flask import Flask, url_for
from flask import render_template
import json
from flask import jsonify
import urllib2
import urllib
from lib import excel_reader as xls
import settings as config



app = Flask(__name__)

@app.route("/")
def index():
	return render_template('index.html')

@app.route("/leaflet/")
def leaflet():
	return render_template('leaflet.html')

@app.route("/geonode_embedded/")
def geonode_embedded():
	return render_template('geonode_embedded.html')

@app.route('/json')
def spit_json():
	data = {'Uganda CKAN API SEARCH URL : ' : config.CKAN_PACKAGE_SEARCH_URL,'Country ' :'Uganda'}
	return jsonify(data)

@app.route('/ugdata/<query>')
def get_dataset(query):
	url = config.CKAN_PACKAGE_SEARCH_URL
	params = {'q': query}

	return contact_ckan_instance(url,params)

@app.route('/health')
def health():
	return render_template('health.html')

@app.route('/excel')
def read_excel_file():
	file_path = config.TMP_DIRECTORY+'/healthunits.xls'
	excel = xls.get_worksheet_names(file_path)
	return 'excel workbook tabs : '+str(excel)

def contact_ckan_instance(url,params):
	data_string = urllib.quote(json.dumps(params))
	response = urllib2.urlopen(url,data_string)
	response_dict = json.loads(response.read())
	assert response_dict['success'] is True

	result = response_dict['result']
	return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)