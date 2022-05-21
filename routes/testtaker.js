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
	Test			=require("../models/test"),
	Group			=require("../models/group"),
	Setting			=require("../models/setting"),
	Admin			=require("../models/admin"),
	Exam			=require("../models/exam"),
	
	flash		=require("connect-flash"),
	middleware	=require("../middleware/index"),
	
	methodOverride	=require("method-override"),
	expressSanitizer=require("express-sanitizer"),
	escapeRegex 	= require('../public/js/utilities/regex-escape');

router.use(methodOverride("_method"));
router.use(expressSanitizer());

router.get("/u",middleware.isLoggedInStudent,async(req,res,next)=>{
	var tests=[],av=[];
	if(!req.query.group_id){return res.redirect("/u/groups")}
	try{
		const student = await Admin.findById(req.user.id)
		const teacher = await Admin.findById(student.teacher.id)
		var k=0
		// const student_groups=student.groups
		// for(const stg of student_groups){
			const stg=req.query.group_id //insted of finding all groups
			const group = await Group.findById(stg)
			const setting = await Setting.find({"forGroup":stg})
			for(const s of setting){
				const test = await Test.findById(s.forTest)
				// tests[k]={group:group,setting:s,test:test}
				tests.push(test)
				// k++
				
				////Found prev exams > extract percentage
				const found_prev_exams=await Exam.find({forStudent:req.user.id, forTest:test._id, forGroup:req.query.group_id})
				var prev_exams_results={}
				prev_exams_results[test._id]=[]
				found_prev_exams.forEach((fpe,i)=>{
					prev_exams_results[test._id][i]={perc:fpe.perc, t_point:fpe.t_point, total_points:fpe.points['total'], endTime:fpe.endTime, duration:secondsToHms((fpe.endTime-fpe.beginTime)/1000),exam_id:fpe._id}
				})
				
				if(s.show_from===undefined){
					av.push(checkDate(s.show_from_date, s.show_from_h, s.show_from_m, s.show_until_date, s.show_until_h, s.show_until_m))
				}else if(s.show_from_date===undefined){
					av.push=s.show_from
				}
			}
		// }

		res.render("u/home",{student:student,teacher:teacher, head:"tests", group:group , setting:setting, tests:tests, av:av, prev_exams_results:prev_exams_results, moment:moment})
	}catch(err){
		throw new Error(err);
	}
})

// User Details Page
router.get("/u/details",middleware.isLoggedInStudent,(req,res)=>{
	Admin.findById(req.user.id,(err,student)=>{
		res.render("u/details",{student:student,head:"details"})
	})
})
router.get("/u/groups",middleware.isLoggedInStudent,(req,res)=>{
	var foundGroups=[]
	
	Admin.findById(req.user.id,(err,student)=>{
		student.groups.forEach((g,i)=>{
			Group.findById(g,(err,group)=>{
				foundGroups.push(group)
				if(student.groups.length==i+1){
				
				var guess=moment(new Date())
				guess=guess.tz(student.timezone).format()
				student.lastLogin=Date.now();
					student.save(err=>{
						res.render("u/groups",{student:student , foundGroups:foundGroups, head:"groups", time:guess})
					})
				}
			})
		})
	})
})
router.post("/u/groups/changeGroup",middleware.isLoggedInStudent,(req,res)=>{
	var group_id=req.body.g_id
	res.redirect("/u?group_id="+group_id)
})
//Check Username availability
//It's already working!

