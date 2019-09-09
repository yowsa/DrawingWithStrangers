from flask import Flask, request, jsonify, json, current_app
from flask_socketio import SocketIO, send
import eventlet
import copy
import ast


application = Flask(__name__)
application.config['SECRET_KEY'] = 'secret!' 

@application.route('/')
def hello_world():
    return current_app.send_static_file('index.html')


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


class ConnectCounter:
    def __init__(self):
        self.connectCounter = 0

    def increaseCounter(self):
        self.connectCounter += 1
        return self.connectCounter

    def decreaseCounter(self):
        self.connectCounter -= 1
        return self.connectCounter


class MessageHandler:

    def sendMessage(self, data, type):
        actionDict = {"data": data, "action" : type}
        return actionDict



lines = LineReceiver(80, 40)
counter = ConnectCounter()
messageHandler = MessageHandler()

socketio = SocketIO(application)



@socketio.on('connect')
def handle_connect():
    send(messageHandler.sendMessage(lines.updateVisibility(), "allLines"), broadcast=True)
    send(messageHandler.sendMessage(counter.increaseCounter(), "counter"), broadcast=True)


@socketio.on('disconnect')
def handle_connect():
    send(messageHandler.sendMessage(counter.decreaseCounter(), "counter"), broadcast=True)


@socketio.on('lineData handler')
def handle_lineData(json):
    #receive linedata
    lineData = ast.literal_eval(json)
    lines.addLine(lineData)
    lines.deleteOldLines()
    #send linedata
    send(messageHandler.sendMessage(lines.updateVisibility(), "allLines"), broadcast=True)


if __name__ == '__main__':
    socketio.run(application)
    #application.run()
#, host="0.0.0.0"

