var mongoose	=require("mongoose")

var questionSchema=new mongoose.Schema({
	type:String,
	question:String,
	mc_options:[
		{answer:String},
		{answer:String},
		{answer:String},
		{answer:String},
		{answer:String},
		{answer:String},
		{answer:String},
		{answer:String},
		{answer:String},
		{answer:String}
	],
	mc_correct:[],
	//mc settings start
	random_a:Number,
	radio_or_checkbox_not_used:Number,
	grade_style:Number,
	//mc settings end
	tf_options:[
		{answer:String},
		{answer:String}
	],
	tf_correct:[],
	ft_correct:[],
	p_incorrect:String,
	p_correct:String,
	course:String, //?????
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Admin"
		},
		username:String
	},
	used_in:[
		{id:{
			type: mongoose.Schema.Types.ObjectId,
			reference:"test"
		},
		test_name:String}
	],
	createdAt:Date,
	editedAt:Date,
	points:String,
	sub_cat_id:String,
	parent_cat_id:String,
	status:{type:String, default:"unused"},
	correct_feedback:String,
	incorrect_feedback:String,
	//matching
	p_score:[],
	n_score:[],
	matching_query:[],
	matching_dropdown:[],
	matching_input:[],
	matching_option:[],
	matching_incorrect_input:[],
	matching_incorrect_option:[]
})
questionSchema.index({name:'text'})
var Question=mongoose.model("Question",questionSchema);
module.exports=Question;