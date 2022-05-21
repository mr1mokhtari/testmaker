var express			=require("express"),
	router			=express.Router(),
	
	bodyParser 		=require('body-parser'),
	url 			=require('url'),
	querystring 	=require('querystring'),
	moment			=require('moment-timezone'),
	
	mongoose		=require("mongoose"),
	Question		=require("../models/question"),
	ParentCategory	=require("../models/parentCategory"),
	SubCategory		=require("../models/subCategory"),
	Test			=require("../models/test"),
	Admin			=require("../models/admin"),
	
	flash		=require("connect-flash"),
	middleware	=require("../middleware/index"),
	
	methodOverride	=require("method-override"),
	expressSanitizer=require("express-sanitizer"),
	escapeRegex 	= require('../public/js/utilities/regex-escape');

router.use(methodOverride("_method"));
router.use(expressSanitizer());

//index: see all questions
router.get('/questions',middleware.isLoggedInTeacher, async (req, res, next) => {
	let type=req.query.filter_qtype,
		query=req.query.filter_query,
		status=req.query.filter_status,
		cat=req.query.filter_cat_id,
		search={type:type,query:query,status:status,cat:cat},
		test_id=req.query.test_id
	var page  = parseInt(req.query.page)||1; // page
	if(page<=0){page=1}
	const limit = parseInt(req.query.limit)||40; // results per page
	let newSearch={};

	try {
		// if (1) {//1=req.query.search
		// const searchQuery = req.query.search,
		// regex = new RegExp(escapeRegex(searchQuery), 'gi');

		if(type){newSearch.type=type}
		if(query){newSearch.question=new RegExp(query,"i")}
		if(status){newSearch.status=status}//not assigned yet,0 results,mongo crash
		if(cat!='no_cat_filter'&&cat){
			
			newSearch.sub_cat_id=cat
		}//not assigned yet,0 results,mongo crash
		setUser(newSearch,req.user)
		let numOfQs = await Question.count(newSearch);
		
		let skipValue=(limit * page) - limit;
		if(skipValue<0){
				skipValue=0;//error yaz
		}
		const totalPages= Math.ceil(numOfQs / limit);
		if(page>totalPages) {page=totalPages;}
		// Find Demanded Products - Skipping page values, limit results       per page
		const foundQuestions = await Question.find(newSearch)
      		.skip(skipValue)
      		.limit(limit); //find ichinde bu var => name:regex
		const foundParentCategories=await ParentCategory.find({"author.username":req.user.username});
		const foundSubCategories=await SubCategory.find({"author.username":req.user.username});
		const teacher = await Admin.findById(req.user.id)
		const T=await Test.findById(test_id)
		if(T){let numOfTQs = T.questions.length;}
			// Renders The Page
			res.render('questions/questionBank', {
   				questions: foundQuestions,
   				page: page,
				limit:limit,
   				totalPages: totalPages,
				search:search,
   				numOfQuestions: numOfQs,
				// numOfTestQuestions: numOfTQs,
				pcats:foundParentCategories,
				scats:foundSubCategories,
				test:T,
				newQ:0, //To change menu.ejs
				teacher:teacher,
				moment:moment
  			});
	} catch (err) {
  		throw new Error(err);
	}
});

//create: add new questions
router.get("/questions/new",middleware.isLoggedInTeacher,async (req,res,next)=>{
	try{
		let pcats= await ParentCategory.find({"author.username":req.user.username}),
			scats= await SubCategory.find({"author.username":req.user.username}),
			teacher= await Admin.findById(req.user.id)
		if(req.query.test_id){
			let	test = await Test.findById(req.query.test_id)
			res.render("questions/new",{teacher:teacher, pcats:pcats, scats:scats, test:test, newQ:1, question:0})
		}else if(req.query.question_id && !req.query.duplicate){
			let question = await Question.findById(req.query.question_id)
			res.render("questions/new",{teacher:teacher, pcats:pcats, scats:scats, test:null, newQ:1, question:question, dup:0})
		}else if(req.query.question_id && req.query.duplicate){
			let question = await Question.findById(req.query.question_id)
			res.render("questions/new",{teacher:teacher, pcats:pcats, scats:scats, test:null, newQ:1, question:question, dup:1})
		}else{
			res.render("questions/new",{teacher:teacher, pcats:pcats, scats:scats, test:null, newQ:1, question:0})
		}
	}catch(err){
		throw new Error(err)
	}
})
router.post("/questions",middleware.isLoggedInTeacher,(req,res)=>{
	var newQuestion=req.body.question;
	checkAction(newQuestion);
	makeDate(newQuestion)
	parseNum(newQuestion)
	makeCat(newQuestion,req.body.cat_id)
	setUser(newQuestion,req.user)
	
	Question.create(newQuestion,(err,q)=>{
		if(err){console.log(err);}
		else{
			SubCategory.findById(newQuestion.sub_cat_id,(err2,subcat)=>{
				if(err){console.log(err);}
				else{
					subcat.questions.push(q._id)
					subcat.save((err3)=>{
						if(err3){console.log(err3)}
						else{
							if(!req.body.test_id){
								console.log(q)
								var response = {
									response: 'success',
									msg:"Your Question was saved in your Question Bank."
								};
								res.send(response);
							}else{
								Test.findById(req.body.test_id,(err9,T)=>{
									if(err9){console.log(err9)}
									else{
										T.questions.push(q)
										T.save((err8)=>{
											if(err8){console.log(err8)}
											else{
											var response = {
												response: 'success',
												msg:"Your Question was saved in your Question Bank and set in your Test."
											};
												res.send(response);
											}
										})
									}
								})
							}
						}
					})
				}
			})
		}
	})
})


