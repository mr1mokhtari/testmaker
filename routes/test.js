var express			=require("express"),
	router			=express.Router(),
	moment			=require('moment-timezone'),
	
	bodyParser 		=require('body-parser'),
	url 			=require('url'),
	querystring 	=require('querystring'),
	
	mongoose		=require("mongoose"),
	Question		=require("../models/question"),
	ParentCategory	=require("../models/parentCategory"),
	SubCategory		=require("../models/subCategory"),
	Test		=require("../models/test"),
	Group		=require("../models/group"),
	Exam		=require("../models/exam"),
	Admin		=require("../models/admin"),
	Setting		=require("../models/setting"),
	
	flash		=require("connect-flash"),
	middleware	=require("../middleware/index"),
	
	methodOverride	=require("method-override"),
	expressSanitizer=require("express-sanitizer"),
	escapeRegex 	= require('../public/js/utilities/regex-escape');

router.use(methodOverride("_method"));
router.use(expressSanitizer());

//index: see all tests
router.get("/tests",middleware.isLoggedInTeacher, async (req, res, next) => {
	let query=req.query.filter_query,
		cat=req.query.cat_id,
		search={query:query,cat:cat}
	var page  = parseInt(req.query.page)||1; // page
	if(page<=0){page=1}
	const limit = parseInt(req.query.limit)||40; // results per page
	let newSearch={};
	newSearch={"author.username":req.user.username,"author.id":req.user.id}
	try {
		let teacher = await Admin.findById(req.user.id)
		if(query){newSearch.name=new RegExp(query,"i")}
		if(cat!='no_cat_filter'&&cat){	
			newSearch.sub_cat_id=cat
		}
		let numOfTs = await Test.count(newSearch);	
		let skipValue=(limit * page) - limit;
		if(skipValue<0){
				skipValue=0;//error yaz
		}
		const totalPages= Math.ceil(numOfTs / limit);
		if(page>totalPages) {page=totalPages;}
		// Find Demanded Products - Skipping page values, limit results       per page
		const foundTests = await Test.find(newSearch)
      		.skip(skipValue)
      		.limit(limit); //find ichinde bu var => name:regex
		const foundParentCategories=await ParentCategory.find({"author.username":req.user.username});
		const foundSubCategories=await SubCategory.find({"author.username":req.user.username});
		const groups = await Group.find({"author.username":req.user.username})
		
		var av={};
		for(var t of foundTests){
			for(var s of t.assignedSettings){
				var S = await Setting.findById(s)
				if(S.show_from!=undefined){av[s]=S.show_from}
				if(S.show_from_date!=undefined && S.show_from_date!=null){av[s]=checkDate(S.show_from_date, S.show_from_h, S.show_from_m, S.show_until_date, S.show_until_h, S.show_until_m)}
			}
		}
			// Renders The Page
			res.render('test/testIndex', {
   				tests: foundTests,
   				page: page,
				limit:limit,
   				totalPages: totalPages,
				search:search,
   				numOfTests: numOfTs,
				pcats:foundParentCategories,
				scats:foundSubCategories,
				groups:groups,
				teacher:teacher,
				av:av
  			});
	} catch (err) {
  		throw new Error(err);
	}
});

//New Test
router.get("/tests/test/new",middleware.isLoggedInTeacher,(req,res)=>{
	ParentCategory.find({"author.username":req.user.username},(err,foundParentCategories)=>{
		if(err){console.log(err)}
		else{
			SubCategory.find({"author.username":req.user.username},(err,foundSubCategories)=>{
				if(err){console.log(err)}
				else{
					Admin.findById(req.user.id,(err,teacher)=>{
						res.render("test/new",{pcats:foundParentCategories, scats:foundSubCategories, teacher:teacher})
					})
				}
			})
		}
	})
})
router.post("/tests/test/new",middleware.isLoggedInTeacher,(req,res)=>{
	var newTest=req.body.test;
	newTest.author={"username":req.user.username,"id":req.user._id}
	Test.create(newTest,(err,T)=>{
		if(err){console.log(err);}
		else{
			res.redirect("/tests/test/?test_id="+T._id+"&success=new")
		}
	})	
})
//Edit Test_name and Test Cat in Edit page
router.put("/tests/test/new",middleware.isLoggedInTeacher,(req,res)=>{
	var newTest=req.body.test;
	Test.findById(req.body.test_id,(err,T)=>{
		if(err){console.log(err);}
		else{
			T.test_name=req.body.test_name;
			T.sub_cat_id=req.body.sub_cat_id;
			T.save(err=>{
				// res.redirect("/tests/test/?test_id="+T._id+"&success=new&")
				var data = {
					response:"success",
					msg:"Introduction Comment has been added successfully.",
					href:'/',
					div_id:'tn'
				}
				res.send(data)
			})
		}
	})	
})
// Test Edit Page
router.get("/tests/test/",middleware.isLoggedInTeacher,(req,res)=>{
	let testId=req.query.test_id,
		newSuccess=req.query.success;
	if(!testId){
	   res.redirect("/tests")
	}else{
		ParentCategory.find({"author.username":req.user.username},(err,foundParentCategories)=>{
			if(err){console.log(err)}
			else{
				SubCategory.find({"author.username":req.user.username},(err,foundSubCategories)=>{
					if(err){console.log(err)}
					else{
						Test.findById(testId,(err,T)=>{
							if(err){console.log(err)}
							else{
	Question.find({"author.username":req.user.username,"used_in._id":testId},(err,foundQuestions)=>{
									if(err){console.log(err)}
									else{
										Admin.findById(req.user.id,(err,teacher)=>{
											res.render("test/new2",{testId:testId,test:T,pcats:foundParentCategories, scats:foundSubCategories, questions:foundQuestions, teacher:teacher})	
										})
									}
								})

							}
						})
					}
				})
			}
		})
	}	   
})
///Add introduction to test
router.post("/tests/test/editTestComments/:id",middleware.isLoggedInTeacher,(req,res)=>{
	Test.findById(req.params.id,(err,T)=>{
		if(err){console.log(err)}
		else{			
			T.test_comments=req.body.test_comments
			T.save(err=>{
				var response = {
					response: "success",
					msg:"Introduction Comment has been added successfully.",
				}
				res.send(response)
			})
		}
	})
})
//Remove Test
router.delete("/tests/test/:id",middleware.isLoggedInTeacher,(req,res)=>{
	Test.findByIdAndRemove(req.params.id,(err,T)=>{
		if(err){console.log(err)}
		else{
			var response = {
				response: "success",
				msg:"Your Test has been deleted..",
				href:"/tests"
			}
			res.send(response)
		}
	})
})