// Change UserName and Password //changes in group!Don't Forget
router.put("/u/details/changeUserName",middleware.isLoggedInStudent,(req,res)=>{
	let change_username=req.body.change_username,
		change_password=req.body.change_password,
		password_current=req.body.password_current,
		pass1=req.body.pass1,
		pass2=req.body.pass2,
		username=req.body.username
	if(change_username=="1"){
		Admin.findOne({username:username},(err,st)=>{
			if(err){console.log(err)}
			else if(!st){
				Admin.findById(req.user.id,(err,student)=>{
					student.username=username
					student.save(()=>{
						req.login(student, function (err) {
                    		if (err) {
                      			res.status(400).send(err);
                    		} else {
								req.flash("success","The update was successful.")
								res.redirect("back")
                    		}
                  		});
					})
				})
			}else{
				req.flash("error","This username is already in use. Please enter another username")
				res.redirect("back")
			}
		})
	}else if(change_password=="1"){
		Admin.findById(req.user.id,(err,student)=>{
			if(student.authenticate(password_current)){
				if(pass1==pass2){
					student.changePassword(password_current,pass1,(err)=>{
						if (err) {
                  			return res.status(422).send(err);
                		} else {
                  			req.login(student, function (err) {
                    			if (err) {
                      				res.status(400).send(err);
                    			} else {
									req.flash("success","The update was successful.")
									res.redirect("back")
                    			}
                  			});
                		}   
					})
				}
			}else{
			   res.send("pass doesn't match")
			}
		})
	}
})
router.get("/test/start/",middleware.isLoggedInStudent,async(req,res,next)=>{
	var test_id=req.query.test_id,
		user_id=req.user.id
	try{
		var setting=await Setting.find({forTest:test_id}),
			test=await Test.findById(test_id),
			student=await Admin.findById(user_id),
			allowed
		
		//PROBLEM HEERE! SETTING-TEST PAIR IS NOT UNIQUE ///
		var s=setting[0]
		var practice=s.practice
		
		if(s.show_from_date){
			allowed=checkDate(s.show_from_date, s.show_from_h, s.show_from_m, s.show_until_date, s.show_until_h, s.show_until_m)
		}else{
			allowed=s.show_from
		}
		// console.log(allowed)
		if(allowed=="1" && parseInt(practice)>0 ){
			res.render("u/instruction",{s:s, setting:setting, practice:practice, test:test, student:student, head:""})
		}
	}catch(err){
		throw new Error(err)
	}
})
//Start Exam > Button in Instruction
router.post("/test",middleware.isLoggedInStudent,async(req,res,next)=>{
	const test_id=req.body.test_id,
		  setting_id=req.body.setting_id,
		  exam0={}
	try{
		const test = await Test.findById(test_id),
			  setting = await Setting.findById(setting_id),
			  last_exam = await Exam.findOne({ forStudent : req.user.id, forTest : test_id, forSetting : setting_id},{},{ sort: { '_id' : -1 }}),
			  rn = (new Date()).getTime()

		if(last_exam!=undefined) {
		   if(rn<parseInt(last_exam.endTime)){
			   res.redirect("/test/start2/?exam_id="+last_exam._id)
		   }
		}
		
		if(last_exam==undefined || rn>parseInt(last_exam.endTime)){
			exam0.qs=[]
			test.questions.forEach((q)=>{
				exam0.qs.push(q)	
			})
			if(test.random_option=='option1'){
				var qbank = [];
			   for(var cat_id of test.random_1_cats){
				  var category = await SubCategory.findById(cat_id)
				  category.questions.forEach((q)=>{
					 qbank.push(q) 
				  })
			   }
				var random_questions = fillrandom(qbank.length, parseInt(test.random_1_num))
				random_questions.forEach((q)=>{
					exam0.qs.push(qbank[q-1])	
				})
			}else if(test.random_option=='option2'){
				var k=0;
			   for(var cat_id of test.random_2_cats){
					var category = await SubCategory.findById(cat_id)
				  	var random_questions = fillrandom(category.questions.length, parseInt(test.random_2_num[k]))
					random_questions.forEach((q)=>{
						exam0.qs.push(category.questions[q-1])	
					})
				   k++
			   }
			}
			exam0.forStudent=req.user.id
			exam0.forTeacher=test.author.id
			exam0.forTest=test_id
			exam0.forSetting=setting_id
			exam0.forGroup=setting.forGroup
			exam0.time=setting.time_limit
			var right_now = new Date();
			exam0.beginTime = right_now.getTime();
			exam0.endTime = addMinutes(right_now, parseInt(setting.time_limit));
			exam0.time_left=parseInt(setting.time_limit)*60 //in seconds
			//total points
			exam0.t_point=0;
			for(const kl of exam0.qs){
				var qq = await Question.findById(kl)
				exam0.t_point+=parseInt(qq.points)
			}
			var exam = await Exam.create(exam0)
			res.redirect("/test/start2/?exam_id="+exam._id)
		}
	}catch(err){
		throw new Error(err)
	}
})
// Gets the first page of exam
router.get("/test/start2",middleware.isLoggedInStudent,async(req,res,next)=>{
	var exam_id = req.query.exam_id
	var page  = parseInt(req.query.page)||1; //page
	try{
		var exam = await Exam.findById(exam_id)
		var student = await Admin.findById(req.user.id)
		var setting = await Setting.findById(exam.forSetting)
		
		if((new Date()).getTime() > parseInt(exam.endTime) ){
		   res.redirect("/u?group_id="+exam.forGroup)
		}else{
			exam.time_left = (parseInt(setting.time_limit)*60) - parseInt(((new Date()).getTime()-exam.beginTime)/1000);
			exam = await exam.save()
			
			const qs_in_page = set_questions_per_page(page,exam,setting)
			var Qpack=[]
			for(const q of qs_in_page){
				var Q= await Question.findById(q)
				Qpack.push(Q)
			}
			res.render("u/exam",{student:student, head:"", Qpack:Qpack, exam:exam, setting:setting, page:page})
		}
	}catch(err){
		throw new Error(err)
	}
})

