// send new lineData to Python
function sendLineData() {
	$.ajax({
		type: "POST",
		dataType: "json",
		contentType: "application/json",
		url: "/convert",
		data: collectLineData.lineData(),
		success: function(x){
			//console.log(JSON.stringify(x))
			//alert(JSON.stringify(x))
		}
	});

}

// recieve all lineData from Python

function getLineData(callback) {
	$.ajax({
		datatype: "json",
		cache: false,
		url: "/hello",
		success: callback
	});
}

// Handling line features, incease and decrease lineWidth

class LineFeatures {

	constructor(){
		this.strokeStyle = "#ffff00";
		this.lineWidth = 15;
		var that = this;
		document.getElementById("lineWidth").innerText = this.getLineWidth();

		$("#setColor-Yellow").click(function(){
			that.setStrokeStyle('yellow');
		});

		$("#setColor-Black").click(function(){
			that.setStrokeStyle('black');
		});

		$("#setColor-Red").click(function(){
			that.setStrokeStyle('red');
		});

		$("#setColor-Green").click(function(){
			that.setStrokeStyle('green');
		});

		$("#increaseLineWidth").click(function(){
			that.increaseLineWidth();
			document.getElementById("lineWidth").innerText = that.getLineWidth();
		});

		$("#decreaseLineWidth").click(function(){
			that.decreaseLineWidth();
			document.getElementById("lineWidth").innerText = that.getLineWidth();
		});
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

	showStrokeSize(){





	}


}


function setup(){
	var canvasListener = new CanvasListener("mycanvas");
	var lineFeatures = new LineFeatures();
	var drawNewLines = new DrawNewLines("mycanvas", canvasListener, lineFeatures);
	



}





// Drawing new lines upon mouse events

class DrawNewLines {

	constructor(canvasID, canvasListener, lineFeatures){

		this.canvasID = canvasID;
		this.lineFeatures = lineFeatures;
		this.canvas = document.getElementById(this.canvasID);
		this.line = this.canvas.getContext("2d");
		//this.line.lineWidth;
		//this.line.strokeStyle;

		canvasListener.addLineListener(this.newPosInLine.bind(this));
	}

	newPosInLine(e){

		if (e.newLine){
			this.line.lineWidth = this.lineFeatures.getLineWidth();
			this.line.strokeStyle = this.lineFeatures.getStrokeStyle();
			this.line.beginPath();
			this.line.moveTo(e.x, e.y);
		} else {
			this.line.lineTo(e.x, e.y);
			this.line.stroke();
		}


	}

}

class CanvasListener {

	constructor(canvasID){
		this.canvasID = canvasID;
		this.canvas = document.getElementById(this.canvasID);
		this.isMouseDown = false;
		this.positions = [];
		this.callbacks = [];

		this.canvas.addEventListener("mousedown", this.setMouseDown.bind(this));
		this.canvas.addEventListener("mousedown", this.setBeginLinePosition.bind(this));
		this.canvas.addEventListener("mousemove", this.saveCanvasPositions.bind(this));
		document.addEventListener("mouseup", this.setNotMouseDown.bind(this));

	}

	setMouseDown(){
		this.isMouseDown = true;
	}

	setNotMouseDown(){
		this.isMouseDown = false;
	}

	setBeginLinePosition(e) {
		this.positions.push(e.clientX, e.clientY);
		this.sendCallbacks(e.clientX, e.clientY, true);

	}

	sendCallbacks(x, y, newLine){
		this.callbacks.forEach(function(callback){
			callback({
				x : x,
				y : y,
				newLine : newLine,
			});
		});

	}

	checkPixelDifference(posx, posy){
		return Math.abs(this.positions[0] - posx) + Math.abs(this.positions[1] - posy);
	}


	saveCanvasPositions(e){
		if (!this.isMouseDown){
			return;
		}
		if (this.checkPixelDifference(e.clientX, e.clientY) > 100){
			this.positions = [e.clientX, e.clientY];
			this.sendCallbacks(e.clientX, e.clientY, false);


		}

	}

	addLineListener(callback){
		this.callbacks.push(callback);
	}


}









// Collecting lineData to send to backend based on mouse events

class CollectLineData {

	constructor(canvasID){
		this.pos= {x: 0 , y: 0 };
		this.canvasID = canvasID;
		this.canvas = document.getElementById(this.canvasID);

		this.lineWidth = lineFeatures.getLineWidth();
		this.strokeStyle = lineFeatures.getStrokeStyle();
		this.linePositions = [];
		var that = this;


		document.addEventListener("mousemove", this.currentCursorPosition.bind(this));
		
		this.canvas.addEventListener("mousedown", this.addBeginLinePosition.bind(this));
		this.canvas.addEventListener("mousedown", this.addAllPositions.bind(this));

		document.addEventListener("mouseup", this.stopAddingPositions.bind(this));
		document.addEventListener("mouseup", this.lineData.bind(this));
		//////////////////////////////////////////////////////////////
		//TODO: Update the below event sendlinedata to seperate function/class ass this is a colleclinedata class, be aware of the clearLinePositions function
		/*document.addEventListener("mousemove", function(){
			if (that.linePositions.length >= 4){
				sendLineData();
				that.linePositions.shift();
				that.linePositions.shift();
			}
		}); 
		*/
		//////////////////////////////////////////////////////////////
		document.addEventListener("mouseup", this.clearLinePositions.bind(this));
	}

	currentCursorPosition(e){
		this.pos.x = e.clientX;
		this.pos.y = e.clientY;
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
		this.linePositions = [];
	}

}

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



function drawExistingAndNewLines(){}





$(function(){

	setup();

	var drawExistingLines = new DrawExistingLines("mycanvas");


function checkForDrawnLines(){
	function ficesecfunc(){
		getLineData(response => drawExistingLines.drawAllLines(response));
	}
	

	checkForLines = setInterval(ficesecfunc, 1000);
}

checkForDrawnLines();






});






