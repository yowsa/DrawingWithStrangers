from flask import Flask, request, jsonify, json
#from flask import json

app = Flask(__name__)

#draw.addLine
#draw.getLines()
drawnLinesData = []

@app.route('/hello', methods=['GET', 'POST'])
def hello_world():
    result = "results"
    value = request.args.get('name')
    # stufa om data\
    # kalla pa draws.addLines(stufadData)
    return jsonify({"hej" : value})



@app.route('/convert', methods=['POST'])
def convert():

    info = request.get_json(force=True)
    draws.addLine(info)

    print(info) 
    print (drawnLinesData[0]['color'])  
    print (drawnLinesData[0]['strokeWidth'])  
    #color = request.form['color']
    #strokeWidth = request.form['strokeWidth']
    #positions = request.form['positions']
    

    return jsonify(info)



#lineData = {'lineNumber' : [width, color, {positions :[pos.x, pos.y, pos.x, pos,y, pos.x, pos.y]}]}

"""
lista med dicts:
{
  width: 5,
  color: "red",
  positions{x, y, x, y]
}
"""


class DrawReceiver:

    #def __init__(self):
        
       # self.drawnLinesData = drawnLinesData


    #{"color":"black","positions":"[5,6]","strokeWidth":"5"}

    def addLine(self, info):
        drawnLinesData.append(info)
        print(drawnLinesData)



draws = DrawReceiver()


# Class som tar emot ritade streck, kan skicka ut ritade streck, ta bort gamla streck + test
#farg, tjocklek och position {line : [3,4,5,6,7,8,8,9,0,]}


# funtion som gor om ovan till json

"""
@app.route('/second')
def second_page():
    return 'Second page'
"""