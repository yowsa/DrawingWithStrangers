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
			//alert(JSON.stringify(x))
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
			//alert(JSON.stringify(prevDrawnLines))
			//alert(prevDrawnLines[0].length + "hejsan")
			//hej.drawLinePositions()
		}
	})

}



// vissa saker ska laddas efter att html ar laddad

$(function(){



});


// class som sköter line features? typ farg och tjocklek

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
		//Flytta detta sen
		//showStrokeSize();
	}

	decreaseLineWidth(){
		if (this.lineWidth > 1){
			this.lineWidth -= 1;
		}
		//Flytta detta sen
		//showStrokeSize();
	}

	getLineWidth() {
		return this.lineWidth;
	}

	}






// class som skapar nya ritade linjer nar du trycker

class DrawNewLines {

	constructor(canvasID){
		this.pos = {x: 0, y:0};
		this.canvasID = canvasID;
		this.canvas = document.getElementById(this.canvasID);
		this.line = this.canvas.getContext("2d");
		this.line.lineWidth = lineFeatures.getLineWidth();
		this.line.strokeStyle = lineFeatures.getStrokeStyle();
		this.linePositions = []
		
		this.canvas.addEventListener("mousedown", this.getCurrentLineFeatures.bind(this));
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

	getCurrentLineFeatures(){
		this.line.strokeStyle = lineFeatures.getStrokeStyle();
		this.line.lineWidth = lineFeatures.getLineWidth();
		
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

class CollectLineData {

	constructor(canvasID){
		this.pos= {x: 0 , y: 0 }
		this.canvasID = canvasID;
		this.canvas = document.getElementById(this.canvasID);

		this.lineWidth = lineFeatures.getLineWidth();
		this.strokeStyle = lineFeatures.getStrokeStyle();
		this.linePositions = [];
		this.canvas.addEventListener("mousedown", this.getCurrentLineFeatures.bind(this));
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

	getCurrentLineFeatures(){
		this.strokeStyle = lineFeatures.getStrokeStyle();
		this.lineWidth = lineFeatures.getLineWidth();
		
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

		document.getElementById("lineWidth").innerText = lineFeatures.getLineWidth();

	}
// class som ritar ut tidigare ritade linjer
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
			//alert(JSON.stringify(prevDrawnLines))
			//alert(prevDrawnLines[0].length + "hejsan")
			//hej.drawLinePositions()
		}
	})


/*
	document.addEventListener("mouseup", input.lineData.bind(input));
	document.addEventListener("mouseup", sendLineData);
	//document.addEventListener("mouseup", input.finishDrawing.bind(input));
	*/

	lineFeatures = new LineFeatures();
	drawNewLines = new DrawNewLines('mycanvas');
	sendLineData = new CollectLineData('mycanvas');



	showStrokeSize();


///////////////////////////////////////////////////////////////////
/// Button functionality in HTML
/// ///////////////////////////////////////////////////////////////

	$("#testbutton").click(function() { alert("hej!") })
	
	$("#setColor-Black").click(function(){
		lineFeatures.setStrokeStyle('black');
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






