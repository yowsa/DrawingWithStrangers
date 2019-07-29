from flask import Flask, request, jsonify, json
import copy

app = Flask(__name__)


class LineReceiver:
    
    def __init__(self):
        self.drawnLinesData = []
        self.maxlines = 40
        self.fadeOutLines = 40


    def addLine(self, lineData):
        for lineDict in self.drawnLinesData:
            if lineData["lineNo"] == lineDict["lineNo"]:
                lineDict.update(lineData)
                return

        self.drawnLinesData.append(lineData)

    def deleteOldLines(self):
        if len(self.drawnLinesData) > self.maxlines:
            self.drawnLinesData.pop(0)

    def updateWhiteBalance(self, color, maxcolor, percentage):
        return round(percentage * color + (1-percentage) * maxcolor)


    def updateVisibility(self, newLineData):
        self.newLineData = newLineData
        for index in range(min(self.fadeOutLines, len(self.newLineData))):
            visibility_percentage = float(index + (self.fadeOutLines - len(self.newLineData)) + 1) / self.fadeOutLines
            self.newLineData[index]["strokeStyle"]["r"] = self.updateWhiteBalance(self.newLineData[index]["strokeStyle"]["r"], 255, visibility_percentage)
            self.newLineData[index]["strokeStyle"]["g"] = self.updateWhiteBalance(self.newLineData[index]["strokeStyle"]["g"], 255, visibility_percentage)
            self.newLineData[index]["strokeStyle"]["b"] = self.updateWhiteBalance(self.newLineData[index]["strokeStyle"]["b"], 255, visibility_percentage)
        return self.newLineData


lines = LineReceiver()

@app.route('/convert', methods=['POST'])
def convert():

    lineData = request.get_json()
    lines.addLine(lineData)
    lines.deleteOldLines()
    return jsonify(lineData)



@app.route('/hello', methods=['GET'])
def hello_world():
    newLineData = copy.deepcopy(lines.drawnLinesData)
    return jsonify(lines.updateVisibility(newLineData))


