from flask import Flask, request, jsonify, json
from flask_socketio import SocketIO, send
import eventlet
import copy
import ast


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!' 

class LineReceiver:
    
    def __init__(self, maxlines, fadeOutLines):
        self.drawnLinesData = []
        self.maxlines = maxlines
        self.fadeOutLines = fadeOutLines


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

    def updateVisibility(self):
        newLineData = copy.deepcopy(self.drawnLinesData)
        for index in range(len(newLineData)):
            adjustedIndex = index + (self.maxlines - len(newLineData))

            if adjustedIndex >= self.fadeOutLines:
                break

            strokeStyle = newLineData[index]["strokeStyle"]
            visibility_percentage = float(adjustedIndex + 1)/ (self.fadeOutLines + 1)
            updatedColors = {k:self.updateWhiteBalance(strokeStyle[k], 255, visibility_percentage) for k, v in strokeStyle.iteritems()}
            strokeStyle.update(updatedColors)
        return newLineData

lines = LineReceiver(100, 40)

@app.route('/convert', methods=['POST'])
def convert():

    lineData = request.get_json()
    #print type(lineData)
    lines.addLine(lineData)
    lines.deleteOldLines()
    return jsonify(lineData)



@app.route('/hello', methods=['GET'])
def hello_world():
    return jsonify(lines.updateVisibility())


socketio = SocketIO(app)

testList = []

#@socketio.on('message')
#def handle_message(lineData):
    #lines.addLine(lineData)
    #lines.deleteOldLines()
    #send(jsonify(lines.updateVisibility()), broadcast=True)
#    print 'hejsan'


#@socketio.on('json')
#def handle_json(json):
#    dictData = ast.literal_eval(json)
#    print type(dictData)


@socketio.on('connect')
def handle_connect():
    allLines = lines.updateVisibility()
    send(allLines, broadcast=True)

@socketio.on('lineData handler')
def handle_lineData(json):
    lineData = ast.literal_eval(json)
    lines.addLine(lineData)
    lines.deleteOldLines()
    #lines.updateVisibility()
    allLines = lines.updateVisibility()
    send(allLines, broadcast=True)



if __name__ == '__main__':
    socketio.run(app)


