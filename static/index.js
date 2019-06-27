

/*
var color = 'black'
var strokeWidth = 5
var positions = [5,6]
var info = {"color": color, "strokeWidth" : strokeWidth, 'positions' : positions}
var infos = JSON.stringify({"color" : color, "strokeWidth" : strokeWidth, 'positions' : positions})
*/
var linesDrawn = []



function sendPosition() {
	$.ajax({
		type: "POST",
		dataType: "json",
		contentType: "application/json",

		url: "/convert",
		data: input.lineInfo(),
		success: function(x){
			alert(JSON.stringify(x))
		}
	})

}

//sendPosition()

/*
function drawnLines() {

	linesDrawn.forEach(function(line){
		console.log(line);
	});
}
*/


$(function(){

	function showStrokeSize() {
		document.getElementById("strokeSize").innerText = input.line.lineWidth

	}

	class DrawExistingLines {

		constructor(canvasID, color, width, pos){
			this.pos = pos;

			this.canvasID = canvasID;
			this.canvas = document.getElementById(this.canvasID);
			this.line = this.canvas.getContext("2d");
			this.line.lineWidth = width
			this.line.strokeStyle = color

			this.myLine = [0,1,2,3,4,5,6,7,8]
		}


		start(){
			this.line.beginPath();
			this.line.moveTo(this.pos[0], this.pos[1]);

		}

		aLine(){
			this.line.lineTo((this.pos[0]+50), (this.pos[1]+50));
			this.line.stroke();

		}

		drawLinePositions(){
			//  this.pos.forEach(function(){
			//	return this.aLine()
			var that = this;
			linesDrawn[0].forEach(function(x){
				for (var i in x){
					that.line.lineWidth = x["strokeWidth"]
					alert(i + x["strokeWidth"])
				}
			})
/*
			for(var i = 0 ; i < this.myLine.length ; i += 2) {
				alert(i)
			}
			*/

			//  this.pos.forEach(function(){
			//	return this.aLine()
		}

	}




	var hej = new DrawExistingLines("mycanvas", "green", 5, [200, 300, 400, 500])
	hej.start()

	hej.aLine()
	//hej.drawLinePositions()

	$.ajax({
		datatype: "json",
		url: "/hello",
	//data: {"name" : "josefin"},
	    success: function(x){
		linesDrawn.push(x)
		alert(JSON.stringify(linesDrawn))
		//drawnLines();
		alert(linesDrawn[0].length + "hejsan")
		hej.drawLinePositions()
	}
})


//{widh:5, color:blue, position;[5,6,7,7,5,4,4{3;4},{5:7}]}


// class som ritar
class CanvasInput {

	pos = {x: 0, y:0};

	setCursorPosition(e) {
		this.e = e
		this.pos.x = this.e.clientX;
		this.pos.y = this.e.clientY;
	}

	constructor(canvasID){
		this.canvasID = canvasID;
		this.canvas = document.getElementById(this.canvasID);
		this.line = this.canvas.getContext("2d");
		this.line.lineWidth = 5;
		this.line.strokeStyle = "#ff0000";

		this.linePositions = []
	}

	lineInfo(){
		var lineInfo = JSON.stringify({"color" : this.line.strokeStyle, "strokeWidth" : this.line.lineWidth, 'positions' : this.linePositions})
		return lineInfo
	}

	lineColor(color) {
		this.color = color;
		this.line.strokeStyle = this.color;
	}

	increaseStroke() {
		if (this.line.lineWidth < 20){
			this.line.lineWidth += 1
		} 
		showStrokeSize();
	}

	decreaseStroke() {
		if (this.line.lineWidth > 1){
			this.line.lineWidth -= 1
		}
		showStrokeSize();
	}


	setBeginLinePosition() {
		this.line.beginPath();
		this.line.moveTo(this.pos.x, this.pos.y);
		this.linePositions = [];
		this.linePositions.push(this.pos.x, this.pos.y);

	}

	drawLine(){
		this.line.lineTo(this.pos.x, this.pos.y);
		this.line.stroke();
		this.linePositions.push(this.pos.x, this.pos.y);
	}

	startDrawing(){
		this.myvar = setInterval(this.drawLine.bind(this), 1000);
	}

	finishDrawing(){
		clearInterval(this.myvar);
		this.linePositions = [];
	}


}


class ServerTalker {

	lineCompleted() {

	}

}

input = new CanvasInput("mycanvas");
showStrokeSize();


input.canvas.addEventListener("mousemove", input.setCursorPosition.bind(input));
input.canvas.addEventListener("mousedown", input.setBeginLinePosition.bind(input));
input.canvas.addEventListener("mousedown", input.startDrawing.bind(input));
document.addEventListener("mouseup", input.lineInfo.bind(input));
document.addEventListener("mouseup", sendPosition);
document.addEventListener("mouseup", input.finishDrawing.bind(input));





});

// class som skickar och tar emot info från backend




