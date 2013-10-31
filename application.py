from flask import *
import sys, os
from flask.ext.assets import Environment, Bundle
from flask import Flask, jsonify
from app import services
from config import *
from pymongo import MongoClient

from bson import Binary, Code
from bson.json_util import dumps

app = Flask(__name__)

env = os.environ.get('DEVTRAC_ENV')
env = "Development" if env == None else env
app.config.from_object('config.config.%sConfig' % env)

assets = Environment(app)

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

js = Bundle(
	'javascript/lib/angular.min.js', 
	'javascript/lib/angular-route.min.js', 
	'javascript/lib/jquery-2.0.3.min.js',
	'javascript/lib/mapbox.js',
	'javascript/dashboard.js',
	'javascript/controllers.js',
	'javascript/directives.js',
	'javascript/map.js',
	'javascript/utilities.js',
	'javascript/config.js',
	'javascript/application.js',
	'javascript/lib/bootstrap.min.js',
	'javascript/location.js',
	'javascript/layer-map.js',
	'javascript/layer-options.js',
	'javascript/lib/jquery.flot.min.js',
	'javascript/lib/jquery.flot.pie.min.js',
	'javascript/lib/chosen.jquery.min.js',
	'javascript/lib/modernizr.js',
	'javascript/dt/project.js',
	'javascript/services/services.js',
	'javascript/services/project-service.js',
     filters='jsmin', output='gen/packed.js')

assets.register('js_all', js)

css = Bundle(
	'css/lib/bootstrap.min.css', 
	'css/lib/mapbox.css',
	'css/lib/chosen.min.css',
	'css/application.css',
	'css/map.css',
	
     filters='cssmin', output='gen/packed.css')

assets.register('css_all', css)

@app.route("/")
@app.route("/dashboard/<region>")
@app.route("/dashboard/<region>/<district>")
@app.route("/dashboard/<region>/<district>/<subcounty>")
@app.route("/dashboard/<region>/<district>/<subcounty>/<parish>")
def dashboards(region="", district="", subcounty="", parish=""):
	test = request.args.get("test") == "true"
	return render_template('dashboard.html', test=test)

@app.route("/aggregation/<locator>")
def aggregation(locator):
	result = services.AggregationService(services.LocationService(__mongo_connection())).find(services.Locator(locator))
	return Response(dumps(result), mimetype='application/json')

@app.route("/ureport/questions")
def ureport_questions():
	result = services.UReportService(__mongo_connection()).questions()
	return Response(dumps(result), mimetype='application/json')

@app.route("/ureport/questions/<question_id>/top5/<locator>")
def ureport_top5(question_id, locator):
	result = services.UReportService(__mongo_connection()).top5(services.Locator(locator), question_id)
	return Response(dumps(result), mimetype='application/json')

@app.route("/ureport/questions/<question_id>/results/<locator>")
def ureport_results(question_id, locator):
	result = services.UReportService(__mongo_connection()).results(services.Locator(locator), question_id)
	return Response(dumps(result), mimetype='application/json')

@app.route("/ureport/questions/<question_id>/child_results/<locator>")
def ureport_child_results(question_id, locator):
	result = services.UReportService(__mongo_connection()).child_results(services.Locator(locator), question_id)
	return Response(dumps(result), mimetype='application/json')

def __mongo_connection():
	return MongoClient().devtrac2


@app.route("/stub_tiles/<s>/<x>/<y>/<z>.png")
def stub_tiles(s,x,y,z):
  return send_file("static/javascript/lib/images/test_tile.png")

if __name__ == "__main__":
    app.run(debug=True)