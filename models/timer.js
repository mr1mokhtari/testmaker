var mongoose	=require("mongoose");

var timerSchema	=new mongoose.Schema({
	time:Number
})

var Timer=mongoose.model("Time",timerSchema);
module.exports=Timer;