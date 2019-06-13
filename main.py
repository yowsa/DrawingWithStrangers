from flask import Flask, request, jsonify
#from flask import json

app = Flask(__name__)

@app.route('/hello', methods=['GET', 'POST'])
def hello_world():
    result = "results"
    value = request.args.get('name')
    return jsonify({"hej" : value})




"""
@app.route('/second')
def second_page():
    return 'Second page'
"""