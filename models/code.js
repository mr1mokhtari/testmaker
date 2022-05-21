var mongoose	=require("mongoose");
var codeSchema	=new mongoose.Schema({
	code:String,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Admin"
		},
		username:String
	},
	group:{
		id:{
			type: mongoose.Schema.Types.ObjectId,
			reference:"Group"
		},
		group_name:String
	},
	createdAt:Date,
});
var Code=mongoose.model("Code",codeSchema);
module.exports=Code;