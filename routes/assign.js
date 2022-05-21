var express			=require("express"),
	router			=express.Router(),
	moment			=require('moment-timezone'),
	
	bodyParser 		=require('body-parser'),
	url 			=require('url'),
	querystring 	=require('querystring'),
	
	mongoose		=require("mongoose"),
	Question		=require("../models/question"),
	ParentCategory	=require("../models/parentCategory"),
	SubCategory		=require("../models/subCategory"),
	Test			=require("../models/test"),
	Group			=require("../models/group"),
	Setting			=require("../models/setting"),
	Admin			=require("../models/admin"),
	
	flash		=require("connect-flash"),
	middleware	=require("../middleware/index"),
	
	methodOverride	=require("method-override"),
	expressSanitizer=require("express-sanitizer"),
	escapeRegex 	= require('../public/js/utilities/regex-escape');

router.use(methodOverride("_method"));
router.use(expressSanitizer());
//Which Test
router.get("/assign/tests/",middleware.isLoggedInTeacher,async(req,res,next)=>{
	
	try{
		let pcats = await ParentCategory.find({"author.username":req.user.username}),
			scats = await SubCategory.find({"author.username":req.user.username}),
			tests = await Test.find({"author.username":req.user.username}),
			teacher = await Admin.findById(req.user.id)
		res.render("assign/selectTest",{pcats:pcats, scats:scats, tests:tests, teacher:teacher })
	}catch(err){
		throw new Error(err)
	}
})
//Which Group
router.get("/assign/groups",middleware.isLoggedInTeacher,async (req,res, next)=>{
	let cat_id=req.body.cat_id,
		test_id=req.query.test_id
	Test.findById(test_id,(err,test)=>{
		Group.find({"author.username":req.user.username},(err,groups)=>{
			Admin.findById(req.user.id,(err,teacher)=>{
				res.render("assign/selectGroup",{test:test, groups:groups, cat_id:cat_id, teacher:teacher})
			})
		})
	})
})

//Get Settings
router.get("/assign/rgmanage", middleware.isLoggedInTeacher, async (req,res,next)=>{
	let test_id=req.query.test_id,
		rg_id=req.query.rg_id,
		show=req.query.show,
		assignnew=req.query.assignnew,
		edits,
		sas_test_id=req.query.sas_test_id,
		sas_rg_id=req.query.sas_rg_id;

	if(show==1){edits="1"}else if(assignnew==1){edits="0"}
	try{
		var test = await Test.findById(test_id),
			group= await Group.findById(rg_id),
			teacher= await Admin.findById(req.user.id),
			av;
		if(show==1){
			var	setting = await Setting.findOne({forTest:test_id, forGroup:rg_id})
			if(setting.show_from!=undefined){av=setting.show_from}
			if(setting.show_from_date!=undefined && setting.show_from_date!=null){av=checkDate(setting.show_from_date, setting.show_from_h, setting.show_from_m, setting.show_until_date, setting.show_until_h, setting.show_until_m)}
		}else{var setting=0;av='1'}

		if(sas_test_id!=undefined && sas_rg_id!=undefined){
			var	setting = await Setting.findOne({forTest:sas_test_id, forGroup:sas_rg_id})
			
			if(setting.show_from!=undefined){av=setting.show_from}
			if(setting.show_from_date!=undefined && setting.show_from_date!=null){av=checkDate(setting.show_from_date, setting.show_from_h, setting.show_from_m, setting.show_until_date, setting.show_until_h, setting.show_until_m)}
			
			res.render("assign/rgmanage",{test:test, group:group, edit:"0", edits:1, rg_id:rg_id, setting:setting, teacher:teacher, moment:moment, existingSettings:'1', av:av})
		}else{
			res.render("assign/rgmanage",{test:test, group:group, edit:"0", edits:edits, rg_id:rg_id, setting:setting, teacher:teacher, moment:moment, existingSettings:0, av:av})
		}
	}catch(err){
		throw new Error(err)
	}
})

