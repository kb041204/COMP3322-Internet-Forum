var express = require('express');
var router = express.Router();

var db = require('mongoose'); //for db.Types.ObjectId(string)

async function add_creatorname(first, req) {
	//update creatorid and upvoted questions
	for(let i = 0; i < first.length; i++) {
		let second = await req.user.find({"_id": first[i].creatorid}, "name");
		first[i].creatorname = second[0].name;
		if(req.session.uid !== undefined) {
			first[i].upvoted = false;
			for(let j = 0; j < first[i].up.length; j++) {
				if(req.session.uid === first[i].up[j].toString()) { //matching user id
					first[i].upvoted = true;
					break;
				}
			}
		}
	}
}

async function build_html(first, req) {
	//build the HTML code
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var html_code = "";
	for(q of first) {
		html_code += "<article id='" + q._id  + "'><h5>" + q.space + "</h5><br/><span class='user_name'>" + q.creatorname + "</span>" +
			"<span> posted at " + q.time.getDate() + " " + months[q.time.getMonth()] + " " + q.time.getFullYear() + "</span>" +
			"<h1 onclick=\"window.location.replace('/questions/detail/" + q._id + "')\">" + q.title + "</h1><p>" + q.content + "</p>";
		//upvote button
		if(req.session.uid !== undefined) { //login
			html_code += "<div class='upvote' onclick=\"upvote('" + q._id + "', '" + req.session.uid + "\', this)\">";
			if(q.upvoted)
				html_code += "<img src='/images/upvoted.png'><span> Upvote (" + q.up.length + ")</span></div>";
			else
				html_code += "<img src='/images/upvote.png'><span> Upvote (" + q.up.length + ")</span></div>";						
		} else { //not login
			html_code += "<div class='upvote' style='cursor: default'><img src='/images/upvote.png'><span> Upvote (" + q.up.length + ")</span></div>";
		}
		//add answer button
		html_code += "<div class='answer_btn' onclick='show_answers(this)'><span>Answer (" + q.answer.length + ")</span></div>";
		
		//add answers
		html_code += "<div class='answer_area' style='display: none'>";
		for(let k = 0; k < q.answer.length; k++) {
			let ans_obj = await req.answer.find({"_id": q.answer[k]}); //retrieve the answer object
			let answerer_name = await req.user.find({"_id": ans_obj[0].uid});
			html_code += "<div class='answer' id='" + ans_obj[0]._id + "'>";
			html_code += "<span class='user_name'>" + answerer_name[0].name + "</span>";
			html_code += "<span> posted at " + ans_obj[0].time.getDate() + " " + months[ans_obj[0].time.getMonth()] + " " + ans_obj[0].time.getFullYear() + "</span>";
			html_code += "<p>" + ans_obj[0].content + "</p></div>";
		}
		//add "add new answer"
		if(req.session.uid !== undefined) {
			html_code += "<div class='add_new_answer'>";
			html_code += "<span class='user_name'>" + req.session.name + "</span>";
			html_code += "<p onclick='show_new_answer(\"" + q._id + "\",\"" + req.session.uid + "\", this)'>Post your new answer</p></div>";
		}	
		//ending html code
		html_code += "</div></article>";
	}
	return html_code;
}

