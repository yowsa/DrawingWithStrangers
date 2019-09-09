function setup(){
	var canvasListener = new CanvasListener("mycanvas");
	var colorPicker = new iro.ColorPicker("#color-picker-contrainer", {
		color: "rgb(200, 255, 112)",
		borderWidth: 0,
		width: 200,
	});
	var lineFeatures = new LineFeatures(colorPicker);
	var socket = io();
	var serverTalker = new ServerTalker(socket);
	var lineDataCollector = new LineDataCollector(canvasListener, lineFeatures, serverTalker);
	var lineDrawer = new LineDrawer("mycanvas", lineDataCollector, serverTalker, lineFeatures);
	isMobile();

}

function isMobile(){
	var isMobile = navigator.userAgent.match(
        /(iPhone|iPod|iPad|Android|webOS|BlackBerry|IEMobile|Opera Mini)/i);
	if (isMobile){
		alert('Mobile devices are not supported.');
	}
}


class ServerTalker{

	constructor(socket) {
		this.socket = socket;
		this.allLines = [];
		var that = this;

		socket.on('message', function(data){
			if (data.action == "allLines"){
				that.allLines = data.data;
				return that.allLines;
			}
			if (data.action == "counter"){
				that.updateStrangerCount(data.data);
			}
		});
	}

	updateStrangerCount(connections){
		var connectionMessage = "";
		if (connections > 1){
			connectionMessage = connections + " strangers connected";
		} else {
			connectionMessage = "You are drawing alone"
		}
		$("#strangers").html(connectionMessage);
	}

	WSsendLineData(lineData){
		var jsonData = JSON.stringify(lineData);
		this.socket.emit('lineData handler', jsonData);
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
		var rgbString = "rgb("+rgbData.r+","+rgbData.g+","+rgbData.b+")";
		return rgbString;

	}

	getStrokeStyle(){
		return this.colorPicker.color.rgb;
	}

	increaseLineWidth(){
		if (this.lineWidth < 30){
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
		if (this.checkPixelDifference(e.offsetX, e.offsetY) > 20){
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
		this.line.clearRect(0,0,1000, 600);
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
			this.serverTalker.WSsendLineData(this.lineData);
			var lastTwoPos = {x: this.lineData.positions[this.lineData.positions.length -4], y: this.lineData.positions[this.lineData.positions.length -3]};
			this.startNewLine();
			this.lineData.positions.push(lastTwoPos.x, lastTwoPos.y);
		}

		this.lineData.positions.push(e.x, e.y);
		this.serverTalker.WSsendLineData(this.lineData);
	}

	getLineData(){
		return this.lineData;
	}
}




$(function(){

	setup();


	


});




