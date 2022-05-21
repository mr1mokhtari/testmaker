var mongoose	=require("mongoose");
var examSchema	=new mongoose.Schema({
	forStudent:String,
	forTeacher:String,
	forTest:String,
	forSetting:String,
	forGroup:String,
	qs:[String
		// {
		// 	type: mongoose.Schema.Types.ObjectId,
		// 	reference:"Question"
		// }
	],
	answers:{type:mongoose.Schema.Types.Mixed, default:{}},
	points:{type:mongoose.Schema.Types.Mixed, default:{}},
	t_point:Number,
	time:String,
	beginTime:String,
	endTime:String,
	time_left:String,
	cntr:{type:Number, default:0},
	perc:String
});
var Exam=mongoose.model("Exam",examSchema);
module.exports=Exam;