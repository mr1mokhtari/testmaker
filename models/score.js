var mongoose	=require("mongoose");

var scoreSchema	=new mongoose.Schema({
	email:String,
	name:String,
	
	score:Number,
	
	rank:Number
})

var Score=mongoose.model("Score",scoreSchema);
module.exports=Score;