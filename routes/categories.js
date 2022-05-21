var express			=require("express"),
	router			=express.Router(),
	
	bodyParser 		=require('body-parser'),
	url 			=require('url'),
	querystring 	=require('querystring'),
	
	mongoose		=require("mongoose"),
	ParentCategory	=require("../models/parentCategory"),
	SubCategory		=require("../models/subCategory"),
	Admin			=require('../models/admin'),
	
	flash			=require("connect-flash"),
	middleware		=require("../middleware/index"),
	
	methodOverride	=require("method-override"),
	expressSanitizer=require("express-sanitizer"),
	escapeRegex 	=require('../public/js/utilities/regex-escape');

router.use(methodOverride("_method"));
router.use(expressSanitizer());

//index: see all Parent and Sub Categories
router.get('/tests/categories',middleware.isLoggedInTeacher, (req,res)=>{
	let msg=req.query.msg
	ParentCategory.find({"author.username":req.user.username},(err,foundParentCats)=>{
		if(err){console.log(err)}
		else{
			SubCategory.find({"author.username":req.user.username},(err,foundSubCats)=>{
				if(err){console.log(err)}
				else{
					Admin.findById(req.user.id,(err,teacher)=>{
						res.render("categories/index",{pcats:foundParentCats,scats:foundSubCats, teacher:teacher, msg:msg})
					})
				}
			})
		}
	})	
})

//create: add new Parent Category
router.post("/tests/categories/parentcat",middleware.isLoggedInTeacher,(req,res)=>{	
	ParentCategory.findOne({parent_cat_name:req.body.parent_cat_name, "author.username":req.user.username}, (err,found)=>{
		if(err){
			console.log(err)
		}else{
			if(found){
				res.redirect("/tests/categories/?msg=missing_val")
			}else{
		ParentCategory.create({parent_cat_name:req.body.parent_cat_name,author:{id:req.user._id, username: req.user.username} },(err,newPC)=>{
					if(err){
						console.log(err)
						res.redirect("/tests/categories/?msg=failadd")
					}else{
						res.redirect("/tests/categories/?msg=successadd")
					}
				})
			}
		}
	})
})

//Add sub cat to the Parent Cat
router.post("/tests/categories/subcat",middleware.isLoggedInTeacher,async(req, res, next)=>{
	try{
		let pcat= await ParentCategory.findById(req.body.parent_cat_id),
			name_list={}, flag=0,rpc=req.body.rpc;
		for(var c of pcat.cat_name){
			name_list[c]=await SubCategory.findById(c)
			if(name_list[c].cat_name==req.body.cat_name){
				flag=1;
			}
		}
		if(flag){
			if(rpc){
				var response = {
					response: "error",
					msg:"The Category name has already been used. Select a Unique Category name and try again.",
				};
				res.send(response);
			}else{
				res.redirect("/tests/categories/?msg=missing_val")
			}
		}else{
			let subcat= await SubCategory.create({cat_name:req.body.cat_name, author:{id:req.user._id, username:req.user.username}})
			pcat.cat_name.push(subcat);
			await pcat.save();
			if(rpc){
				var response = {
					response: "success",
					msg:"New Category has been added.",
					parent_id:req.body.parent_cat_id,
					cat_id:subcat._id,
					cat_name:subcat.cat_name
				};
				res.send(response);
			}else{
				res.redirect("/tests/categories/?msg=successadd")
			}
		}
	}catch(err){
		throw new Error(err)
	}
})

//Remove Parent Cat
router.delete("/tests/categories/parentcat/:id",middleware.isLoggedInTeacher,(req,res)=>{
	var catId=req.params.id;
	ParentCategory.findById(catId,(err,cat)=>{
		if(cat.cat_name[0]){
			res.redirect("/tests/categories?msg=deleteerrorparentsubcats")
		}else{
			ParentCategory.findByIdAndRemove(catId,(err,task)=>{
				if(err){
					console.log(err)
					res.redirect("/tests/categories?msg=deletefail")
				}else{
					res.redirect("/tests/categories?msg=deletesuccess")
				}
			})
		}
	})	
})

//Remove Sub Cat 
router.delete("/tests/categories/subcat", middleware.isLoggedInTeacher, async (req,res,next)=>{
	var scat_id=req.body.scat_id;
	var pcat_id=req.body.pcat_id;
	try{
		let scat = await SubCategory.findById(scat_id)
		if(scat.questions[0]){
			res.redirect("/tests/categories?msg=deleteerrorquestions")
		}else{
			await SubCategory.findByIdAndRemove(scat_id)
			let pcat = await ParentCategory.findById(pcat_id)
			var ay = pcat.cat_name.indexOf(scat_id)
			pcat.cat_name.splice(ay,1)
			pcat = await pcat.save()
			res.redirect("/tests/categories?msg=deletesuccess")
		}
	}catch(err){
		throw new Error(err)
	}
})

//Edit Parent Cat
router.put("/tests/categories/parentcat",middleware.isLoggedInTeacher,(req,res)=>{
	var catId=req.body.parent_cat_idPUT;	
	ParentCategory.findOne({parent_cat_name:req.body.parent_cat_name, "author.username":req.user.username}, (err,found)=>{
		if(err){
			console.log(err)
		}else{
			if(found){
				var response = {
					response: "error",
					msg:"The Category name has already been used. Select a Unique Category name and try again.",
					id: req.params.id,
					href:"/tests/categories"
				};
				res.send(response);
			}else{
				ParentCategory.findById(catId,(err,cat)=>{
					if(err){console.log(err)}	
					else{
						cat.parent_cat_name=req.body.parent_cat_name
						ParentCategory.findByIdAndUpdate(catId,cat,(err)=>{
							if(err){console.log(err)}
							else{
								var response = {
								response: "success",
								msg:"Category name has  been edited successfully.",
								id: req.params.id,
								href:"/tests/categories"
							};
								res.send(response);
							}
						})
					}
				})
			}
		}
	})
})

//Edit Sub Cat
router.put("/tests/categories/subcat",middleware.isLoggedInTeacher,async(req, res, next)=>{
	var num=parseInt(req.body.parent_cat_idArray);
	
	try{
		
		let pcat= await ParentCategory.findById(req.body.parentCatId),
			pcat_new= await ParentCategory.findOne( {"author.username": req.user.username}).skip(num).limit(1),
			name_list={}, flag=0;
		for(var c of pcat_new.cat_name){
			name_list[c]=await SubCategory.findById(c)
			if(name_list[c].cat_name==req.body.cat_name){
				flag=1;
			}
		}
		if(flag){
			var response = {
				response: "error",
				msg:"The Category name has already been used. Select a Unique Category name and try again.",
				id: req.params.id,
				href:"/tests/categories"
			};
			res.send(response);
		}else{
			let subcat = await SubCategory.findById(req.body.subCatId)
			subcat.cat_name=req.body.cat_name
			await subcat.save()
			
			if(pcat_new._id!=pcat._id){
				pcat.cat_name.splice(pcat.cat_name.indexOf(req.body.subCatId),1)
				await pcat.save()
				pcat_new.cat_name.push(subcat)
				await pcat_new.save()	
			}
			
			var response = {
				response: "success",
				msg:"Subcategory has been edited successfully.",
				id: req.params.id,
				href:"/tests/categories"
			};
			res.send(response);
		}
	}catch(err){
		throw new Error(err)
	}
})
//Output ids as CSV
router.get('/tests/categories/ids/',async(req,res,next)=>{
	res.send('Will do this later')
})
						//functions//
module.exports=router;