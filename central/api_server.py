# ****************************************
#              Junction 2018
#
# Project: Embrace
# ****************************************

import flask

app = flask.Flask(__name__)
app.config["DEBUG"] = True


@app.route('/', methods=['GET'])
def index():
    """ Index
    """
    print("... Command: ", "index")
    return "Junction 2018 - Project: Embrace - V1.0"


@app.route('/on_enter', methods=['GET'])
def on_enter():
    """ Command: On Enter
    """
    print("... Command: ", "on_enter")
    return "red"


@app.route('/on_exit', methods=['GET'])
def on_exit():
    """ Command: On Exit
    """
    print("... Command: ", "on_exit")
    return "white"


@app.route('/ball_fear', methods=['GET'])
def ball_fear():
    """ Command: Ball Fear
    """
    # command = "closer"
    command = "further"
    # command = "still"

    print("... Command: ", "ball_fear")
    return command


app.run()