router.post("/test/start2",middleware.isLoggedInStudent,async(req,res,next)=>{
	var exam_id = req.query.exam_id,
		finish	= req.query.finish;
	var page  = parseInt(req.query.page)||1; //page
	try{
		var exam = await Exam.findById(exam_id)
		var student = await Admin.findById(req.user.id)
		var setting = await Setting.findById(exam.forSetting),
			test = await Test.findById(exam.forTest),
			group = await Group.findById(setting.forGroup)
		
		if( (new Date()).getTime()>parseInt(exam.endTime) ){
		   // res.redirect("/u?group_id="+exam.forGroup)
			exam.time_left =0;
			exam = await exam.save()
			return res.redirect("/test/finish/?exam_id="+exam._id)
		}
		
		exam.time_left = (parseInt(setting.time_limit)*60) - parseInt(((new Date()).getTime()-exam.beginTime)/1000);
		exam = await exam.save()
		
		var cntr = exam.cntr
		//Get & Save answers here
		if(exam.answers==undefined){
			var ind={}
		}else{
			var ind=exam.answers
		}
		var pg = req.body.page,
			qpp = setting.questions_displayed_per_page,
			answer = req.body.answer
		if(answer!=undefined){
			cntr++
			var keys = Object.keys(answer)
			keys.forEach((key,k)=>{
				var z = key.indexOf("_")
				if(key.slice(0,z)!="mcma"){
					ind[key.slice(z+1)]=Object.values(answer)[k];
				}else{
					var zz = key.lastIndexOf("_")
					if(ind[key.slice(z+1,zz)]==undefined){
						ind[key.slice(z+1,zz)]={choices:[],code:cntr}
					}else if(ind[key.slice(z+1,zz)].code!=cntr){
						ind[key.slice(z+1,zz)]={choices:[],code:cntr}
					}
					ind[key.slice(z+1,zz)].choices.push( Object.values(answer)[k]);
				}
			})
			exam.cntr = cntr
			exam.answers=ind
			exam.markModified("answers")
			exam = await exam.save()
		}
		if(finish!=undefined){
			exam.endTime = (new Date()).getTime()
			exam.time_left = 0
			//point area
			let answered_questions= Object.keys(exam.answers),
				answer_keys	= Object.values(exam.answers),
				points = {}
			points["total"]=0
			for(const qid of answered_questions){
				let q = await Question.findById(qid)
				if(q.type=="tf"){
					if( q.tf_correct[0] == answer_keys[ answered_questions.indexOf(qid) ]){
						points[qid]=parseFloat(q.points)
					}else{
						points[qid]=0
					}
				}else if(q.type=="mcsa"){
					if( q.mc_correct == exam.answers[qid]){
						points[qid]=parseFloat(q.points)
					}else{
						points[qid]=0
					}
				}else if (q.type=="p"){
					if( q.p_correct == exam.answers[qid]){
						points[qid]=parseFloat(q.points)
					}else{
						points[qid]=0
					}
				}else if(q.type=="ft" && exam.answers[qid]!=""){
					var flg=0;
					q.ft_correct.forEach((ft_ch)=>{
						if(ft_ch!=""){
							ft_ch=ft_ch.toUpperCase();
						if(exam.answers[qid].toUpperCase().indexOf(ft_ch)>=0){
								flg++
							}
						}
					})
					if( flg>0 ){
						points[qid]=parseFloat(q.points)
					}else{
						points[qid]=0
					}
				}else if(q.type=="mcma"){
					var pnt = 0, npnt=0
					for(const ch of q.mc_correct){
						if(exam.answers[qid].choices.indexOf( (ch).toString() )>=0){
							pnt++
							npnt++
						}else{
							npnt--
						}
					}
					if(q.grade_style=="2"){
						//partial points without deduction
						points[qid]=(parseFloat(q.points))*(pnt/((q.mc_correct).length))
					}else if(q.grade_style=="1"){
						//partial points with deduction
						if(npnt<0){npnt=0}
						points[qid]=(parseFloat(q.points))*((npnt)/((q.mc_correct).length))
					}else if(q.grade_style=="0"){
						//No partial points
						if(pnt==(q.mc_correct).length){
							points[qid]=parseFloat(q.points)
						}else{
							points[qid]=0
						}
					}
				}
			}
			/// Current Exam Percentage
			var tot=0;
			var points_array=Object.values(points);
			points_array.forEach((pp)=>{tot+=pp});
			points["total"]=tot;
			exam.perc=((tot/exam.t_point)*100).toFixed(2);
			//// Add points
			exam.points=points
			exam.markModified("points")
			exam = await exam.save()
			res.redirect('/test/results?test_id='+exam_id)
		}else{
			const qs_in_page = set_questions_per_page(page,exam,setting)
			var Qpack=[]
			for(const q of qs_in_page){
				var Q= await Question.findById(q)
				Qpack.push(Q)
			}
			res.render("u/exam",{student:student, head:"", Qpack:Qpack, exam:exam, setting:setting, page:page})
		}
	}catch(err){
		throw new Error(err)
	}
})

