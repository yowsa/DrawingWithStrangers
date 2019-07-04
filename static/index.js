// lista med alla ritade linjer

var prevDrawnLines = []

// en function som skickar data till python
function sendLineData() {
	$.ajax({
		type: "POST",
		dataType: "json",
		contentType: "application/json",
		url: "/convert",
		data: sendLineData.lineData(),
		success: function(x){
			alert(JSON.stringify(x))
		}
	})

}

// en function som tar emot data fran python

function getLineData() {
	$.ajax({
		datatype: "json",
		url: "/hello",
		success: function(x){
			prevDrawnLines.push(x)
			alert(JSON.stringify(prevDrawnLines))
			alert(prevDrawnLines[0].length + "hejsan")
			hej.drawLinePositions()
		}
	})

}



// vissa saker ska laddas efter att html ar laddad

$(function(){});



// class som ritar ut tidigare ritade linjer

class drawPrevDrawnLines {

	constructor(){

	}

	lineData(){

	}

	startDrawing(){


	}

	drawAllPositions(){

	}

}

// class som sköter line features? typ farg och tjocklek

class lineFeatures {

	showStrokeSize(){

	}

	setLineColor(){

	}

	increaseStrokeWidth(){

	}

	decreaseStrokeWidth(){

	}
}






// class som skapar nya ritade linjer nar du trycker

class drawNewLines {


	constructor(canvasID){
		this.pos = {x: 0, y:0};
		this.canvasID = canvasID;
		this.canvas = document.getElementById(this.canvasID);
		this.line = this.canvas.getContext("2d");
		this.line.lineWidth = 5;
		this.line.strokeStyle = "#ff0000";
		this.linePositions = []

		this.canvas.addEventListener("mousemove", this.currentCursorPosition.bind(this));
		this.canvas.addEventListener("mousedown", this.setBeginLinePosition.bind(this));
		this.canvas.addEventListener("mousedown", this.startDrawing.bind(this));
		document.addEventListener("mouseup", this.finishDrawing.bind(this));
	}

	currentCursorPosition(e){
		this.e = e
		this.pos.x = this.e.clientX;
		this.pos.y = this.e.clientY;

	}
/*
	lineData(){
		var lineData = JSON.stringify({"strokeStyle" : this.line.strokeStyle, "lineWidth" : this.line.lineWidth, 'positions' : this.linePositions})
		return lineData
	}
	*/
	setBeginLinePosition() {
		this.line.beginPath();
		this.line.moveTo(this.pos.x, this.pos.y);
		//this.linePositions.push(this.pos.x, this.pos.y);
		return this.pos.x, this.pos.y

	}

	startDrawing(){
		this.drawingLines = setInterval(this.drawAllPositions.bind(this), 1000);

	}

	drawAllPositions(){
		this.line.lineTo(this.pos.x, this.pos.y);
		this.line.stroke();

		//this.linePositions.push(this.pos.x, this.pos.y);

	}

	finishDrawing(){
		clearInterval(this.drawingLines);
		//this.linePositions = [];

	}




}

// class som samlar lineData

class collectLineData {

	constructor(canvasID){
		this.pos= {x: 0 , y: 0 }
		this.canvasID = canvasID;
		this.canvas = document.getElementById(this.canvasID);

		this.lineWidth = 7;
		this.strokeStyle = "#000000";
		this.linePositions = [];
		this.canvas.addEventListener("mousemove", this.currentCursorPosition.bind(this));
		this.canvas.addEventListener("mousedown", this.addBeginLinePosition.bind(this));
		this.canvas.addEventListener("mousedown", this.addAllPositions.bind(this));
		document.addEventListener("mouseup", this.stopAddingPositions.bind(this));
		document.addEventListener("mouseup", this.lineData.bind(this));
		//////////////////////////////////////////////////////////////
		//TODO: Update the below event sendlinedata to seperate function/class ass this is a colleclinedata class, be aware of the clearLinePositions function
		document.addEventListener("mouseup", sendLineData); 
		//////////////////////////////////////////////////////////////
		document.addEventListener("mouseup", this.clearLinePositions.bind(this));
	}

