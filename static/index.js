// send new lineData to Python
function sendLineData() {
	$.ajax({
		type: "POST",
		dataType: "json",
		contentType: "application/json",
		url: "/convert",
		data: collectLineData.lineData(),
		success: function(x){
			//alert(JSON.stringify(x))
		}
	})

}

// recieve all lineData from Python

function getLineData(callback) {
	$.ajax({
		datatype: "json",
		url: "/hello",
		success: callback
	})
}

// Handling line features, incease and decrease lineWidth

class LineFeatures {

	constructor(){
		this.strokeStyle = "#ffff00";
		this.lineWidth = 5;
	}

	setStrokeStyle(strokeStyle){
		this.strokeStyle = strokeStyle;
	}

	getStrokeStyle(){
		return this.strokeStyle;
	}

	increaseLineWidth(){
		if (this.lineWidth < 20){
			this.lineWidth += 1;
		}
	}

	decreaseLineWidth(){
		if (this.lineWidth > 1){
			this.lineWidth -= 1;
		}
	}

	getLineWidth() {
		return this.lineWidth;
	}

}


// Drawing new lines upon mouse events

class DrawNewLines {

	constructor(canvasID){
		this.pos = {x: 0, y:0};
		this.canvasID = canvasID;
		this.canvas = document.getElementById(this.canvasID);
		this.line = this.canvas.getContext("2d");
		this.line.lineWidth = lineFeatures.getLineWidth();
		this.line.strokeStyle = lineFeatures.getStrokeStyle();
		
		this.canvas.addEventListener("mousedown", this.getCurrentLineFeatures.bind(this));
		document.addEventListener("mousemove", this.currentCursorPosition.bind(this));
		this.canvas.addEventListener("mousedown", this.setBeginLinePosition.bind(this));
		this.canvas.addEventListener("mousedown", this.startDrawing.bind(this));
		document.addEventListener("mouseup", this.finishDrawing.bind(this));
	}

	currentCursorPosition(e){
		this.pos.x = e.clientX;
		this.pos.y = e.clientY;
	}

	setBeginLinePosition() {
		this.line.beginPath();
		this.line.moveTo(this.pos.x, this.pos.y);
	}

	getCurrentLineFeatures(){
		this.line.strokeStyle = lineFeatures.getStrokeStyle();
		this.line.lineWidth = lineFeatures.getLineWidth();
		
	}

	startDrawing(){
		this.drawingLines = setInterval(this.drawAllPositions.bind(this), 100);
	}

	drawAllPositions(){
		this.line.lineTo(this.pos.x, this.pos.y);
		this.line.stroke();
	}

	finishDrawing(){
		clearInterval(this.drawingLines);

	}

}

// Collecting lineData to send to backend based on mouse events

class CollectLineData {

	constructor(canvasID){
		this.pos= {x: 0 , y: 0 }
		this.canvasID = canvasID;
		this.canvas = document.getElementById(this.canvasID);

		this.lineWidth = lineFeatures.getLineWidth();
		this.strokeStyle = lineFeatures.getStrokeStyle();
		this.linePositions = [];
		var that = this;


		document.addEventListener("mousemove", this.currentCursorPosition.bind(this));
		this.canvas.addEventListener("mousedown", this.getCurrentLineFeatures.bind(this));
		this.canvas.addEventListener("mousedown", this.addBeginLinePosition.bind(this));
		this.canvas.addEventListener("mousedown", this.addAllPositions.bind(this));

		document.addEventListener("mouseup", this.stopAddingPositions.bind(this));
		document.addEventListener("mouseup", this.lineData.bind(this));
		//////////////////////////////////////////////////////////////
		//TODO: Update the below event sendlinedata to seperate function/class ass this is a colleclinedata class, be aware of the clearLinePositions function
		document.addEventListener("mouseup", function(){
			if (that.linePositions.length >= 4){
				sendLineData();
			}
		}); 
		
		//////////////////////////////////////////////////////////////
		document.addEventListener("mouseup", this.clearLinePositions.bind(this));
	}

	currentCursorPosition(e){
		this.pos.x = e.clientX;
		this.pos.y = e.clientY;
	}

	getCurrentLineFeatures(){
		this.strokeStyle = lineFeatures.getStrokeStyle();
		this.lineWidth = lineFeatures.getLineWidth();
	}


	addBeginLinePosition(){
		this.linePositions.push(this.pos.x, this.pos.y);
	}

	addAllPositions(){
		this.allPositions = setInterval(this.pushLinePositions.bind(this), 100)
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



// Drawing existing lines recieved from backend

class DrawExistingLines {

	constructor(canvasID){
		this.canvasID = canvasID;
		this.canvas = document.getElementById(this.canvasID);
		this.line = this.canvas.getContext("2d");
		this.line.lineWidth;
		this.line.strokeStyle;
	}


	start(lineData){
		this.line.beginPath();
		this.line.moveTo(lineData["positions"][0], lineData["positions"][1]);

	}

	getLineFeatures(lineData){
		this.line.lineWidth = lineData["lineWidth"];
		this.line.strokeStyle = lineData["strokeStyle"];

	}

	drawLinePositions(lineData){
		for (var pos = 2 ; pos < lineData["positions"].length ; pos += 2){
			this.line.lineTo(lineData["positions"][pos], lineData["positions"][pos+1]);
			this.line.stroke();
		}
	}

	drawAllLines(allLines){
		var that = this;
		allLines.forEach(function(x){
			that.getLineFeatures(x);
			that.start(x);
			that.drawLinePositions(x);
		})


	}

}


var drawExistingLines = new DrawExistingLines("mycanvas")
getLineData(response => drawExistingLines.drawAllLines(response))


lineFeatures = new LineFeatures();
var drawNewLines = new DrawNewLines('mycanvas');
collectLineData = new CollectLineData('mycanvas');



showStrokeSize();


///////////////////////////////////////////////////////////////////
/// Button functionality and visuals in HTML
/// ///////////////////////////////////////////////////////////////

function showStrokeSize() {
	document.getElementById("lineWidth").innerText = lineFeatures.getLineWidth();
}


$("#setColor-Yellow").click(function(){
	lineFeatures.setStrokeStyle('yellow');
});

$("#setColor-Black").click(function(){
	lineFeatures.setStrokeStyle('black');
});

$("#setColor-Red").click(function(){
	lineFeatures.setStrokeStyle('red');
});

$("#setColor-Green").click(function(){
	lineFeatures.setStrokeStyle('green');
});


$("#increaseLineWidth").click(function(){
	lineFeatures.increaseLineWidth();
	showStrokeSize();
});

$("#decreaseLineWidth").click(function(){
	lineFeatures.decreaseLineWidth();
	showStrokeSize();
});


});