router.delete("/assign/rgmanage/unassign",async(req,res,next)=>{
	let test_id=req.query.test_id,
		rg_id=req.query.rg_id
	try{
		let test = await Test.findById(test_id)
		let group = await Group.findById(rg_id)
		let gs=test.assignedGroups
		let ind = gs.indexOf(group._id)
		test.assignedGroups.splice(ind,1)
		let setting = await Setting.findByIdAndDelete( test.assignedSettings[ind] )
		test.assignedSettings.splice(ind,1)
		await test.save()
		res.redirect("/tests")
	}catch(err){
		throw new Error(err)
	}	
})
//Post Settings
router.post("/assign/update",middleware.isLoggedInTeacher,async(req,res,next)=>{
	let settings=req.body.settings
	settings.author=req.user
	try{
		let teacher= await Admin.findById(req.user.id)
		if(settings.show_from_date!=""){
			tzSetting(settings,teacher.timezone)
		}
		let setting=await Setting.create(settings)
		let test=await Test.findById(settings.forTest)
		test.assignedSettings.push(setting._id)
		test.assignedGroups.push(settings.forGroup)
		await test.save()
		let group= await Group.findById(settings.forGroup)
		res.render("assign/rgmanage",{test:test, edit:"1", rg_id:settings.forGroup, group:group, edits:"1", setting:setting, teacher:teacher, moment:moment,existingSettings:'0' })
	}catch(err){
		throw new Error(err)
	}
})
//Edit | Put Settings
router.put("/assign/update",middleware.isLoggedInTeacher,async (req,res,next)=>{
	let settings=req.body.settings
	settings.author=req.user
	try{
		let test = await Test.findById(settings.forTest)
		let group = await Group.findById(settings.forGroup),
			teacher= await Admin.findById(req.user.id)
		// console.log('1:'+settings.show_instructions)
		if(settings.show_from_date!=""){
			tzSetting(settings,teacher.timezone)   
		}
		let setting = await Setting.findByIdAndUpdate( req.body.setting_id, settings)
		res.redirect('/tests/')
		// res.render("assign/rgmanage",{test:test, edit:"1", rg_id:settings.forGroup, group:group, setting:setting, edits:"1", teacher:teacher, moment:moment })	
	}catch(err){
		throw new Error(err)
	}
})
module.exports=router;

//function
function tzConvert(d,h,m,t){
	d=new Date(d).setHours(h,m)
	d=new Date(d)
	d=JSON.stringify(d)
	var tm=moment(d.split("T")[0]+' '+d.substring(12,20), "YYYY-MM-DD hh:mm:ss")
	tm=tm.tz(t,true)
	var tmm = tm.tz("GMT")
	return tmm
}
function tzSetting(settings,ttz){
		var utcFrom = tzConvert(settings.show_from_date, settings.show_from_h, settings.show_from_m, ttz)
		settings.show_from_date=utcFrom.format('YYYY-MM-DD')
		settings.show_from_h=utcFrom.format('HH')
		settings.show_from_m=utcFrom.format('mm')
		settings.show_from_full=utcFrom.format('YYYY-MM-DD HH:mm')
		var utcUntil = tzConvert(settings.show_until_date, settings.show_until_h, settings.show_until_m, ttz)
		settings.show_until_date=utcUntil.format('YYYY-MM-DD')
		settings.show_until_h=utcUntil.format('HH')
		settings.show_until_m=utcUntil.format('mm')
		settings.show_until_full=utcUntil.format('YYYY-MM-DD HH:mm')
}
var checkDate=function(fd,fh,fm,ud,uh,um){
	var currentDate=Date.now()
	var fromDate=Date.parse(fd)+((parseInt(fh)*3600)+(parseInt(fm)*60))*1000
	var untilDate=Date.parse(ud)+((parseInt(uh)*3600)+(parseInt(um)*60))*1000
	// console.log(fromDate+":"+currentDate+":"+untilDate)
	if(fromDate<currentDate && untilDate>currentDate){
		return "1"
	}else{
		return "0"
	}
}