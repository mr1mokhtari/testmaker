var mongoose	=require("mongoose");

var testSchema	=new mongoose.Schema({
	test_name:String,
	test_comments:String,
	questions:[
		{
			type: mongoose.Schema.Types.ObjectId,
			reference:"question"
		}
	],
	random_option:String,
	random_1_num:String,
	random_1_cats:[],
	random_2_num:[Number],
	random_2_cats:[],
	static_questions_position:String,
	//////////
	// qnum:Number,
	// q:String,
	// options:[{answer:String},{answer:String},{answer:String},{answer:String}],
	// selected:Number,
	// correct:Number,
	// correctFlag:Boolean,
	//////////
	assignedGroups:[String],
	assignedSettings:[String],
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Admin"
		},
		username:String
	},
	////////
	sub_cat_id:String,
	parent_cat_id:String,
	createdAt:Date,
	editedAt:Date,
});

var Test=mongoose.model("Test",testSchema);
module.exports=Test;