router.post('/tests/rpc/editPoints',middleware.isLoggedInTeacher, async(req,res,next)=>{
	const exam_id = req.body.tid,
		  question_id = req.body.question_id;
	try{
		let exam = await Exam.findById(exam_id);
		var prev='0';
		if(exam.points[question_id]!=undefined){
			prev= exam.points[question_id]
		}
		exam.points[question_id] = parseFloat(req.body.points)
		exam.points['total']=parseFloat(exam.points['total'])-parseFloat(prev)+parseFloat(req.body.points);
		exam.perc=((parseFloat(exam.points['total'])*100)/exam.t_point).toFixed(2)
		exam.markModified("points")
		exam = await exam.save()
		var data={
			response:'success',
			new_score:{
				qid:question_id,
				qpoints:exam.points[question_id],
				score:exam.perc,
				points_scored:exam.points['total'],
				points_available:exam.t_point
			}
		}
		res.send(data)
	}catch(err){
		throw new Error(err)
	}
})

router.get("/test/results",middleware.isLoggedIn,async(req,res,next)=>{
	var exam_id = req.query.test_id,
		t		=req.query.t

	try{
		var exam = await Exam.findById(exam_id)
		var student = await Admin.findById(exam.forStudent)
		var setting = await Setting.findById(exam.forSetting),
			test = await Test.findById(exam.forTest),
			group = await Group.findById(setting.forGroup)
		
			var qppp=[]
			for(const qp of exam.qs){
				qpp = await Question.findById(qp)
				qppp.push(qpp)
			}
			////Found prev exams > extract percentage
			const found_prev_exams=await Exam.find({forStudent:exam.forStudent, forTest:exam.forTest, forGroup:exam.forGroup})
			var prev_exams_results=[]
			found_prev_exams.forEach((fpe,i)=>{
				prev_exams_results[i]=fpe.perc
			})

			res.render("u/result",{student:student, head:"", exam:exam, setting:setting, test:test, group:group, duration:secondsToHms((exam.endTime-exam.beginTime)/1000), questions:qppp, found_prev_exams:prev_exams_results, moment:moment, t:t})
			// res.redirect("/test/results")
	}catch(err){
		throw new Error(err)
	}
})

						// Functions
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
var addMinutes = function(rn,m) {
	var time=(rn.getTime() + (m*60*1000))
  return time;
}
function fillrandom(catl,sl) {
	var result		= [];
   for ( var i = 0; i < sl; i++ ) {
      var rand= (Math.ceil(Math.random() * catl));
	  if(result.indexOf(rand)<0){
		result.push(rand);  
	  }else{i--;}
   }
   return result;
}
function set_questions_per_page(page,exam,setting){
			if(page<=0){page=1}
			let limit = parseInt(setting.questions_displayed_per_page);//QsPerPg
			let numOfQs = exam.qs.length
			const totalPages= Math.ceil(numOfQs / limit);
			if(page>totalPages) {page=totalPages;}
			let skipValue=(limit * page) - limit;
			if(skipValue<0){
					skipValue=0;//error yaz
			}
			const qs_in_page = exam.qs.slice(skipValue,skipValue+limit)
			return qs_in_page
}
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
module.exports=router;