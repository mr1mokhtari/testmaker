var express		=require("express"),
	app			=express(),
	bodyParser	=require("body-parser"),
	mongoose	=require("mongoose"),
	methodOverride	=require("method-override"),
	flash		=require("connect-flash"),
	// path		=require("path"),
	passport	=require("passport"),
	// passportStudent	=require("passport"),
	localStrategy=require("passport-local"),
	// localStrategyStudent=require("passport-local"),
	
	Score		=require("./models/score"),
	Test		=require("./models/test"),
	Time		=require("./models/timer"),
	Teacher		=require("./models/teacher"),
	Student		=require("./models/student"),
	Question	=require("./models/question"),
	Admin		=require("./models/admin"),
	// Category	=require("./models/category"),
	ParentCategory	=require("./models/parentCategory"),
	SubCategory	=require("./models/subCategory"),
	Code	=require("./models/code"),
	Setting	=require("./models/setting"),
	Exam	=require("./models/exam"),
	//requiring routes
	studentRoute=require("./routes/student"),
	teacherRoute=require("./routes/teacher"),
	indexRoute	=require("./routes/index"),
	questionRoute	=require("./routes/question"),
	categoriesRoute	=require("./routes/categories"),
	testRoute	=require("./routes/test"),
	groupRoute	=require("./routes/group"),
	assignRoute	=require("./routes/assign"),
	testtakerRoute	=require("./routes/testtaker"),
	jqmrpc	=require("./routes/jqmrpc")


app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
mongoose.connect("mongodb://localhost:27017/zexam_v1",{useNewUrlParser:true, useUnifiedTopology:true,useFindAndModify:false});
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash())

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "this project leads to happiness and wellbeing!",
	resave:false,
	saveUninitialized:false
}))
app.use(passport.initialize())
// app.use(passportStudent.initialize())
app.use(passport.session())
// app.use(passportStudent.session())
passport.serializeUser(Admin.serializeUser())
passport.deserializeUser(Admin.deserializeUser())
// passportStudent.serializeUser(Student.serializeUser())
// passportStudent.deserializeUser(Student.deserializeUser())
//admin login
passport.use(new localStrategy(Admin.authenticate()));
// passportStudent.use(new localStrategyStudent(Student.authenticate()));

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(studentRoute)
app.use(teacherRoute)
app.use(indexRoute)
app.use(questionRoute)
app.use(categoriesRoute)
app.use(testRoute)
app.use(groupRoute)
app.use(assignRoute)
app.use(testtakerRoute)
app.use(jqmrpc)
app.listen(process.env.PORT||"3001",()=>{
	console.log("Server is running")
})