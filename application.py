from flask import *
import sys, os
from flask.ext.assets import Environment, Bundle
from flask import Flask, jsonify
from app import services
from config import *
from pymongo import MongoClient
from bson import Binary, Code
from bson.json_util import dumps

import logging
from logging.handlers import RotatingFileHandler
import uuid

app = Flask(__name__)

	
file_handler = RotatingFileHandler('logs/stack_traces.log')
file_handler.setLevel(logging.WARNING)
app.logger.addHandler(file_handler)

env = os.environ.get('DEVTRAC_ENV')
env = "Development" if env == None else env
app.config.from_object('config.config.%sConfig' % env)

print env

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
	'javascript/filters.js',
	'javascript/map.js',
	'javascript/map-marker.js',
	'javascript/utilities.js',
	'javascript/config.js',
	'javascript/lib/bootstrap.min.js',
	'javascript/lib/bootstrap-paginator.js',
	'javascript/lib/transition.js',
	'javascript/lib/carousel.js',
	'javascript/location.js',
	'javascript/layer-map.js',
	'javascript/layer-options.js',
	'javascript/lib/chosen.jquery.min.js',
	'javascript/lib/modernizr.js',
	'javascript/dt/project.js',
	'javascript/services/services.js',
	'javascript/services/project-service.js',
	'javascript/services/site-visit-service.js',
	'javascript/dt/site-visit.js',
	'javascript/services/ureport-service.js',
	'javascript/services/heatmap-service.js',
	'javascript/lib/ui-bootstrap-custom-0.6.0.min.js',
	'javascript/lib/ui-bootstrap-custom-tpls-0.6.0.min.js',
     filters='jsmin', output='gen/packed.js')

assets.register('js_all', js)

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

@app.route("/print")
def print_page():
	return render_template('print.html', env=env)

@app.route("/site_visits")
def site_visits():
	result = services.SiteVisitService(__mongo_connection()).all()
	return Response(dumps(result), mimetype='application/json')


@app.route("/download_pdf/<locator>")
@app.route("/devtrac_report/<locator>")
def download_pdf(locator):

	servername =  app.config['SERVER_NAME'] if app.config['SERVER_NAME'] != None else request.environ.get('SERVER_NAME')
	filename = "%s.pdf" % str(uuid.uuid1())
	os.system("phantomjs scripts/rasterize.js 'http://%s/print?locator=%s' %s/%s letter" % (servername, locator, app.config['PDF_FOLDER'], filename))

	return send_from_directory(app.config['PDF_FOLDER'], filename, as_attachment=False)

def __mongo_connection():
	return MongoClient().devtrac2


@app.route("/stub_tiles/<s>/<x>/<y>/<z>.png")
def stub_tiles(s,x,y,z):
  return send_file("static/javascript/lib/images/test_tile.png")

if __name__ == "__main__":
    app.run(debug=True)
