//show new answer buttons
function show_new_answer(qid, uid, ele) {
	let new_ans_area = document.createElement("div");
	new_ans_area.setAttribute("class", "new_ans_area");
	
	let new_ans_content = document.createElement("textarea");
	new_ans_content.setAttribute("class", "new_ans_content");
	
	let break_line = document.createElement("br");
	
	let submit_btn = document.createElement("button");
	submit_btn.setAttribute("type", "button");
	submit_btn.setAttribute("onclick", "add_new_answer('" + qid + "','" + uid + "', this)");
	submit_btn.innerHTML = "Submit";
	
	let cancel_btn = document.createElement("button");
	cancel_btn.setAttribute("type", "button");
	cancel_btn.setAttribute("onclick", "cancel_add_new_answer('" + qid + "','" + uid + "', this)");
	cancel_btn.innerHTML = "Cancel";	
	
	new_ans_area.append(new_ans_content);
	new_ans_area.append(break_line);
	new_ans_area.append(submit_btn);
	new_ans_area.append(cancel_btn);
	
	ele.parentNode.replaceChild(new_ans_area, ele);
}

//upvote button
function upvote(qid, uid, ele) {
	var req = {
		'qid': qid,
		'uid': uid
	}
	console.log("hello qid: " + qid + ", uid: " + uid);
	$.ajax({
		type: 'POST',
		data: req,
		url: '/questions/upvote'
	}).done(function (response) {
		//update text
		ele.lastChild.innerHTML = " Upvote (" + response.upvotecount + ")";
		
		//update icon
		if(response.upvote) //it was upvoted before
			ele.firstChild.src = "/images/upvote.png";
		else //it was NOT upvoted before
			ele.firstChild.src = "/images/upvoted.png";
	});
}

//submit new answer
function add_new_answer(qid, uid, ele) {
	var req = {
		'qid': qid,
		'uid': uid,
		'from_index': false,
		'content': ele.parentNode.firstChild.value
	}
	
	if(req.content.includes("<") && req.content.includes(">")) {
		alert("Answer cannot contains the symbol \"<\" and \">\"");
		return;
	}
	
	if(req.content == "") {
		alert("Please fill in all the field");
		return;
	}
	
	$.ajax({
		type: 'POST',
		data: req,
		url: '/questions/newAnswer'
	}).done(function (response) {
		//update all the answers
		if(response.error) {
			ele.parentNode.parentNode.parentNode.innerHTML = "Error in inserting: " + response.msg;
		} else {
			ele.parentNode.parentNode.parentNode.innerHTML = response.msg;
		}
	});
}

//user clicks cancel button
function cancel_add_new_answer(qid, uid, ele) {
	var req = {
		'qid': qid,
		'uid': uid,
		'from_index': false
	}
	
	$.ajax({
		type: 'POST',
		data: req,
		url: '/questions/getAllAnswers'
	}).done(function (response) {
		//update all the answers
		if(response.error) {
			ele.parentNode.parentNode.parentNode.innerHTML = "Error in inserting: " + response.msg;
		} else {
			ele.parentNode.parentNode.parentNode.innerHTML = response.msg;
		}
	});
}

//user clicks delete answer
function delete_answer(qid, uid, aid, ele) {
	var req = {
		'qid': qid,
		'uid': uid,
		'aid': aid,
		'from_index': false
	}
	
	$.ajax({
		type: 'POST',
		data: req,
		url: '/questions/answer/delete'
	}).done(function (response) {
		//update all the answers
		if(response.error) {
			ele.parentNode.parentNode.innerHTML = "Error in deleting answer: " + response.msg;
		} else {
			ele.parentNode.parentNode.innerHTML = response.msg;
		}
	});
}