//Remove
router.delete("/questions/:id",middleware.isLoggedInTeacher,(req,res)=>{
	Question.findByIdAndRemove(req.params.id,(err,q)=>{
		if(err){
			console.log(err)
			var response = {
    			response: "err",
				msg:"There is an error. Your question has NOT been deleted.",
    			id: req.params.id
			};
    		res.send(response);
		}else{
			SubCategory.findById(q.sub_cat_id,(err2,subcat)=>{
				if(err2){console.log(err2)}
				else{
					var i = subcat.questions.indexOf(req.params.id)
					subcat.questions.splice(i,1)
					subcat.save((err3)=>{
						if(err3){console.log(err3)}
						else{
							var response = {
								response: "success",
								msg:"Your question has been deleted.",
								id: req.params.id
							};
							res.send(response);
						}
					})
				}
			})
		}
	})
})

//Edit
router.get("/questions/:id/edit",middleware.isLoggedInTeacher,(req,res)=>{
	Question.findById(req.params.id,(err1,foundQuestion)=>{
		if(err1){console.log(err)}
		ParentCategory.find({},(err2,foundParentCategories)=>{
			if(err2){console.log(err)}
			else{
				SubCategory.find({},(err3,foundSubCategories)=>{
					if(err3){console.log(err)}
					else{
						res.render("questions/edit",{foundQuestion:foundQuestion,pcats:foundParentCategories, scats:foundSubCategories})
					}
				})
			}
		})
	})
})

router.put("/questions/:id",middleware.isLoggedInTeacher,async(req,res,next)=>{
	// req.body.question.question=req.sanitize(req.body.question.question);
	var newQuestion=req.body.question;
	checkAction(newQuestion)
	editDate(newQuestion)
	makeCat(newQuestion,req.body.cat_id)
	try{
		const old_q=await Question.findById(req.params.id)
		const new_q=await Question.findByIdAndUpdate(req.params.id,newQuestion)
		let subcat1=await SubCategory.findById(old_q.sub_cat_id)
		subcat1.questions.splice(subcat1.questions.indexOf(req.params.id),1)
		await subcat1.save()
		let subcat2=await SubCategory.findById(new_q.sub_cat_id)
		subcat2.questions.push(req.params.id)
		await subcat2.save()
		var response = {
			response: "success",
			msg:"Your question has been updated.",
			id: req.params.id,
			href:'/questions'
		};
		res.send(response);
	}catch(err){
		throw new Error(err)
	}
	// Question.findByIdAndUpdate(req.params.id,newQuestion,(err,q)=>{
	// 	if(err){console.log(err)}
	// 	else{
	// 		SubCategory.findById(q.sub_cat_id,(err2,subcat1)=>{
	// 			if(err2){console.log(err2)}
	// 			else{
	// 				var i = subcat1.questions.indexOf(req.params.id)
	// 				subcat1.questions.splice(i,1)
	// 				subcat1.save((err3)=>{
	// 					if(err3){console.log(err3)}
	// 					else{
	// 					SubCategory.findById(newQuestion.sub_cat_id,(err4,subcat2)=>{
	// 						if(err4){console.log(err4);}
	// 						else{
	// 							subcat2.questions.push(q._id)
	// 							subcat2.save((err5)=>{
	// 								if(err5){console.log(err5)}
	// 								else{
	// 									var response = {
	// 										response: "success",
	// 										msg:"Your question has been updated.",
	// 										id: req.params.id,
	// 										href:'/questions'
	// 									};
	// 									res.send(response);
	// 								}
	// 							})
	// 						}
	// 					})
	// 					}
	// 				})
	// 			}
	// 		})
	// 	}
	// })
})
						// Used in //
