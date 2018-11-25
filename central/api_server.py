# ****************************************
#              Junction 2018
#
# Project: Embrace
# ****************************************
import copy
import json
import time

import flask
from flask import request
from flask_cors import CORS
from flask_socketio import SocketIO
from pymongo import MongoClient

# Configure Flask app
app = flask.Flask(__name__)
CORS(app, supports_credentials=True)
app.config["DEBUG"] = True
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
socketio = SocketIO(app, cors_allowed_origins="*")

# Set up MongoDB client
client = MongoClient('localhost', 27017)

# Configure global session
session = {}


@app.route('/', methods=['GET'])
def index():
    """ Index page
    """
    print("--> Index page accessed..")
    return "Junction 2018 - Project: Embrace - V1.0"


def save_one_db(collection_name, doc):
    """
    Insert one doc into the Embrace DB
    :param collection_name: collection name string
    :param doc: document to be inserted
    :return:
    """
    db = client['embrace']
    collection = db[collection_name]
    collection.insert_one(doc)


@app.route('/push_data', methods=['POST'])
def push_data():
    """
    Insert data from Movesense into the MongoDB
    :return:
    """
    data_json = request.json
    print("--> Data received: {}".format(data_json))
    data_json['timestamp'] = int(time.time())

    save_one_db("movesense", copy.deepcopy(data_json))
    send_to_socket(data_json)
    return "200"


@app.route('/exchange_data', methods=['GET'])
def exchange_data():
    """
    In request send x, y, z - position VR headset
    :return: Animal ("spider"/"dog"/"rat") & exposure level (int from 0 to 100)
    """
    is_dev = False
    if request.args.get('dev') == 'test_notebook':
        is_dev = True
    headset = {}
    print(" Request: {}".format(request))
    # Read in the AR headset parameters
    headset['x'] = request.args.get('x')
    headset['y'] = request.args.get('y')
    headset['z'] = request.args.get('z')
    headset['timestamp'] = int(time.time())
    if not is_dev:
        save_one_db("vr_headset", copy.deepcopy(headset))
    print("Headset params: {}, {}, {}".format(headset['x'], headset['y'], headset['z']))

    # Failsafe
    if 'environment' not in session:
        session['environment'] = "animal"
        print(session['environment'])
    environment = session['environment']

    # Failsafe
    if 'exposure' not in session:
        session['exposure'] = 0
        print(session['exposure'])
    exposure = session['exposure']

    result = {}
    result['environment'] = environment  # room/animal

    animal = "dog"
    if environment != "room":
        animal = copy.deepcopy(environment)
        environment = "animal"

    result['animal'] = animal  # spider/dog/rat
    result['exposure'] = exposure  # A number between 0..100, distance of the object

    print("--> Environment:", environment)
    print("--> Animal:", animal)
    print("--> Exposure:", exposure)

    if not is_dev:
        send_to_ar_socket(headset)
    return json.dumps(result)


@app.route('/get_environment', methods=['GET'])
def get_environment():
    """
    Return the environment ("animal"/"room")
    :return: Returns the environment variable set in the configuration (UI).
    """
    if 'environment' not in session:
        session['environment'] = "animal"
        print(session['environment'])
    env = session['environment']
    if env != "room":
        env = "animal"
    print("--> Environment asked and returned: {}".format(env))
    return env


@app.route('/get_environment_ui', methods=['GET'])
def get_environment_ui():
    """
    Return the environment for UI ("dog"/"room"/"spider"/"rat")
    :return: Returns the environment variable set in the configuration (UI).
    """
    if 'environment' not in session:
        session['environment'] = "dog"
        print(session['environment'])
    env = session['environment']
    print("--> Environment asked and returned for UI: {}".format(env))
    return env


@app.route('/set_environment', methods=['POST'])
def set_environment():
    """
    Set the environment ("room"/"rat"/"spider"/"dog")
    :return: "200"
    """
    session['environment'] = request.json.get('environment')
    env = session['environment']
    print("--> Environment set to: {}".format(env))
    return "200"


@app.route('/set_exposure', methods=['POST'])
def set_exposure():
    """
    Set the exposure level (int from 0 to 100)
    :return: "200"
    """
    session['exposure'] = request.json.get('exposure')
    exposure = session['exposure']
    print("--> Exposure set to: {}".format(exposure))
    return "200"


@app.route('/get_exposure', methods=['GET'])
def get_exposure():
    """
    Return the exposure level (int from 0 to 100)
    :return: Return the exposure level (int from 0 to 100)
    """
    if 'exposure' not in session:
        session['exposure'] = 0
        print(session['exposure'])
    exposure = session['exposure']
    print("--> Exposure asked and returned for UI: {}".format(exposure))
    return str(exposure)


@socketio.on('json')
def send_to_socket(json):
    print('Sending to socket: ' + str(json))
    socketio.emit('sensor_data', json, json=True)


@socketio.on('json')
def send_to_ar_socket(json):
    print('Sending to AR socket: ' + str(json))
    socketio.emit('ar_data', json, json=True)


if __name__ == "__main__":
    socketio.run(app)
