function setup(){
	var canvasListener = new CanvasListener("mycanvas");
	var colorPicker = new iro.ColorPicker("#color-picker-contrainer", {color: "rgba(200, 255, 112, 1)" });
	var lineFeatures = new LineFeatures(colorPicker);
	var serverTalker = new ServerTalker();
	var lineDataCollector = new LineDataCollector(canvasListener, lineFeatures, serverTalker);
	var lineDrawer = new LineDrawer("mycanvas", lineDataCollector, serverTalker, lineFeatures);


}


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

	constructor(colorPicker){
		this.lineWidth = 15;
		this.colorPicker = colorPicker;
		var that = this;
		document.getElementById("lineWidth").innerText = this.getLineWidth();

		$("#increaseLineWidth").click(function(){
			that.increaseLineWidth();
			document.getElementById("lineWidth").innerText = that.getLineWidth();
		});

		$("#decreaseLineWidth").click(function(){
			that.decreaseLineWidth();
			document.getElementById("lineWidth").innerText = that.getLineWidth();
		});
	}

	rgbConvertor(rgbData){
		//if ("a" in rgbData != true){
		//	rgbData.a = 1.0;
		//}
		var rgbString = "rgba("+rgbData.r+","+rgbData.g+","+rgbData.b+","+rgbData.a+")";
		return rgbString;

	}

	getStrokeStyle(){
		var rgbData = this.colorPicker.color.rgb;
		if ("a" in rgbData != true){
			rgbData.a = 1.0;
		}
		return rgbData;
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
			this.sendCallbacks(e.offsetX, e.offsetY, false);
			this.isMouseDown = false;
		}
	}


	setBeginLinePosition(e) {
		this.positions.push(e.offsetX, e.offsetY);
		this.sendCallbacks(e.offsetX, e.offsetY, true);
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
		if (this.checkPixelDifference(e.offsetX, e.offsetY) > 10){
			this.positions = [e.offsetX, e.offsetY];
			this.sendCallbacks(e.offsetX, e.offsetY, false);
		}
	}

	addLineListener(callback){
		this.callbacks.push(callback);
	}


}

class LineDrawer{

	constructor(canvasID, lineDataCollector, serverTalker, lineFeatures) {
		this.canvasID = canvasID;
		this.lineDataCollector = lineDataCollector;
		this.serverTalker = serverTalker;
		this.lineFeatures = lineFeatures;

		this.canvas = document.getElementById(this.canvasID);
		this.line = this.canvas.getContext("2d");

		setInterval(this.drawAllLines.bind(this), 100);
	}


	drawLine(lineData) {
		this.line.lineWidth = lineData.lineWidth;
		this.line.strokeStyle = this.lineFeatures.rgbConvertor(lineData.strokeStyle);
		this.line.beginPath();
		this.line.moveTo(lineData.positions[0], lineData.positions[1]);
		for (var posPair = 2; posPair < lineData.positions.length; posPair += 2){
			this.line.lineTo(lineData.positions[posPair], lineData.positions[posPair+1]);
		}
		this.line.stroke();

	}


	drawAllLines() {
		var that = this;
		this.line.clearRect(0,0,500, 500);
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
		if (e.newLine){
			this.startNewLine();
		}

		if (this.lineData.positions.length > 22){
			this.lineData.positions.push(e.x, e.y);
			this.serverTalker.sendLineData(this.lineData);
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




