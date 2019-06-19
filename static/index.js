


$.ajax({
	datatype: "json",
	url: "/hello",
	data: {"name" : "josefin"},
	success: function(x){
		alert(JSON.stringify(x))
	}
})




   let screenLog = document.querySelector('#screen-log');
        document.addEventListener('mousemove', logKey);
        function logKey(e){
            screenLog.innerText = `
            Client X/Y: ${e.clientX}, ${e.clientY}`; 
        }