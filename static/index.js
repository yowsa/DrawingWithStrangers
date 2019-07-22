
class ServerTalker{

	constructor() {
		setInterval(this.checkForDrawnLines.bind(this), 100);
		this.allLines = [];
	}

	sendLineData(lineData) {
		$.ajax({
			type: "POST",
			dataType: "json",
			contentType: "application/json",
			url: "/convert",
			data: JSON.stringify(lineData),
			success: function(x){
				//console.log(JSON.stringify(x));
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


	checkForDrawnLines(){
		var that = this;
		this.getLineData(response => that.allLines = response);
	}


	latestDrawnLines() {
		return this.allLines;
	}


}



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
	var serverTalker = new ServerTalker();
	var lineDataCollector = new LineDataCollector(canvasListener, lineFeatures, serverTalker);
	var lineDrawer = new LineDrawer("mycanvas", lineDataCollector, serverTalker)


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

	setNotMouseDown(e){
		if (this.isMouseDown){
			this.sendCallbacks(e.clientX, e.clientY, false);
			this.isMouseDown = false;
		}
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
		if (this.checkPixelDifference(e.clientX, e.clientY) > 10){
			this.positions = [e.clientX, e.clientY];
			this.sendCallbacks(e.clientX, e.clientY, false);
		}
	}

	addLineListener(callback){
		this.callbacks.push(callback);
	}


}

class LineDrawer{

	constructor(canvasID, lineDataCollector, serverTalker) {
		this.canvasID = canvasID;
		this.lineDataCollector = lineDataCollector;
		this.serverTalker = serverTalker;

		this.canvas = document.getElementById(this.canvasID);
		this.line = this.canvas.getContext("2d");

		setInterval(this.drawAllLines.bind(this), 100);
	}


	drawLine(lineData) {
		this.line.lineWidth = lineData.lineWidth;
		this.line.strokeStyle = lineData.strokeStyle;
		this.line.beginPath();
		this.line.moveTo(lineData.positions[0], lineData.positions[1]);
		for (var posPair = 2; posPair < lineData.positions.length; posPair += 2){
			this.line.lineTo(lineData.positions[posPair], lineData.positions[posPair+1]);
		}
		this.line.stroke();

	}


	drawAllLines() {
		var that = this;
		this.line.clearRect(0,0,400, 400);
		this.serverTalker.latestDrawnLines().forEach(function(lineData){
			that.drawLine(lineData);
		});

		this.drawLine(this.lineDataCollector.getLineData());

	}


}



class LineDataCollector {

	constructor(canvasListener, lineFeatures, serverTalker) {
		this.lineFeatures = lineFeatures;
		this.serverTalker = serverTalker;

		this.startNewLine();
		canvasListener.addLineListener(this.lineDataFromCallback.bind(this));
	}

	startNewLine(){
		this.lineData = {};
		this.lineData.lineNo = Math.random();
		this.lineData.strokeStyle = this.lineFeatures.getStrokeStyle();
		this.lineData.lineWidth = this.lineFeatures.getLineWidth();
		this.lineData.positions = [];
	}

	lineDataFromCallback(e){
		if (e.newLine /*|| this.lineData.positions.length > 12*/){
			this.startNewLine();
		}

		this.lineData.positions.push(e.x, e.y);
		this.serverTalker.sendLineData(this.lineData);

	}

	getLineData(){
		return this.lineData;
	}

}




$(function(){

	setup();


});