async function build_answer_area(req) {
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	let ans_area_html_code = "";
	
	let q = await req.question.find({"_id": req.body.qid}).lean();
	
	for(let k = 0; k < q[0].answer.length; k++) {
		let ans_obj = await req.answer.find({"_id": q[0].answer[k]}); //retrieve the answer object
		let answerer_name = await req.user.find({"_id": ans_obj[0].uid});

		ans_area_html_code += "<div class='answer' id='" + ans_obj[0]._id + "'>";
		ans_area_html_code += "<span class='user_name'>" + answerer_name[0].name + "</span>";
		ans_area_html_code += "<span> posted at " + ans_obj[0].time.getDate() + " " + months[ans_obj[0].time.getMonth()] + " " + ans_obj[0].time.getFullYear() + "</span>";
		ans_area_html_code += "<p>" + ans_obj[0].content + "</p>";
		if(req.session.uid == ans_obj[0].uid.toString() && (req.body.from_index === 'false')) //somehow req.body.from_index is a string, but not boolean
			ans_area_html_code += "<button onclick='delete_answer(\"" + q[0]._id + "\",\"" + req.session.uid + "\",\"" + ans_obj[0]._id + "\", this)'>Delete</button>"
		ans_area_html_code += "</div>";
	}
	//add "add new answer"
	if(req.session.uid !== undefined) {
		ans_area_html_code += "<div class='add_new_answer'>";
		ans_area_html_code += "<span class='user_name'>" + req.session.name + "</span>";
		ans_area_html_code += "<p onclick='show_new_answer(\"" + q[0]._id + "\",\"" + req.session.uid + "\", this)'>Post your new answer</p></div>";
	}
	
	return ans_area_html_code;
}

//header and aside buttons
router.post('/getQuestions', function(req, res) {
	if(req.body.condition == "hot") {
		//sort by Hot
		async function updateSortByHot() {
			let first = await req.question.aggregate([{ 
				$project:{
					"_id": 1, "space": 1, "title": 1, "content": 1,
					"answer": 1, "time": 1, "creatorid": 1, "up": 1,
					NumOfUp: {$size:"$up"} //create aggregate field "NumOfUp"
				}
			},{
				$sort: {
					NumOfUp: -1 //sort by number of up desc
				}
			}]);
			await add_creatorname(first, req);
			var html_code = await build_html(first, req);
			res.send(html_code);
		}
		updateSortByHot();
		
	} else if (req.body.condition == "date") {
		async function updateCreatorName() {
			// need lean() for modifying the query result
			let first = await req.question.find().sort({time: -1}).lean();
			
			await add_creatorname(first, req);
			var html_code = await build_html(first, req);
			res.send(html_code);
		}
		updateCreatorName();
	}
});

//Using buttons on the aside
router.post('/getQuestionsByFilter', function(req, res) {
	async function getQuestionsByType(type) {
		// need lean() for modifying the query result
		let first = await req.question.find({"space": type}).sort({time: -1}).lean();
		
		await add_creatorname(first, req);
		var html_code = await build_html(first, req);
		res.send(html_code);
	}
	
	if(req.body.type == "algo") {
		getQuestionsByType("Algorithm");
	} else if (req.body.type == "ml") {
		getQuestionsByType("Machine Learning");
	} else if (req.body.type == "sys") {
		getQuestionsByType("System");
	} else if (req.body.type == "js") {
		getQuestionsByType("Javascript");
	}
});

//Using filter on the search field
router.post('/getQuestionsByTitle', function(req, res) {
	async function getQuestionsByTitle() {
		// need lean() for modifying the query result
		let regex = new RegExp(req.body.title, 'i'); //i = case-insensitive
		let first = await req.question.find({"title": {$regex: regex}}).sort({time: -1}).lean();
		
		await add_creatorname(first, req);
		var html_code = await build_html(first, req);
		res.send(html_code);
	}
	getQuestionsByTitle();
});

//Process upvoting button
router.post('/upvote', function(req, res) {
	async function process_upvote() {
		let first = await req.question.find({"_id": req.body.qid}).lean();
		var upvoted = false;
		var target_pos = 0;
		for(target_pos = 0; target_pos < first[0].up.length; target_pos++) {
			if(first[0].up[target_pos].toString() === req.body.uid) {
				upvoted = true;
				break;
			}
		}

		if(upvoted) {
			first[0].up.splice(target_pos, 1); //remove the ObjectId from array
		} else {
			first[0].up.push(db.Types.ObjectId(req.body.uid)); //add new object to array
		}
		
		await req.question.findByIdAndUpdate({'_id': req.body.qid}, {'up': first[0].up});
		res.send({ upvote: upvoted, upvotecount: first[0].up.length });
	}
	
	if(req.session.uid)
		process_upvote();
});

//Render new question page
router.get('/new', function(req, res) {
	res.render("new_question");
});

