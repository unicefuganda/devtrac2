from flask import Flask
from flask import render_template
app = Flask(__name__)

@app.route("/hello/<name>")
@app.route("/hello/")
def index(name=None):
	return render_template('index.html', name=name)

@app.route("/map/<location>")
def map(location):
    return "<h1>Map for %s</h1>" % location

if __name__ == "__main__":
    app.run(debug=True)