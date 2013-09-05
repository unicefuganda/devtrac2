from flask import *
from lib.services import *
from lib import excel_reader as xls
from lib import ckan_api as ckan
import settings as config
import sys, os

app = Flask(__name__)
app.config.from_pyfile('application.cfg', silent=True)
db = MongoEngine(app)

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

@app.route("/spikes/")
def spikes():
	return render_template('dashboard.html', section="dashboards")

@app.route("/district/<name>/")
def district(name):
	return render_template('dashboard.html', section="dashboards")

@app.route("/")
def dashboards():
	return render_template('dashboard.html', section="dashboards")

@app.route("/districts.json")
def districts():
	districts = DistrictService().find_all()
	return "{ \"districts\":%s}" % districts.to_json()

# SPIKES ROUTES

@app.route("/leaflet/")
def leaflet():
	return render_template('spikes/leaflet.html')

@app.route("/geonode_embedded/")
def geonode_embedded():
	return render_template('spikes/geonode_embedded.html')

@app.route("/geonode_openlayers/")
def geonode_openlayers():
	return render_template('spikes/geonode_openlayers.html')

@app.route("/markers_openlayers/")
def markers_openlayers():
	return render_template('spikes/markers_openlayer.html')

@app.route("/mapbox/")
def mapbox():
	return render_template('spikes/mapbox.html')

@app.route("/cluster_openlayers/")
def cluster_openlayers():
	return render_template('spikes/cluster_openlayers.html')

@app.route("/cluster_leaflets/")
def cluster_leaflets():
	return render_template('spikes/cluster_leaflets.html')

@app.route('/json')
def spit_json():
	data = {'Uganda CKAN API SEARCH URL : ' : config.CKAN_PACKAGE_SEARCH_URL,'Country ' :'Uganda'}
	return jsonify(data)

@app.route('/health')
def health():
	return render_template('spikes/health.html')

@app.route('/education')
def education():
	return render_template('spikes/education.html')

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