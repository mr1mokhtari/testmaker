var Question 	=require("../models/question"),
	Test		=require("../models/test"),
	Admin		=require("../models/admin")

//All middlewares go here
var middlewareObj={}

middlewareObj.checkQuestionOwnership=function(req,res,next){
	if(req.isAuthenticated){
		Question.findById(req.params.id,(err,foundQuestion)=>{
			if(err){
				req.flash("error","Question not found")
				res.redirect("back")
			}else{
				if(foundQuestion.teacher.id.equals(req.user._id)){
					next()
				}else{
					req.flash("error","You don't have permission to do this")
					res.redirect("back")
				}
			}
		})
	}else{
		req.flash("error","You need to be logged in to do that.")
		res.redirect("back")
	}
}

middlewareObj.checkExamOwnership=function(req,res,next){
	if(isAuthenticated){
		Test.findById(req.params.id,(err,foundTest)=>{
			if(err){
				req.flash("error","Test not found")
				res.redirect("back")
			}else{
				if(foundTest.teacher.id.equals(req.user._id)){
					next()
				}else{
					req.flash("error","You don't have permission to do this")
					res.redirect("back")
				}
			}
		})
	}else{
		req.flash("error","You need to be logged in to do that.")
		res.redirect("back")
	}
}

middlewareObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}else{
		req.flash("error","You need to be logged in to do that.!!!")
		res.redirect("/login")
	}
}
middlewareObj.isLoggedInStudent=function(req,res,next){
	if(req.isAuthenticated()){
		Admin.findById(req.user._id,(err,student)=>{
			if(err){console.log(err)}
			else{
				// if(student.isStudent=="1"){
				if(student.teacher.id){
					return next()
				}else{
					res.redirect("back")
				}
			}
		})
	}else{
		req.flash("error","You need to be logged in to do that.!!!")
		res.redirect("/login")
	}
}
middlewareObj.isLoggedInTeacher=function(req,res,next){
	if(req.isAuthenticated()){
		Admin.findById(req.user._id,(err,teacher)=>{
			if(err){console.log(err)}
			else{
				if(!teacher.teacher.id){
					return next()
				}else{
					res.redirect("back")
				}
			}
		})
	}else{
		req.flash("error","You need to be logged in to do that.!!!")
		res.redirect("/login")
	}
}

module.exports=middlewareObj;