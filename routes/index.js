var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	async function updateCreatorName() {
		// need lean() for modifying the query result
		let first = await req.question.find().sort({time: -1}).lean();
			
		//update creatorid to name of creator
		for(let i = 0; i < first.length; i++) {
			let second = await req.user.find({"_id": first[i].creatorid}, "name");
			first[i].creatorname = second[0].name;
			
			//check upvoted or not
			if(req.session.uid !== undefined) {
				first[i].upvoted = false;
				for(let j = 0; j < first[i].up.length; j++) {
					if(req.session.uid === first[i].up[j].toString()) { //matching user id
						first[i].upvoted = true;
						break;
					}
				}
			}
			
			//insert answers for each question
			first[i].detailAnswers = []; //empty object for detail answer
			for(let k = 0; k < first[i].answer.length; k++) {
				let ans = await req.answer.find({"_id": first[i].answer[k]}); //retrieve the answer object
				let ans_name = await req.user.find({"_id": ans[0].uid});
				first[i].detailAnswers[k] = {
					'id': ans[0]._id,
					'content': ans[0].content,
					'uid': ans[0].uid,
					'time': ans[0].time,
					'uname': ans_name[0].name
				}
			}
		}
		if(req.session.uid !== undefined) {
			var user_info = {
				'_id': req.session.uid,
				'name': req.session.name
			}
			res.render("index", {data: first, user: user_info});
		} else {
			res.render("index", {data: first, user: null});
		}
	}
	updateCreatorName();
});

router.get('/logout', function(req, res, next) {
	req.session.destroy((err) => {
		if(err)
			console.log("Error: Cannot destroy session!");
	});
	res.redirect('/');
});

module.exports = router;