var mongoose=require("mongoose"),
	passportLocalMongoose=require("passport-local-mongoose")

var adminSchema=new mongoose.Schema({
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
	lastLogin:Date,
	timezone:String,
	// isStudent:String
})
adminSchema.plugin(passportLocalMongoose)
var Admin=mongoose.model("Admin",adminSchema)
module.exports=Admin;