var express	=require("express"),
	router	=express.Router(),
	passport=require("passport"),
	passportStudent=require("passport"),
	Admin	=require("../models/admin"),
	// Student	=require("../models/student"),
	Code	=require("../models/code"),
	Group	=require("../models/group"),
	flash	=require("connect-flash"),
	middleware=require("../middleware/index")

//root route
router.get("/", function(req, res){
    // res.render("landing");
	res.render("registerLogin/home");
});

//Register route
router.get("/register1",(req,res)=>{
	res.render("register")
})
router.post("/register1",(req,res)=>{
	var newAdmin =new Admin({username:req.body.username})
	Admin.register(newAdmin,req.body.password,(err,admin)=>{
		if(err){
			// req.flash("error",err.message)
			return res.render("register")
		}
		passport.authenticate("local")(req,res,()=>{
			// req.flash("success","Welcome "+admin.username)
			res.redirect("/teachers")
		})
	})
})
//Register Test Taker Reg Form
router.get("/register/online-test-taker/",(req,res)=>{
	res.render("registerLogin/registerTestTaker")
})
//Register Test Creator Reg Form
router.get("/register/online-test-creator/",(req,res)=>{
	if(req.query.education){
		res.render("registerLogin/registerEducator")
	}else if(req.query.business){
		res.render("registerLogin/registerBusiness")
	}
})
//Register Post Form
router.post("/register",(req,res)=>{
	var reg_type=req.body.reg_type,
		first	=req.body.first,
		last	=req.body.last,
		email	=req.body.email,
		country	=req.body.country,
		code	=req.body.serial,
		timezone=req.body.timezone,
		password=req.body.password;
	if(reg_type=="test_taker"){
		// Code.findOneAndDelete({code:code},(err,C)=>{
		Code.findOne({code:code},(err,C)=>{
			if(err){console.log(err)}
			else{
				if(C.code){
					var newStudent =new Admin({username:req.body.username,firstName:first,lastName:last,email:email,country:country, timezone:timezone, registeredAt:Date.now()})
					Admin.register(newStudent,password,(err,student)=>{
						if(err){
							req.flash("error",err.message)
							console.log(err)
							return res.redirect("/register/online-test-taker/")
						}else{
							newStudent.groups.push(C.group.id)
							newStudent.teacher={id: C.author.id,username: C.author.username}
							newStudent.save((err,data)=>{
								Group.findById(C.group.id,(err,fG)=>{
									if(err){console.log(err)}
									else{
										fG.students.push(newStudent)
										fG.save((err)=>{
											if(err){console.log(err)}
											else{
											passport.authenticate("local")(req,res,()=>{
												Code.findOneAndDelete({code:code},(err)=>{
													req.flash("success","Welcome dear "+student.username+"!")
													res.redirect("/")
												})
											})
											}
										})
									}
								})
							})
						}
					})
				}else{
					req.flash("error","Code invalid")
					return res.redirect("/register/online-test-taker/")
				}
			}
		})
	}else if(reg_type=="test_taker_by_admin"){
		let rg_id=req.body.rg_id,
			upload_order=req.body.upload_order,
			user_password=req.body.userpassword,
			language_codes=req.body.language_codes,
			timezone=req.body.timezone,
			// country	=req.body.country,
			multi_users=req.body.multi_users,
			email_admin=req.body.email_id_for_sending_all_details_to,
			email_users=req.body.email_users;

		var row= multi_users.split("\r\n")
		row.forEach((r,i)=>{
			if(r[1]){
				var user=r.split(",")
				if(upload_order=="fle"){
					var first=user[0],
						last=user[1],
						email=user[2]
				}else if(upload_order=="lfe"){
					var first=user[1],
						last=user[0],
						email=user[2]
				}
				var username=last+makeid(5),
					password=makeid(8)
				var newStudent2 ={
					username:username, firstName:first, lastName:last, email:email, language:language_codes, timezone:timezone,
					// password:user_password,
					teacher:{id: req.user._id,username: req.user.username}, groups:[rg_id], registeredAt:Date.now()}
				Admin.register(newStudent2,user_password,(err,student)=>{
					if(err){
						req.flash("error",err.message)
						console.log(err)
						res.redirect("/tests/groups/edit/?group_id="+rg_id)
					}else{
						Group.findById(rg_id,(err8,G)=>{
							if(err8){console.log(err8)}
							else{
								G.students.push( {_id:student._id, username:student.username, firstName:student.firstName, lastName:student.lastName, email:student.email, language:student.language, registeredAt:student.registeredAt, lastLogin:student.lastLogin
								 })
								G.save((err)=>{
								if(i+1==row.length){
									res.redirect("/tests/groups/edit?group_id="+rg_id)
	
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
router.post("/register/checkUsername",(req,res)=>{
	let data=req.body.username
	Admin.findOne({username:data},(err,st)=>{
		if(err){console.log(err)}
		else if(!st){
			var response = {
				response: "success",
				msg:"You Can use this username"
			};
				res.send(response);
		}
		else{
			var response = {
				response: "fail",
				msg:"This username is already in use. Please enter another username",
				// id: req.params.id,
				// href:"/tests/categories"
			};
				res.send(response);
		}
	})
})
//Terms of Service
router.get("/online-testing/terms/",(req,res)=>{
	res.render("registerLogin/terms")
})
//Privacy Policy
router.get("/online-testing/privacy/",(req,res)=>{
	res.render("registerLogin/privacy")
})
//Terms USA
router.get("/online-testing/terms/usa-federal-agencies/",(req,res)=>{
	res.render("registerLogin/usTerms")
})
//Contact us
router.get("/online-testing/contact-us/",(req,res)=>{
	res.render("registerLogin/contactUs")
})
router.post("/online-testing/contact-us/",(req,res)=>{
	let contact_name=req.body.contact_name,
		contact_uname=req.body.contact_uname,
		contact_email=req.body.contact_email,
		active_status=req.body.active_status,
		contact_type=req.body.contact_type,
		subject=req.body.subject,
		body=req.body.body;
	res.send("post contact us form")
})
//User Manual
router.get("/online-testing/manual/",(req,res)=>{
	res.render("registerLogin/manual")
})
//FAQ
router.get("/online-testing/faq/",(req,res)=>{
	var query = req.body.query;
	
	res.render("registerLogin/faq")
})
//Login route
router.get("/login",(req,res)=>{
	res.render("login")
})
router.post("/login",passport.authenticate("local",{
	successRedirect:"/tests/",
	failureRedirect:"/login"	
}),(req,res)=>{})
router.post("/loginStudent",passport.authenticate("local",{
	successRedirect:"/u/groups",
	failureRedirect:"/login"	
}),(req,res)=>{})

//Logout route
router.get("/logout",middleware.isLoggedIn,(req,res)=>{
	req.logout()
	req.flash("success","Logged you out!")
	res.redirect("/")
}) 

						// Functions
function makeid(length) {
	var result		= '';
	var characters	= 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
module.exports=router;