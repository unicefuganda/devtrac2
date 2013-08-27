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
def  spit_json():
	data = {'Uganda CKAN API URL : ' : 'http://data.ug/api/3/action/package_search?q=health','Country ' :'Uganda'}
	return jsonify(data)

@app.route('/ugdata/<query>')
def  get_dataset(query):
	url = 'http://data.ug/api/3/action/package_search'
	params = {'q': query}

	return contact_ckan_instance(url,params)

@app.route("/health")
def health():
	return render_template('health.html')


def contact_ckan_instance(url,params):
	data_string = urllib.quote(json.dumps(params))
	response = urllib2.urlopen(url,data_string)
	response_dict = json.loads(response.read())
	assert response_dict['success'] is True

	result = response_dict['result']
	return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)