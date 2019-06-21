

$.ajax({
	datatype: "json",
	url: "/hello",
	data: {"name" : "josefin"},
	success: function(x){
		alert(JSON.stringify(x))
	}
})


function sendPosition() {
	$.ajax({
	datatype: "json",
	url: "/hello",
	data: {"name" : "josefin"},
	success: function(x){
		alert(JSON.stringify(x))
	}
})

}


$(function(){

    function showStrokeSize() {
        document.getElementById("strokeSize").innerText = input.line.lineWidth

    }


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
        this.canvasID = canvasID
        this.canvas = document.getElementById(this.canvasID);
        this.line = this.canvas.getContext("2d");
        this.line.lineWidth = 5;
        this.line.strokeStyle = "#ff0000"
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

    }

    drawLine(){
        this.line.lineTo(this.pos.x, this.pos.y);
        this.line.stroke();
    }

    startDrawing(){
        this.myvar = setInterval(this.drawLine.bind(this), 1000);
    }

    finishDrawing(){
        clearInterval(this.myvar);
    }

/*
    this.canvas.addEventListener("mousemove", setCursorPosition);
    this.canvas.addEventListener("mousedown", setBeginLinePosition);
    this.canvas.addEventListener("mousedown", startDrawing);
    this.canvas.addEventListener("mouseup", input.finishDrawing);
*/

}

input = new CanvasInput("mycanvas");
showStrokeSize();


document.addEventListener("mousemove", input.setCursorPosition.bind(input));
document.addEventListener("mousedown", input.setBeginLinePosition.bind(input));
document.addEventListener("mousedown", input.startDrawing.bind(input));
document.addEventListener("mouseup", input.finishDrawing.bind(input));



class ServerTalker {

    lineCompleted() {

    }

}


});

// class som skickar och tar emot info från backend




 