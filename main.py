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
        print(self.drawnLinesData)



draws = DrawReceiver()




@app.route('/convert', methods=['POST'])
def convert():

    info = request.get_json(force=True)
    draws.addLine(info)

    print(info) 
    print (draws.drawnLinesData[0]['color'])  
    print (draws.drawnLinesData[0]['strokeWidth']) 
    print (draws.drawnLinesData[0]['positions'][1]) 
    #color = request.form['color']
    #strokeWidth = request.form['strokeWidth']
    #positions = request.form['positions']
    

    return jsonify(info)





"""@app.route('/hello', methods=['GET', 'POST'])
def hello_world():
    result = "results"
    value = request.args.get('name')
    # stufa om data\
    # kalla pa draws.addLines(stufadData)
    return jsonify({"hej" : value})

"""

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