//Random options
router.put("/tests/test/editRandomQuestions",(req,res)=>{
	let test_id=req.body.test_id,
		random_option=req.body.random_option,
		order_by_cat_id=req.body.order_by_cat_id,
		num_random=req.body.num_random,
		selected_subcat=req.body.cat_id,
		qnum_in_selected_subcat=req.body.qnum,
		selected_subcat2=req.body.cat_id2,
		static_questions_position=req.body.static_questions_position;
	if(random_option=='option1'){
		Test.findById(test_id,(err,T)=>{
			if(err){console.log(err)}
			else{
				if(num_random && !selected_subcat){
					 res.locals.error = req.flash("error"," Random question settings were not set. Make sure you select all applicable options and try again.");
					res.redirect("/tests/test/?test_id="+test_id)
				}else{
					T.random_option=random_option;
					T.random_1_num=num_random;
					T.random_1_cats=selected_subcat;
					T.random_2_cats=[];
					T.random_2_num=[];
					T.static_questions_position=static_questions_position;
					T.save((err)=>{
						if(err){console.log(err)}
						else{
							res.locals.success=req.flash("success","Your random question settings have been saved.")
							res.redirect("/tests/test/?test_id="+test_id)
						}
					})
				}
			}
		})
	}else if(random_option=='option2'){
		Test.findById(test_id,(err,T)=>{
			T.random_option=random_option;
			T.random_2_cats=selected_subcat2;
			T.random_2_num=qnum_in_selected_subcat;
			T.random_1_num="";
			T.random_1_cats=[];
			T.save((err)=>{
				if(err){console.log(err)}
				else{
					res.locals.success=req.flash("success","Your random question settings have been saved.")
					res.redirect("/tests/test/?test_id="+test_id)
				}
			})
		})
	}else if(random_option=='cancel'){
		Test.findById(test_id,(err,T)=>{
			T.random_option=T.random_1_num=""
			T.random_1_cats=T.random_2_cats=T.random_2_num=[];
			T.save((err)=>{
				if(err){console.log(err)}
				else{
					res.locals.success = req.flash("success","Your random question settings have been removed from this Test.");
					res.redirect("/tests/test/?test_id="+test_id)
				}
			})
		})
	}
})

router.get('/results/tests/test/rgusers/', middleware.isLoggedInTeacher, async(req,res,next)=>{
	let test_id	=req.query.test_id,
		rg_id	=req.query.rg_id,
		return0	=req.query.return
	try{
		let group 	= await Group.findById(rg_id),
			test	= await Test.findById(test_id),
			teacher	= await Admin.findById(req.user.id),
			setting	= await Setting.find({forTest:test_id,forGroup:rg_id}),
			foundExams	= await Exam.find({forTest:test_id,forGroup:rg_id})
		var storage=[];
		// group.students.forEach((st,i)=>{
		for(var st of group.students){
			let foundSt = await Admin.findById(st._id)
			// console.log(st)
			let foundStExams = await Exam.find({forStudent:st._id, forTest:test_id,forGroup:rg_id})
			storage.push({student:foundSt,exams:foundStExams})
		}

		res.render('results/tests',{storage:storage, group:group, test:test, teacher:teacher, setting:setting, moment:moment})
	}catch(err){
		throw new Error(err)
	}
})

module.exports=router;

	// function
function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay; 
}
var checkDate=function(fd,fh,fm,ud,uh,um){
	var currentDate=Date.now()
	var fromDate=Date.parse(fd)+((parseInt(fh)*3600)+(parseInt(fm)*60))*1000
	var untilDate=Date.parse(ud)+((parseInt(uh)*3600)+(parseInt(um)*60))*1000
	// console.log(fromDate+":"+currentDate+":"+untilDate)
	if(fromDate<currentDate && untilDate>currentDate){
		return "1"
	}else{
		return "0"
	}
}