//Render new question page
router.post('/newQuestion', async function(req, res) {
	
	if(!req.session.uid) { //user not login
		res.send({msg: 'Error: Please login first'});
		return;
	}
	
	var space = "";
	switch(req.body.space) {
		case "algo": space = "Algorithm"; break;
		case "ml": space = "Machine Learning"; break;
		case "sys": space = "System"; break;
		case "js": space = "Javascript"; break;
	}
	
	let addQuestion = new req.question({
		title: req.body.title,
		space: space,
		content: req.body.content,
		answer: [],
		up: [],
		time: new Date().toISOString(),
		creatorid: db.Types.ObjectId(req.session.uid)
	});
	
	//add new user
	addQuestion.save(function (err, result) {
		console.log(">> Log: new question \"" + req.body.title + "\" posted");
		res.send((err === null) ? { msg: '' } : { msg: err });
	});
	
});

//Render new question page
router.post('/newAnswer', function(req, res) {
	if(!req.session.uid)
		return;
	
	let addAnswer = new req.answer({
		content: req.body.content,
		time: new Date().toISOString(),
		uid: db.Types.ObjectId(req.session.uid)
	});
	
	//add new answer
	addAnswer.save(async function (err, result) {
		if(err !== null) { //error in inserting to collection
			res.send({error: true, msg: err});
		} else { //no error
			//insert answer into question collection result._id
			let questions = await req.question.find({"_id": req.body.qid}).lean(); //find target question document
			questions[0].answer.push(db.Types.ObjectId(result._id)); //add new ObjectId to answer array
			await req.question.findByIdAndUpdate({'_id': req.body.qid}, {'answer': questions[0].answer}); //update answer array
			
			//construct html code for the whole question
			var ans_area_html_code = await build_answer_area(req);
			
			console.log(">> Log: new answer to question \"" + questions[0].title + "\" posted");
			res.send({ error: false, msg: ans_area_html_code, ans_count: questions[0].answer.length });
		}
	});
});

//Render new question page
router.post('/getAllAnswers', async function(req, res) {
	if(!req.session.uid)
		return;
	
	//construct html code for the whole question
	let ans_area_html_code = await build_answer_area(req);

	let questions = await req.question.find({"_id": req.body.qid}).lean(); //find target question document

	res.send({ error: false, msg: ans_area_html_code, ans_count: questions[0].answer.length});
});

//Process detail question pages
router.get('/detail/:qid', async function(req, res) {
	let question = await req.question.find({"_id": req.params.qid}).lean();
	
	let second = await req.user.find({"_id": question[0].creatorid}, "name");
	question[0].creatorname = second[0].name;
			
	//check upvoted or not
	if(req.session.uid !== undefined) {
		question[0].upvoted = false;
		for(let j = 0; j < question[0].up.length; j++) {
			if(req.session.uid === question[0].up[j].toString()) { //matching user id
				question[0].upvoted = true;
				break;
			}
		}
	}

	//insert answers for each question
	question[0].detailAnswers = []; //empty object for detail answer
	for(let k = 0; k < question[0].answer.length; k++) {
		let ans = await req.answer.find({"_id": question[0].answer[k]}); //retrieve the answer object
		let ans_name = await req.user.find({"_id": ans[0].uid});
		question[0].detailAnswers[k] = {
			'id': ans[0]._id,
			'content': ans[0].content,
			'uid': ans[0].uid,
			'time': ans[0].time,
			'uname': ans_name[0].name
		}
	}
	
	if(req.session.uid !== undefined) {
		var user_info = {
			'_id': req.session.uid,
			'name': req.session.name
		}
		res.render("detail_question", {question: question[0], user: user_info});
	} else {
		res.render("detail_question", {question: question[0], user: null});
	}
});

