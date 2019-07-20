from flask import Flask, request, jsonify, json
#from flask import json

app = Flask(__name__)

#draw.addLine
#draw.getLines()
class LineReceiver:
    
    def __init__(self):
        self.drawnLinesData = []

    #{"color":"black","positions":"[5,6]","strokeWidth":"5


    def addLine(self, lineData):
        for lineDict in self.drawnLinesData:
            if lineData["lineNo"] == lineDict["lineNo"]:
                lineDict.update(lineData)
                return

        self.drawnLinesData.append(lineData)


    def getLines(self):
        return self.drawnLinesData




lines = LineReceiver()




@app.route('/convert', methods=['POST'])
def convert():

    info = request.get_json()
    lines.addLine(info)
    return jsonify(info)


@app.route('/linestojs', methods=['GET'])
def linesToJs():

    info = request.get_json()
    lines.getLines(info)

    return jsonify(info)




@app.route('/hello', methods=['GET'])
def hello_world():
    #result = "results"
    #value = request.args.get('name')
    # stufa om data\
    # kalla pa lines.addLines(stufadData)
    return jsonify(lines.getLines())



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