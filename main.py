from flask import Flask, request, jsonify
#from flask import json

app = Flask(__name__)

mydict = {'key' : 'value', 'hey' : 'yo'}

@app.route('/hello', methods=['GET', 'POST'])
def hello_world():
    result = "results"
    value = request.args.get('name')
    return jsonify({"hej" : value})



@app.route('/convertor', methods=['POST'])
def convert():
    #result = "results"
    value = request.json['name']
    mydict['hej'] = str(value)
    return jsonify(mydict)




print(mydict)

class DrawReceiver:
    def __init__(self, your_route):
      self.your_route = your_route
      @app.route(your_route, methods=['POST'])
      
      def jsonConvertor():
        value = request.json['name']
        mydict['hej'] = str(value)
        return jsonify(mydict)

draws = DrawReceiver('/convert')



# Class som tar emot ritade streck, kan skicka ut ritade streck, ta bort gamla streck + test
#farg, tjocklek och position {line : [3,4,5,6,7,8,8,9,0,]}


# funtion som gor om ovan till json

"""
@app.route('/second')
def second_page():
    return 'Second page'
"""