router.get("/tests/usedin",(req,res)=>{
	Question.findOne({_id:req.query.qid},(err,Q)=>{
		if(err){
			console.log(err);
		}else{
			if(Q.used_in[0]){
				console.log("use:"+Q.used_in)
				var response = {
					response: "success",
					msg:"Here are the tests containing this question",
					id: req.params.id,
					lists:Q.used_in
				};
				res.send(response);
			}else{
					var response = {
						response: 'notests',
						msg:'notests',
					};
					res.send(response);
			}
		}
	})
})
			// Add Question from Bank to Test //
router.post("/questions/addQuestionsToTest/:id",(req,res)=>{
	Question.findById(req.params.id,(err,Q)=>{
		if(err){console.log(err)}
		else{
			Test.findById(req.body.test_id,(err,T)=>{
				if(err){console.log(err)}
				else{
					Q.used_in.push(T)
					Q.status="used"
					Q.save(err=>{
						T.questions.push(Q)
						T.save(err=>{
							var num_questions_in_test=T.questions.length;
							var response = {
								response: 'success',
								msg:'Question added to the Test',
								qid:req.params.id,
								test_id:req.body.test_id,
								num_questions_in_test:num_questions_in_test
							};
							res.send(response);
						})
					})
				}
			})
		}
	})
})
			// Remove Question from Test in Bank//
router.post("/questions/removeQuestionsFromTest/:id",(req,res)=>{
	Question.findById(req.params.id,(err,Q)=>{
		if(err){console.log(err)}
		else{
			Test.findById(req.body.test_id,(err,T)=>{
				if(err){console.log(err)}
				else{
					var i = T.questions.indexOf(Q._id)
					T.questions.splice(i,1)
					T.save((err3)=>{
						if(err3){console.log(err3)}
						else{
							var j=Q.used_in.indexOf(T._id)
							Q.used_in.splice(j,1)
							if(Q.used_in.length==0){
								Q.status="unused"
							}
							Q.save((err4)=>{
								if(err3){console.log(err3)}
								else{
						var num_questions_in_test=T.questions.length;
						var response = {
							response: 'success',
							msg:'Question Removed from the Test',
							qid:req.params.id,
							test_id:req.body.test_id,
							num_questions_in_test:num_questions_in_test
						};
						res.send(response);	
								}
							})
						}
					})
				}
			})
		}
	})
})

						//functions//
var checkAction=function(newQuestion){	
	if(newQuestion.type=="mcsa" || newQuestion.type=="mcma"){
		options=newQuestion.mc_options;
		// options.forEach(function(option){
		// 	if(option){					
		// 		question.mc_options.push("{answer:"+option+"}")
		// 		// options[index]="{answer:"+option+"}"
		// 	}	
		// 	return question.mc_options
		// })		
		return newQuestion.mc_options=[{answer:options[0]},{answer:options[1]},{answer:options[2]},{answer:options[3]},{answer:options[4]},{answer:options[5]},{answer:options[6]},{answer:options[7]},{answer:options[8]},{answer:options[9]}];
	}	
	if(newQuestion.type=="tf"){
		options=newQuestion.tf_options;
		return newQuestion.tf_options=[{answer:options[0]},{answer:options[1]}]	
	}
}
var makeDate = function(newQuestion){
	return newQuestion.createdAt=Date.now()
}
var editDate=function(newQuestion){
	return newQuestion.editedAt=Date.now()
}
var parseNum=function(newQuestion){
	// return newQuestion.points=parseFloat(newQuestion.points);
}
var makeCat=function(newQuestion,fullCat){
	var i=fullCat.indexOf("sc")
	var parent_cat_id=fullCat.slice(1,i)
	var sub_cat_id=fullCat.slice(i+2,fullCat.length)
	newQuestion.parent_cat_id=parent_cat_id
	newQuestion.sub_cat_id=sub_cat_id
	return newQuestion
}
var setUser=function(newQuestion,user){
	newQuestion.author={id:user._id,username:user.username};
	return newQuestion
}
module.exports=router;