//question edit button
function show_edit_question(qid, uid, ele) {
	//hide buttons for question
	document.getElementById("question_buttons").style.display = "none";
	
	//build the HTML elements
	let edit_question_area = document.createElement("div");
	edit_question_area.setAttribute("id", "edit_question_area");
	
	//title
	let title_label = document.createElement("label");
	title_label.innerHTML = "Title";
	let title_input = document.createElement("input");
	title_input.setAttribute("id", "title");
	title_input.innerHTML = "Title";
	edit_question_area.appendChild(title_label);
	edit_question_area.appendChild(title_input);
	
	//space
	let space_label = document.createElement("label");
	space_label.innerHTML = "Space";
	edit_question_area.appendChild(space_label);
	
	let space_area = document.createElement("div");
	space_area.setAttribute("id", "space");
	edit_question_area.appendChild(space_area);
	
	let space_algo = document.createElement("input");
	space_algo.setAttribute("id", "algo");
	space_algo.setAttribute("type", "radio");
	space_algo.setAttribute("name", "space");
	space_algo.setAttribute("value", "algo");
	let space_algo_label = document.createElement("label");
	space_algo_label.innerHTML = "Algorithm";
	space_area.append(space_algo);
	space_area.append(space_algo_label);
	
	let space_ml = document.createElement("input");
	space_ml.setAttribute("id", "ml");
	space_ml.setAttribute("type", "radio");
	space_ml.setAttribute("name", "space");
	space_ml.setAttribute("value", "ml");
	let space_ml_label = document.createElement("label");
	space_ml_label.innerHTML = "Machine Learning";	
	space_area.append(space_ml);
	space_area.append(space_ml_label);	
	
	let space_sys = document.createElement("input");
	space_sys.setAttribute("id", "sys");
	space_sys.setAttribute("type", "radio");
	space_sys.setAttribute("name", "space");
	space_sys.setAttribute("value", "sys");
	let space_sys_label = document.createElement("label");
	space_sys_label.innerHTML = "System";	
	space_area.append(space_sys);
	space_area.append(space_sys_label);	
	
	let space_js = document.createElement("input");
	space_js.setAttribute("id", "js");
	space_js.setAttribute("type", "radio");
	space_js.setAttribute("name", "space");
	space_js.setAttribute("value", "js");
	let space_js_label = document.createElement("label");
	space_js_label.innerHTML = "Javascript";	
	space_area.append(space_js);
	space_area.append(space_js_label);
	
	//content
	let content_label = document.createElement("label");
	content_label.innerHTML = "Content";
	edit_question_area.appendChild(content_label);
	
	let content_input = document.createElement("textarea");
	content_input.setAttribute("id", "content");
	edit_question_area.appendChild(content_input);
	
	//submit button
	let submit_btn = document.createElement("button");
	submit_btn.setAttribute("type", "button");
	submit_btn.setAttribute("onclick", "edit_question('" + qid + "','" + uid + "', this)");
	submit_btn.innerHTML = "Submit";
	edit_question_area.appendChild(submit_btn);

	//change default value
	title_input.value = document.getElementById("question_detail").firstChild.innerHTML;
	switch(document.getElementById("question_area").firstChild.innerHTML) {
		case "Algorithm": space_algo.checked = true; break;
		case "Machine Learning": space_ml.checked = true; break;
		case "System": space_sys.checked = true; break;
		case "Javascript": space_js.checked = true; break;
	}
	content_input.value = document.getElementById("question_detail").lastChild.innerHTML;
	
	//replace element
	let q_detail = document.getElementById("question_detail");
	document.getElementById("question_area").replaceChild(edit_question_area, q_detail);
}

//question submit edit button 
function edit_question(qid, uid, ele) {
	var title = document.getElementById("title"); //get title
	var space_elements = document.getElementsByName("space");
	var content = document.getElementById("content"); //get content
	
	//find out the selected radio button
	for(let i = 0; i < space_elements.length; i++) {
		if(space_elements[i].checked) {
			var space = space_elements[i]; //get selected space
			break;
		}
	}
	var space_chosen = '';
	switch(space.value) {
		case "algo": space_chosen = "Algorithm"; break;
		case "ml": space_chosen = "Machine Learning"; break;
		case "sys": space_chosen = "System"; break;
		case "js": space_chosen = "Javascript"; break;	
	}
	
	//reject abnormal cases
	if(title.value.includes("<") && title.value.includes(">")) {
		alert("Title cannot contains the symbol \"<\" and \">\"");
		return;
	}
	if(content.value.includes("<") && content.value.includes(">")) {
		alert("Content cannot contains the symbol \"<\" and \">\"");
		return;
	}
	
	if(title.value == "" || content.value == "" || space_chosen == "") {
		alert("Please fill in all the fields");
	} else {
		var req = {
			'qid': qid,
			'uid': uid,
			'title': title.value,
			'space': space_chosen,
			'content': content.value
		}
		
		$.ajax({
			type: 'POST',
			data: req,
			url: '/questions/edit',
			dataType: 'JSON'
		}).done(function (response) {
			console.log(response.msg);
			if(response.error) {
				document.getElementById("question_area").innerHTML = "Error in editing question: " + response.msg;
			} else {
				document.getElementById("question_area").innerHTML = response.msg; //replace HTML code for question
			}
		});
	}
}

//question delete button
function delete_question(qid, uid, ele) {
	var req = {
		'qid': qid,
		'uid': uid,
	}
	
	$.ajax({
		type: 'POST',
		data: req,
		url: '/questions/delete'
	}).done(function (response) {
		if(response.msg != '') {
			document.getElementById("question_area").innerHTML = "Error in deleting question: " + response.msg;
		} else {
			window.location.href = "/"; //redirect back to main page
		}
	});
}