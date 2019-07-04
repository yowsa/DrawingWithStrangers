from flask import Flask, request, jsonify, json
#from flask import json

app = Flask(__name__)

#draw.addLine
#draw.getLines()
class DrawReceiver:
    
    def __init__(self):
        self.drawnLinesData = []

    #{"color":"black","positions":"[5,6]","strokeWidth":"5"}

    def addLine(self, info):
        self.drawnLinesData.append(info)


    def getLines(self):
        return self.drawnLinesData




draws = DrawReceiver()




@app.route('/convert', methods=['POST'])
def convert():

    info = request.get_json()
    draws.addLine(info)

    print(info) 
    print (info['strokeStyle'])  
    print (info['lineWidth']) 
    print (info['positions']) 
    print(draws.drawnLinesData)
    
    return jsonify(info)


@app.route('/linestojs', methods=['GET'])
def linesToJs():

    info = request.get_json()
    draws.getLines(info)

    return jsonify(info)




@app.route('/hello', methods=['GET'])
def hello_world():
    #result = "results"
    #value = request.args.get('name')
    # stufa om data\
    # kalla pa draws.addLines(stufadData)
    return jsonify(draws.getLines())



"""
lista med dicts:
{
  width: 5,
  color: "red",
  positions{x, y, x, y]
}
"""




# Class som tar emot ritade streck, kan skicka ut ritade streck, ta bort gamla streck + test


# funtion som gor om ovan till json