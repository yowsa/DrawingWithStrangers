from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hellllllo, Worllllld!'


@app.route('/second')
def second_page():
    return 'Second page'
