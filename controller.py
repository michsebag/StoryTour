import GeoLocationExtractor
from flask import Flask
from flask import request
from flask import render_template

app = Flask(__name__, static_folder='resources')

#
# @app.route('/hello', methods=['GET'])
# def helloWord():
#     return 'Hellooooooo'


@app.route('/')
def home():
    return render_template("index.html")


@app.route('/geolocations', methods=['POST'])
def myfunc():
    text = request.get_data().decode('latin-1')
    locations = GeoLocationExtractor.tag_locations_from_text(text)
    #geolocations = GeoLocationExtractor.build_geo_locations_from_list(locations)
    return locations


@app.route('/f00', methods=['GET'])
def foo():
    return "foo........"




if __name__ == '__main__':
    app.run()
