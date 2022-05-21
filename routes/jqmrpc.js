var express			=require("express"),
	router			=express.Router(),
	
	bodyParser 		=require('body-parser'),
	url 			=require('url'),
	querystring 	=require('querystring'),
	
	mongoose		=require("mongoose"),
	ParentCategory	=require("../models/parentCategory"),
	SubCategory		=require("../models/subCategory"),
	Group		=require("../models/group"),
	Setting		=require("../models/setting"),
	Test		=require("../models/test"),
	Code		=require("../models/code"),
	
	flash			=require("connect-flash"),
	middleware		=require("../middleware/index"),
	
	methodOverride	=require("method-override"),
	expressSanitizer=require("express-sanitizer"),
	escapeRegex 	=require('../public/js/utilities/regex-escape');

router.use(methodOverride("_method"));
router.use(expressSanitizer());

//V2 //index: see all Parent and Sub Categories
router.get('/tests/rpc/editCategory',middleware.isLoggedInTeacher, (req,res)=>{
	ParentCategory.find({"author.username":req.user.username},(err,foundParentCats)=>{
		if(err){console.log(err)}
		else{
			SubCategory.find({"author.username":req.user.username},(err,foundSubCats)=>{
				if(err){console.log(err)}
				else{
					res.render("jqmrpc/editCategory",{pcats:foundParentCats,scats:foundSubCats})
				}
			})
		}
	})	
})
//UPload Files
router.get('/tests/rpc/fileSelector',middleware.isLoggedInTeacher, (req,res)=>{
	ParentCategory.find({"author.username":req.user.username},(err,foundParentCats)=>{
		if(err){console.log(err)}
		else{
			SubCategory.find({"author.username":req.user.username},(err,foundSubCats)=>{
				if(err){console.log(err)}
				else{
					res.render("jqmrpc/fileSelector",{pcats:foundParentCats,scats:foundSubCats})
				}
			})
		}
	})	
})
// Symbols
router.get('/tests/rpc/symbols',middleware.isLoggedInTeacher,(req,res)=>{
	res.render('jqmrpc/symbols')
})
// Question Examples
router.get('/tests/rpc/questionExamples',middleware.isLoggedInTeacher,(req,res)=>{
	res.render('jqmrpc/questionExamples')
})
//overlay
router.get('/tests/rpc/misc.rpc', middleware.isLoggedInTeacher, async(req,res,next)=>{
	let existing_settings=req.query.assign_use_existing_group_test_settings
	try{
		if(existing_settings=='1'){
			let groups= await Group.find({"author.username":req.user.username})
			let tests= await Test.find({"author.username":req.user.username})
			var list = {}
			for(var g of groups){
				var settings= await Setting.find({forGroup:g._id})
				list[g._id]=settings;
			}
			var tests_list={}
			for(var t of tests){
				tests_list[t._id]=t.test_name
			}
			res.render('jqmrpc/useExistingSettings',{list:list, groups:groups, tests_list:tests_list})
		}
	}catch(err){
		throw new Error(err)
	}
})


router.get('/tests/rpc/deleteParentCategory', middleware.isLoggedInTeacher, async(req,res,next)=>{
	let pcat_id=req.query.parent_cat_id
	try{
		let pcat =  await ParentCategory.findById(pcat_id)
		res.render('jqmrpc/deleteParentCategory',{pcat:pcat})
	}catch(err){
		throw new Error(err)
	}
})
router.get('/tests/rpc/deleteSubCategory', middleware.isLoggedInTeacher, async(req,res,next)=>{
	let scat_id=req.query.cat_id
	let pcat_id=req.query.parent_cat_id
	try{
		let scat =  await SubCategory.findById(scat_id)
		res.render('jqmrpc/deleteSubCategory',{scat:scat, pcat_id:pcat_id})
	}catch(err){
		throw new Error(err)
	}
})
router.get('/tests/rpc/regCodeUsage',middleware.isLoggedInTeacher, async(req,res,next)=>{
	try{
		let groups = await Group.find({'author.id':req.user.id})
		var list={}
		for(var g of groups){
			var codes=await Code.find({'author.id':req.user.id, 'group.id':g._id})
			list[g._id]={
				// students_n:g.students.length,
				codes_n:codes.length
			}
		}
		res.render('jqmrpc/codes',{list:list, groups:groups})
	}catch(err){
		throw new Error(err)
	}
})
module.exports=router;