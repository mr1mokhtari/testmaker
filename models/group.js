var mongoose	=require("mongoose");

var groupSchema	=new mongoose.Schema({
	group_name:String,
	group_message:String,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Admin"
		},
		username:String
	},
	language:String,
	country:String,
	members_access_to_group:String,
	students:[
		{
			id:String,
			// {
			// 	type: mongoose.Schema.Types.ObjectId,
			// 	reference:"Students"
			// },
			username:String,
			firstName:String,lastName:String,
			email:String,language:String,
			registeredAt:Date,lastLogin:Date
		}
	],
	createdAt:Date,
	editedAt:Date,
});

var Group=mongoose.model("Group",groupSchema);
module.exports=Group;