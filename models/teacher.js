var mongoose	=require("mongoose")

var teacherSchema=new mongoose.Schema({
	fname:String,
	lname:String,
	email:String,
	password:String,
	created: {type: Date, default: Date.now},
	students:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Student"
		}
	],
	questions:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Question"
		}
	],
	course:String
})

var Teacher=mongoose.model("Teacher",teacherSchema);
module.exports=Teacher;