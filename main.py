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
        for index in range(min(self.maxlines, len(self.drawnLinesData))):
            self.adjustedindex = index+1
            if len(self.drawnLinesData) < self.maxlines:
                self.adjustedindex = index + 1 + self.maxlines - len(self.drawnLinesData)
            self.drawnLinesData[index]["strokeStyle"]["a"] = float(self.adjustedindex)/float(self.maxlines)


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


