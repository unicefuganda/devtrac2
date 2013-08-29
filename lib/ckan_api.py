import urllib2
import urllib
import json
import uuid


def contact_instance(url,params):
	data_string = urllib.quote(json.dumps(params))
	response = urllib2.urlopen(url,data_string)
	response_dict = json.loads(response.read())
	assert response_dict['success'] is True

	result = response_dict['result']
	return result

def  download_file(url,download_directory):
	filename = download_directory+'/'+str(uuid.uuid4())+'.xls'
	f = urllib2.urlopen(url)
	data = f.read()
	with open(filename, "wb") as code:
		code.write(data)

	return filename

	


	
