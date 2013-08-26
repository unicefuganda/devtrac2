from flask import Flask
from flask import render_template
import json
from flask import jsonify
import urllib2
import urllib


app = Flask(__name__)

@app.route("/")
def index():
	return render_template('index.html')

@app.route('/json')
def  Spitjson():
	data = {}
	return jsonify({'Uganda CKAN API URL : ' : 'http://data.ug/api/3/action/package_search?q=health','Country ' :'Uganda'})

@app.route('/ugdata')
def  getDataSet():
	url = 'http://data.ug/api/3/action/package_search'
	params = {'q': 'health'}

	return contact_ckan_instance(url,params)


def contact_ckan_instance(url,params):
	data_string = urllib.quote(json.dumps(params))
	response = urllib2.urlopen(url,data_string)
	response_dict = json.loads(response.read())
	assert response_dict['success'] is True

	result = response_dict['result']
	return str(result)
	

if __name__ == "__main__":
    app.run(debug=True)