
class ServerTalker{

	constructor(lineDataCollector){



	}

	sendLineData(lineData) {
		$.ajax({
			type: "POST",
			dataType: "json",
			contentType: "application/json",
			url: "/convert",
			data: JSON.stringify(lineData),
			success: function(x){
				console.log(JSON.stringify(x))
			//alert(JSON.stringify(x))
		}
	});

	}

	getLineData(callback) {
		$.ajax({
			datatype: "json",
			cache: false,
			url: "/hello",
			success: callback
		});
	}


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

}


function setup(){
	var canvasListener = new CanvasListener("mycanvas");
	var lineFeatures = new LineFeatures();
	var drawNewLines = new DrawNewLines("mycanvas", canvasListener, lineFeatures);
	var serverTalker = new ServerTalker();
	var lineDataCollector = new LineDataCollector(canvasListener, lineFeatures, serverTalker);


}



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



class LineDataCollector {

	constructor(canvasListener, lineFeatures, serverTalker){
		this.lineFeatures = lineFeatures;
		this.serverTalker = serverTalker;
		this.lineData = {"lineNo" : "", "strokeStyle" : "", "lineWidth" : "", 'positions' : []};
		var that = this;
		canvasListener.addLineListener(this.lineDataFromCallback.bind(this));
	}

	lineDataFromCallback(e){
		if (e.newLine){
			this.lineData.lineNo = Math.random();
			this.lineData.strokeStyle = this.lineFeatures.getStrokeStyle();
			this.lineData.lineWidth = this.lineFeatures.getLineWidth();
			this.lineData.positions = [e.x, e.y];
		} else {
			this.lineData.positions.push(e.x, e.y);
			this.serverTalker.sendLineData(this.lineData);
		}

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

/*
	function checkForDrawnLines(){
		function ficesecfunc(){
			getLineData(response => drawExistingLines.drawAllLines(response));
		}


		checkForLines = setInterval(ficesecfunc, 1000);
	}

	checkForDrawnLines();

	*/





});






