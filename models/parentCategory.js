var mongoose	=require("mongoose")

var parentCategorySchema=new mongoose.Schema({
	parent_cat_name:String,
	cat_name:[
		{
			type: mongoose.Schema.Types.ObjectId,
			reference:"SubCategory"
		}
	],
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Admin"
		},
		username:String
	}
})

var ParentCategory=mongoose.model("ParentCategory",parentCategorySchema);
module.exports=ParentCategory;