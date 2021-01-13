function adjust_UI() {
	const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
	
	//adjust position of aside
	let header = document.querySelector("header");
	let aside = document.querySelector("aside");
	aside.style.top = header.offsetHeight + "px";
	
	//adjust position and size of section and footer
	let section = document.querySelector("section");
	let footer = document.querySelector("footer");
	if(window.innerWidth > 519) {
		section.style.marginLeft = aside.offsetWidth + "px";
		footer.style.marginLeft = aside.offsetWidth + "px";
		section.style.width = (header.offsetWidth > 1079) ? ("750px") : ((header.offsetWidth - aside.offsetWidth - 24) + "px");
		footer.style.width = (header.offsetWidth > 1079) ? ("750px") : ((header.offsetWidth - aside.offsetWidth - 24) + "px");
	}
	
	//adjust length of aside
	if(window.innerWidth > 519) {
		let body = document.querySelector("body");
		aside.style.height = (body.offsetHeight > (vh - header.offsetHeight)) ? (body.offsetHeight + "px") : ((vh - header.offsetHeight) + "px");
	}
	
	//replace paragraph element in each question
	$.each($("article > p"), function(idx, ele) {
		console.log(ele.getClientRects().length);
	});
}

function populate_section(condition) {
	if(condition === undefined)
		return;
	//AJAX request to DB to get all questions based on condition
	var searchCond = {
		'condition': condition
	}
	$.ajax({
		type: 'POST',
		data: searchCond,
		url: '/questions/getQuestions',
	}).done(function (response) {
		document.querySelector("div#questions").innerHTML = response;
		adjust_UI();
	});
}

function populate_section_type(type) {
	if(type === undefined)
		return;
	//AJAX request to DB to get all questions based on type
	var searchCond = {
		'type': type
	}
	$.ajax({
		type: 'POST',
		data: searchCond,
		url: '/questions/getQuestionsByFilter'
	}).done(function (response) {
		document.querySelector("div#questions").innerHTML = response;
		adjust_UI();
	});
}

//#######Part 1: Adjust UI
adjust_UI();

//#######Part 2: Register all the buttons
//Name logo
$("#logo").click( function() {
	//AJAX request to DB to get all questions based on condition
	populate_section("date");
});
//Home
$("#home").click( function() {
	//AJAX request to DB to get all questions based on condition
	populate_section("date");
});
//Hot
$("#hot").click( function() {
	//AJAX request to DB to get all questions based on condition
	populate_section("hot");
});
//log out button
$("#logout").click( function() {
	$.ajax({
		type: 'GET',
		url: '/logout',
	}).done(function (response) {
		window.location.href = "/."; //redirect to main page
	});
});

//aside
//algo
$("#algo").click( function() {
	populate_section_type("algo");
});
//ml
$("#ml").click( function() {
	populate_section_type("ml");
});
//sys
$("#sys").click( function() {
	populate_section_type("sys");
});
//js
$("#js").click( function() {
	populate_section_type("js");
});

//search field
$("#filter input").keyup( function() {
	var searchCond = {
		'title': $(this).val()
	}
	$.ajax({
		type: 'POST',
		data: searchCond,
		url: '/questions/getQuestionsByTitle'
	}).done(function (response) {
		document.querySelector("div#questions").innerHTML = response;
		adjust_UI();
	});
});

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

//show answers buttons
function show_answers(ele) {
	$(ele).next().toggle(); //change show/hide
	var answer_btns = document.getElementsByClassName("answer_btn");
	$.each(answer_btns, function(idx, val) {
		if(val != ele) {
			$(val).next().hide(); //hide all remaining elements
		}
	});
	adjust_UI();
}

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
	adjust_UI();
}

//submit new answer
function add_new_answer(qid, uid, ele) {
	var req = {
		'qid': qid,
		'uid': uid,
		'from_index': true,
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
			ele.parentNode.parentNode.parentNode.previousSibling.firstChild.innerHTML = "Answer (" + response.ans_count + ")"; //change answer count
			ele.parentNode.parentNode.parentNode.innerHTML = response.msg; //change answer_area
		}
	});
}

//user clicks cancel button
function cancel_add_new_answer(qid, uid, ele) {
	var req = {
		'qid': qid,
		'uid': uid,
		'from_index': true
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
			ele.parentNode.parentNode.parentNode.previousSibling.firstChild.innerHTML = "Answer (" + response.ans_count + ")"; //change answer count
			ele.parentNode.parentNode.parentNode.innerHTML = response.msg; //change answer_area
		}
	});
}