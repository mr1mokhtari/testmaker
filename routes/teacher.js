var express	=require("express"),
	router	=express.Router(),
	Teacher	=require("../models/teacher"),
	Student	=require("../models/student"),
	expressSanitizer	=require("express-sanitizer"),
	methodOverride		=require("method-override")

//index page
router.get("/teachers",(req,res)=>{
	Teacher.find({},(err,foundTeachers)=>{
		if(err){console.log(err)}
		else{
			res.render("teachers/index",{teachers:foundTeachers})
		}
	})
})
//new & create
router.get("/teachers/new",(req,res)=>{
	res.render("teachers/new")
})
router.post("/teachers",(req,res)=>{
	var newT = req.body.newTeacher
	newT.email=req.sanitize(newT.email);
	newT.password=req.sanitize(newT.password);
	// newT.fname=req.sanitize(newT.fname);
	// newT.lname=req.sanitize(newT.lname);
	console.log(newT)
	
	Student.findOne({email:req.body.student},(err,foundStudent)=>{
		if(err){console.log(err)}
		else{
			newT.students=foundStudent
			Teacher.create(newT,(err,newTeacher)=>{
				if(err){console.log(err)}
				else{
					// console.log(newTeacher)
					res.redirect("/teachers")
				}
			})
		}
	})
})
//show
router.get("/teachers/:id",(req,res)=>{
	Teacher.findById(req.params.id,(err,foundTeacher)=>{
		if(err){console.log(err)}
		else{
			res.render("teachers/show",{teacher:foundTeacher})
		}
	})
})
//update
router.get("/teachers/:id/edit",(req,res)=>{
	Teacher.findById(req.params.id,(err,foundTeacher)=>{
			console.log(foundTeacher)
		Student.findById(foundTeacher.students,(err,foundStudent)=>{
			console.log(foundStudent)
			res.render("teachers/edit",{teacher:foundTeacher,st:foundStudent})	
		})
	})
})
router.put("/teachers/:id",(req,res)=>{
	req.body.teacher.email=req.sanitize(req.body.teacher.email)
	req.body.teacher.student=req.sanitize(req.body.teacher.student)
	// req.body.teacher.fname=req.sanitize(req.body.teacher.fname)
	// req.body.teacher.lname=req.sanitize(req.body.teacher.lname)
	Student.findOne({email:req.body.teacher.student},(err,foundStudent)=>{
		if(err){console.log(err)}
		else{
			req.body.teacher.students=foundStudent
		Teacher.findByIdAndUpdate(req.params.id,req.body.teacher,(err,editedTeacher)=>{
			if(err){console.log(err)}
			else{
				res.redirect("/teachers")
			}
		})
	}})
})

//remove
router.delete("/teachers/:id",(req,res)=>{
	Teacher.findByIdAndRemove(req.params.id,(err)=>{
		if(err){console.log(err)}
		else{
			res.redirect("/teachers")
		}
	})
})

module.exports=router;