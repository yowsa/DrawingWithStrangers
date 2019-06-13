


$.ajax({
	datatype: "json",
	url: "/hello",
	data: {"name" : "josefin"},
	success: function(x){
		alert(JSON.stringify(x))
	}
})


