from flask import Flask
from flask import render_template
from flask import jsonify
from lib import excel_reader as xls
from lib import ckan_api as ckan
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

@app.route("/geonode_openlayers/")
def geonode_openlayers():
	return render_template('geonode_openlayers.html')

@app.route('/json')
def spit_json():
	data = {'Uganda CKAN API SEARCH URL : ' : config.CKAN_PACKAGE_SEARCH_URL,'Country ' :'Uganda'}
	return jsonify(data)


@app.route('/health')
def health():
	return render_template('health.html')

@app.route('/education')
def education():
	return render_template('education.html')

@app.route('/ugdata/<query>')
def  get_dataset(query):
	url = config.CKAN_PACKAGE_SEARCH_URL
	params = {'q': query}

	return jsonify(ckan.contact_instance(url,params))

@app.route('/download_resource')
def read_file():	
	file_url = ckan.download_file(config.CKAN_SCHOOLS_RESOURCE_URL,config.TMP_DIRECTORY) 
	output = xls.get_worksheet_data(file_url)
	return jsonify(output)


if __name__ == "__main__":
    app.run(debug=True)