from flask import Flask, request, jsonify, json
#from flask import json

app = Flask(__name__)


class LineReceiver:
    
    def __init__(self):
        self.drawnLinesData = []


    def addLine(self, lineData):
        for lineDict in self.drawnLinesData:
            if lineData["lineNo"] == lineDict["lineNo"]:
                lineDict.update(lineData)
                return

        self.drawnLinesData.append(lineData)


    def getLines(self):
        return self.drawnLinesData

    def deleteOldLines(self):
        if len(self.drawnLinesData) > 10:
            self.drawnLinesData.pop(0)


lines = LineReceiver()

@app.route('/convert', methods=['POST'])
def convert():

    lineData = request.get_json()
    lines.addLine(lineData)
    lines.deleteOldLines()
    return jsonify(lineData)



@app.route('/hello', methods=['GET'])
def hello_world():
    return jsonify(lines.getLines())


