from flask import Flask, request, jsonify, json
#from flask import json

app = Flask(__name__)


class LineReceiver:
    
    def __init__(self):
        self.drawnLinesData = []
        self.maxlines = 40


    def addLine(self, lineData):
        for lineDict in self.drawnLinesData:
            if lineData["lineNo"] == lineDict["lineNo"]:
                lineDict.update(lineData)
                return

        self.drawnLinesData.append(lineData)


    def getLines(self):
        return self.drawnLinesData

    def deleteOldLines(self):
        if len(self.drawnLinesData) > self.maxlines:
            self.drawnLinesData.pop(0)

    def updateLineOpacity(self):
        if len(self.drawnLinesData) == self.maxlines:
            for lineDict in self.drawnLinesData:
                if self.drawnLinesData.index(lineDict) < 5:
                    lineDict["strokeStyle"]["a"] = 0.1

                if self.drawnLinesData.index(lineDict) >= 5 and self.drawnLinesData.index(lineDict) < 10:
                    lineDict["strokeStyle"]["a"] = 0.3

                if self.drawnLinesData.index(lineDict) >= 10 and self.drawnLinesData.index(lineDict) < 15:
                    lineDict["strokeStyle"]["a"] = 0.4

                if self.drawnLinesData.index(lineDict) >= 15 and self.drawnLinesData.index(lineDict) < 20:
                    lineDict["strokeStyle"]["a"] = 0.6

                if self.drawnLinesData.index(lineDict) >= 20 and self.drawnLinesData.index(lineDict) < 25:
                    lineDict["strokeStyle"]["a"] = 0.8




lines = LineReceiver()

@app.route('/convert', methods=['POST'])
def convert():

    lineData = request.get_json()
    lines.addLine(lineData)
    lines.deleteOldLines()
    lines.updateLineOpacity()
    return jsonify(lineData)



@app.route('/hello', methods=['GET'])
def hello_world():
    return jsonify(lines.getLines())


