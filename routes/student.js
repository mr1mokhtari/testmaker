var express	=require("express"),
	router	=express.Router(),
	Student	=require("../models/student"),
	methodOverride	=require("method-override"),
	expressSanitizer=require("express-sanitizer");
	
router.use(methodOverride("_method"));
router.use(expressSanitizer());
//index
router.get("/students",(req,res)=>{	
	Student.find({},(err,foundStudents)=>{
		if(err){console.log(err)}
		else{
			res.render("students/index",{students:foundStudents})
		}
	})
})
//new
router.get("/students/new",(req,res)=>{
	res.render("students/new")
})
//create
router.post("/students",(req,res)=>{
	var newStudent=req.body.newStudent;
	Student.create(newStudent,(err)=>{
		if(err){console.log(err)}
		else{
			res.redirect("/students")
		}		
	})
})
//show
router.get("/students/:id",(req,res)=>{
	Student.findById(req.params.id,(err,foundStudent)=>{
		if(err){console.log(err)}
		else{
			res.render("students/show",{student:foundStudent})
		}
	})
})
//update
router.get("/students/:id/edit",(req,res)=>{
	Student.findById(req.params.id,(err,foundStudent)=>{
		if(err){console.log(err)}
		else{
			res.render("students/edit",{student:foundStudent})
		}
	})	
})
router.put("/students/:id",(req,res)=>{
	req.body.student.body=req.sanitize(req.body.student.body)
	Student.findByIdAndUpdate(req.params.id,req.body.student,(err,st)=>{
		if(err){console.log(err)}
		else{
			res.redirect("/students/"+req.params.id)
		}
	})
})
//remove
router.delete("/students/:id",(req,res)=>{
	Student.findByIdAndRemove(req.params.id,(err)=>{
		if(err) {console.log(err)}
		else{
				res.redirect("/students")
			}
	})
})

module.exports=router;