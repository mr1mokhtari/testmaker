var mongoose	=require("mongoose"),
	passportLocalMongoose=require("passport-local-mongoose");

var studentSchema	= new mongoose.Schema({
	firstName:{type:String, required:true},
	lastName:{type:String, required:true},
	email:{type:String, required:true, unique: true},
	username:{type:String, required:true, unique: true},
	password:{
		type:String,
		// required:true
	},
	country:{type:String},
	language:{type:String},
	teacher:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Admin"
			// required:true
		},
		username:String
	},
	groups:[],
	registeredAt:Date,
	lastLogin:Date
});
studentSchema.plugin(passportLocalMongoose);
Student=mongoose.model("Student",studentSchema);
module.exports=Student;
	