//Delete answer from question
router.post('/answer/delete', async function(req, res) {
	if(!req.session.uid)
		return;

	//delete the answer field of that question
	let target_q = await req.question.find({"_id": req.body.qid});
	var found = false;
	var target_pos = 0;
	for(target_pos = 0; target_pos < target_q[0].answer.length; target_pos++) {
		if(target_q[0].answer[target_pos].toString() === req.body.aid) {
			found = true;
			break;
		}
	}

	if(found) {
		target_q[0].answer.splice(target_pos, 1); //remove the answer ObjectId from answer array
		await req.question.findByIdAndUpdate({'_id': req.body.qid}, {'answer': target_q[0].answer});
		
		//delete the answer document
		await req.answer.findOneAndDelete({"_id": req.body.aid}, function(err, result) {
			if(err !== null) {
				console.log("Error: Cannot remove answer document: " + req.body.aid);
				res.send({ error: true, msg: err });
			}
		});
		
	} else {
		console.log("Error: Cannot find answer document: " + req.body.aid);
		res.send({ error: true, msg: "Cannot find answer document" });
	}

	//rebuild html code
	let ans_area_html_code = await build_answer_area(req);
	console.log(">> Log: Answer \"" + req.body.aid + "\" from question \"" + req.body.qid + "\" deleted");
	res.send({ error: false, msg: ans_area_html_code });	
});

//Delete question
router.post('/delete', async function(req, res) {
	if(req.session.uid != req.body.uid)
		return;
	
	let target_q = await req.question.find({"_id": req.body.qid});
	
	//delete all the answers
	let error_occured = false;
	for(let i = 0; i < target_q[0].answer.length; i++) {
		await req.answer.findOneAndDelete({"_id": target_q[0].answer[i]}, function(err, result) {
			if(err !== null) {
				console.log("Error: Cannot remove answer document: " + target_q[0].answer[i]);
				error_occured = true;
				return;
			} else {
				console.log(">> Log: Answer " + target_q[0].answer[i] + " to question " + target_q[0]._id + " deleted");
			}
		});
		
		if(error_occured) //Abort deletion
			return;
	}
	
	//delete question
	await req.question.findOneAndDelete({"_id": req.body.qid}, function(err, result) {
		if(err !== null) {
			console.log("Error: Cannot remove question document: " + req.body.qid);
			res.send({msg: err});	
		} else {
			console.log(">> Log: Question " + req.body.qid + " and all its answers deleted");
			res.send({msg: ''});
		}
	});
});

//Edit question
router.post('/edit', async function(req, res) {
	if(req.session.uid != req.body.uid)
		return;
	
	let target_q = await req.question.find({"_id": req.body.qid});
	
	//edit title, space and content
	await req.question.findByIdAndUpdate({'_id': req.body.qid}, {'title': req.body.title, 'space': req.body.space, 'content': req.body.content}, async function(err, result) {
		if(err !== null) {
			console.log("Error: Cannot edit question document: " + req.body.qid);
			res.send({error: true, msg: err});
		} else {
			let new_data = await req.question.find({"_id": req.body.qid});
			
			//build the html code
			var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			let second = await req.user.find({"_id": new_data[0].creatorid}, "name");
			var creatorname = second[0].name;
			
			var html_code_for_question = "";
			html_code_for_question += "<h5>" + new_data[0].space + "</h5><br>"
			html_code_for_question += "<span class='user_name'>" + creatorname + "</span>"
			html_code_for_question += "<span> posted at " + new_data[0].time.getDate() + " " + months[new_data[0].time.getMonth()] + " " + new_data[0].time.getFullYear() + "</span>"
			html_code_for_question += "<div id='question_detail'>"
			html_code_for_question += "<h1>" + new_data[0].title + "</h1>";
			html_code_for_question += "<p>" + new_data[0].content + "</p></div>";
			html_code_for_question += "<div id='question_buttons'>"
			html_code_for_question += "<button onclick=\"show_edit_question('" + req.body.qid + "','" + req.body.uid + "', this)\">Edit</button>";
			html_code_for_question += "<button onclick=\"delete_question('" + req.body.qid + "','" + req.body.uid + "', this)\">Delete</button>";
			html_code_for_question += "</div>";
			
			console.log(">> Log: Question " + req.body.qid + " edited");
			res.send({error: false, msg: html_code_for_question});
		}
	});
});

module.exports = router;