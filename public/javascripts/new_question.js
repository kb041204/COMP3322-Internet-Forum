var title = document.getElementById("title"); //get title
var space_elements = document.getElementsByName("space");
var content = document.getElementById("content"); //get content
var btn_submit = document.getElementById("btn_submit");

function span_change(msg) {
	if(msg === undefined) {
		$("span").text("");
		$("span").css("display", "none");
	} else {
		$("span").text(msg);
		$("span").css("display", "block");
	}
}

btn_submit.addEventListener("click", function (evt) {
	for(let i = 0; i < space_elements.length; i++) {
		if(space_elements[i].checked) {
			var space = space_elements[i]; //get selected space
			break;
		}
	}
	
	if(title.value.includes("<") && title.value.includes(">")) {
		alert("Title cannot contains the symbol \"<\" and \">\"");
		return;
	}
	
	if(content.value.includes("<") && content.value.includes(">")) {
		alert("Content cannot contains the symbol \"<\" and \">\"");
		return;
	}
	
	if(title.value == "" || content.value == "") {
		span_change("Please fill in all the fields");
	} else {
		//AJAX request to DB to add new question
		var newQuestion = {
			'title': title.value,
			'space': space.value,
			'content': content.value
		}
		//send AJAX request to MongoDB
		$.ajax({
			type: 'POST',
			data: newQuestion,
			url: '/questions/newQuestion',
			dataType: 'JSON'
		}).done(function (response) {
			if(response.msg === '') {
				//successful posting of a new question
				window.location.href = "/";
			} else {
				//error in server side/user not login
				span_change(response.msg);
			}
		});
	}
});