	currentCursorPosition(e){
		this.e = e
		this.pos.x = this.e.clientX;
		this.pos.y = this.e.clientY;

	}

	
	addBeginLinePosition(){
		this.linePositions.push(this.pos.x, this.pos.y);

	}

	addAllPositions(){
		this.allPositions = setInterval(this.pushLinePositions.bind(this), 1000)


	}

	pushLinePositions(){
		this.linePositions.push(this.pos.x, this.pos.y);
	}

	stopAddingPositions(){
		clearInterval(this.allPositions);
	}

	lineData() {
		var lineData = JSON.stringify({"strokeStyle" : this.strokeStyle, "lineWidth" : this.lineWidth, 'positions' : this.linePositions})
		return lineData
	}

	clearLinePositions(){
		this.linePositions = []
	}

}



//////////////////////////////////////////////////////////////////////////


$(function(){


	function showStrokeSize() {
		document.getElementById("strokeSize").innerText = drawNewLines.line.lineWidth

	}

	class DrawExistingLines {

		constructor(canvasID, strokeStyle, width, pos){
			this.pos = pos;

			this.canvasID = canvasID;
			this.canvas = document.getElementById(this.canvasID);
			this.line = this.canvas.getContext("2d");
			this.line.lineWidth = width
			this.line.strokeStyle = strokeStyle

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
			prevDrawnLines[0].forEach(function(x){
				for (var i in x){
					that.line.lineWidth = x["lineWidth"]
					that.line.strokeStyle = x["strokeStyle"]
					//alert(i + x["lineWidth"])
				}
			})
/*
			for(var i = 0 ; i < this.myLine.length ; i += 2) {
				alert(i)
			}
			*/
		}

	}




	//var hej = new DrawExistingLines("mycanvas", "green", 5, [200, 300, 400, 500])
	//hej.start()

	//hej.aLine()
	//hej.drawLinePositions()

	//getLineData()

	$.ajax({
		datatype: "json",
		url: "/hello",
		success: function(x){
			prevDrawnLines.push(x)
			alert(JSON.stringify(prevDrawnLines))
			alert(prevDrawnLines[0].length + "hejsan")
			//hej.drawLinePositions()
		}
	})

	class CanvasInput {

		setCursorPosition(e) {
			this.e = e;
			this.pos.x = this.e.clientX;
			this.pos.y = this.e.clientY;
		}

		constructor(canvasID){
			this.pos = {x: 0, y:0};
			this.canvasID = canvasID;
			this.canvas = document.getElementById(this.canvasID);
			this.line = this.canvas.getContext("2d");
			this.line.lineWidth = 5;
			this.line.strokeStyle = "#ff0000";

			this.linePositions = []

			this.canvas.addEventListener("mousemove", this.setCursorPosition.bind(this));
			this.canvas.addEventListener("mousedown", this.setBeginLinePosition.bind(this));
			this.canvas.addEventListener("mousedown", this.startDrawing.bind(this));
			document.addEventListener("mouseup", this.finishDrawing.bind(this));

		}

		lineData(){
			var lineData = JSON.stringify({"strokeStyle" : this.line.strokeStyle, "lineWidth" : this.line.lineWidth, 'positions' : this.linePositions})
			return lineData
		}

		lineColor(strokeStyle) {
			this.strokeStyle = strokeStyle;
			this.line.strokeStyle = this.strokeStyle;
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
			//this.linePositions = [];
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
/*
	input = new CanvasInput("mycanvas");



	//input.canvas.addEventListener("mousemove", input.setCursorPosition.bind(input));
	//input.canvas.addEventListener("mousedown", input.setBeginLinePosition.bind(input));
	//input.canvas.addEventListener("mousedown", input.startDrawing.bind(input));
	document.addEventListener("mouseup", input.lineData.bind(input));
	document.addEventListener("mouseup", sendLineData);
	//document.addEventListener("mouseup", input.finishDrawing.bind(input));

	*/

	drawNewLines = new drawNewLines('mycanvas');
	sendLineData = new collectLineData('mycanvas');



	showStrokeSize();


});






