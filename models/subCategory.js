var mongoose	=require("mongoose")

var subCategorySchema=new mongoose.Schema({
	cat_name:String,
	questions:[
		{
			type: mongoose.Schema.Types.ObjectId,
			reference:"question"
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

var SubCategory=mongoose.model("SubCategory",subCategorySchema);
module.exports=SubCategory;