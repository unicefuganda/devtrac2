from flask import *
from lib.services import *
from lib import excel_reader as xls
from lib import ckan_api as ckan
import settings as config
import sys, os
from flask.ext.assets import Environment, Bundle

app = Flask(__name__)
app.config.from_pyfile('application.cfg', silent=True)
db = MongoEngine(app)
assets = Environment(app)

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

js = Bundle(
	'javascript/lib/angular.min.js', 
	'javascript/lib/angular-route.min.js', 
	'javascript/lib/jquery-2.0.3.min.js',
	'javascript/dashboard.js',
	'javascript/controllers.js',
	'javascript/services.js',
	'javascript/directives.js',
	'javascript/map.js',
	'javascript/utilities.js',
	'javascript/lib/leaflet.js',
	'javascript/application.js',
	'javascript/lib/bootstrap.min.js',
	'javascript/lib/leaflet.markercluster.js',
	'javascript/location.js',
     filters='jsmin', output='gen/packed.js')

assets.register('js_all', js)

css = Bundle(
	'css/lib/bootstrap.min.css', 
	'css/lib/leaflet.css', 
	'css/application.css',
	'css/lib/MarkerCluster.css',
	'css/lib/MarkerCluster.Default.css',
     filters='cssmin', output='gen/packed.css')

assets.register('css_all', css)
test = "kevin"

@app.route("/")
@app.route("/district/<district>")
@app.route("/district/<district>/<subcounty>")
@app.route("/district/<district>/<subcounty>/<parish>")
def dashboards(district="", subcounty="", parish=""):
	test = request.args.get("test") == "true"
	return render_template('dashboard.html', test=test)

# SPIKES ROUTES

@app.route("/stub_tiles/<s>/<x>/<y>/<z>.png")
def stub_tiles(s,x,y,z):
	return send_file("static/javascript/lib/images/test_tile.png")

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