var express			=require("express"),
	router			=express.Router(),
	
	bodyParser 		=require('body-parser'),
	url 			=require('url'),
	querystring 	=require('querystring'),
	moment			=require('moment'),
	
	mongoose		=require("mongoose"),
	Question		=require("../models/question"),
	ParentCategory	=require("../models/parentCategory"),
	SubCategory		=require("../models/subCategory"),
	Test			=require("../models/test"),
	Group			=require("../models/group"),
	Code			=require("../models/code"),
	Admin			=require("../models/admin"),
	Setting			=require("../models/setting"),
	Exam			=require("../models/exam"),
	
	flash			=require("connect-flash"),
	middleware		=require("../middleware/index"),
	
	methodOverride	=require("method-override"),
	expressSanitizer=require("express-sanitizer"),
	escapeRegex 	= require('../public/js/utilities/regex-escape');

router.use(methodOverride("_method"));
router.use(expressSanitizer());

//Group Index Page
router.get("/tests/groups",middleware.isLoggedInTeacher,async (req,res,next)=>{
	try{
		const foundGroups = await Group.find({"author.username" : req.user.username})
		// const foundSettings = await Setting.find({"author.username" : req.user.username})
		const foundSettings = await Setting.find({})
		const foundTests = await Test.find({"author.username" : req.user.username})
		const teacher = await Admin.findById(req.user.id)
		
		var av={}
		for(var S of foundSettings){
			if(S.show_from!=undefined){av[S._id]=S.show_from}
			if(S.show_from_date!=undefined && S.show_from_date!=null){av[S._id]=checkDate(S.show_from_date, S.show_from_h, S.show_from_m, S.show_until_date, S.show_until_h, S.show_until_m)}
		}
		res.render("groups/groupIndex",{foundGroups:foundGroups, foundTests: foundTests, foundSettings:foundSettings, teacher:teacher, av:av})
	} catch (err) {
  		throw new Error(err);
	}
})
//New Group
router.get("/tests/groups/new",middleware.isLoggedInTeacher,(req,res)=>{
	Admin.findById(req.user.id,(err,teacher)=>{
		res.render("groups/newGroup",{teacher:teacher})
	})
})
router.post("/tests/groups/new",middleware.isLoggedInTeacher,(req,res)=>{
	var group_name=req.body.group_name;
	Group.create({group_name:group_name,author:{id:req.user._id,username:req.user.username}},(err,G)=>{
		if(err){console.log(err);}
		else{
			res.redirect("/tests/groups/edit/?group_id="+G._id+"&success=new")
		}
	})
})
//Edit Group
router.get("/tests/groups/edit/",middleware.isLoggedInTeacher, async(req,res,next)=>{
	var groupId=req.query.group_id;
	if(!groupId){
		return res.redirect("/tests/groups")
	}
	try{
		const G = await Group.findById(groupId)
		const fCs = await Code.find({"author.username":req.user.username, "group.id":groupId})
		const teacher = await Admin.findById(req.user.id)
		var list={}
		for(var s of G.students){
			list[s['_id']]=await Admin.findById(s['_id'])
		}
		res.render("groups/editGroup",{G:G,foundCodes:fCs,numFC:fCs.length, teacher:teacher, moment:moment, list:list})
	}catch(err){
		throw new Error(err)
	}
})
router.put("/tests/groups/new",middleware.isLoggedInTeacher,(req,res)=>{
	let action = req.body.div_id,
		id	= req.body.rg_id
	if(action=="gn"){
		Group.findById(id,(err,G)=>{
			G.group_name=req.body.group_name
			G.save((err)=>{
				if(err){console.log(err)}
				else{
					res.redirect("/tests/groups/edit/?group_id="+G._id+"&success=new")
				}
			})
		})
	}else if(action=="gm"){
		Group.findById(id,(err,G)=>{
			G.group_message=req.body.group_message
			G.save((err)=>{
				if(err){console.log(err)}
				else{
					var response = {
						response: "success",
						msg:"Group Message has been added successfully.",
					}
					res.send(response)
				}
			})
		})
	}
})
//Remove Group
router.get("/tests/groups/delete/",middleware.isLoggedInTeacher,(req,res)=>{
	var group_id=req.query.group_id
	Group.findById(group_id,(err,G)=>{
		Admin.findById(req.user.id,(err,teacher)=>{
			res.render("groups/delete/deleteGroupPage",{G:G, teacher:teacher})	
		})
	})
})
router.delete("/tests/groups/delete/deleteGroupAndMembers",middleware.isLoggedInTeacher,async(req,res,next)=>{
	var rg_id=req.body.rg_id,
		delete_option=req.body.delete_option,
		username=req.body.username,
		password=req.body.password;
	try{
		const G = await Group.findById(rg_id),
			  students = G.students
		if(students.length==0 || students[0]==undefined){
		   if(delete_option=="2"){
			   await Group.findByIdAndRemove(rg_id)
		   }
			return res.redirect("/tests/groups")
		}
		for(var stid of G.students){
			var exams = await Exam.find({forGroup:rg_id,forStudent:stid._id})
			for(var ex of exams){
				await Exam.findByIdAndRemove(ex._id)
			}
			var st = await Admin.findById(stid._id)
			var ind0 = st.groups.indexOf(rg_id)
			st.groups.splice(ind0,1)
			await st.save()
		}
		G.students=[];await G.save();
		if(delete_option=='1' || delete_option=="2"){
			var settings =  await Setting.find({forGroup:rg_id})
			for(var set of settings){
				var s = await Setting.findByIdAndRemove(set._id)
				var t = await Test.findById(s.forTest)
				var ind1= t.assignedSettings.indexOf(set._id)
				t.assignedSettings.splice(ind1,1)
				var ind2= t.assignedGroups.indexOf(rg_id)
				t.assignedGroups.splice(ind2,1)
				await t.save()
			}
		}
		if(delete_option=="2"){
			await Group.findByIdAndRemove(rg_id)
		}
		return res.redirect("/tests/groups")
	}catch(err){
		throw new Error(err)
	}
})

//Remove User
router.get("/users/transfer",middleware.isLoggedInTeacher,(req,res)=>{
	var rg_id=req.query.rg_id,
		user_id=req.query.user_id,
		show_layover=req.query.show_layover
	Admin.findById(user_id,(err,usEr)=>{
		if(err){console.log(err)}
		else{
			Group.find({"author.username":req.user.username},(err,foundGroups)=>{
				if(err){console.log(err)}
				else{
					return res.render("groups/delete/deleteUserPage",{ rg_id:rg_id, foundGroups:foundGroups, user_id:user_id, user:usEr})
				}
			})
		}
	})
})
router.post("/users/transfer/removeUserFromGroup",middleware.isLoggedInTeacher,(req,res)=>{
	var rg_id=req.body.rg_id,
		user_id=req.body.user_id
	Admin.findById(user_id,(err,st)=>{
		if(err){console.log(err)}
		else{
			var ind= st.groups.indexOf(rg_id)
			st.groups.splice(st,1)
			st.save((err)=>{
				Group.findById(rg_id,(err,g)=>{
					var ind2
					g.students.forEach((gst,i)=>{
						if(gst._id==user_id){
							ind2=i
						}
					})
					g.students.splice(ind2,1)
					g.save((err)=>{
						res.redirect(req.get('referer'))
					})
				})
			})
		}
	})
})
router.post("/users/transfer/addUserToGroup",middleware.isLoggedInTeacher, (req,res)=>{
	var rg_id=req.body.rg_id,
		user_id=req.body.user_id
	Admin.findById(user_id,(err,st)=>{
		if(err){console.log(err)}
		else{
			Group.findById(rg_id,(err,g)=>{
				if(err){console.log(err)}
				else{
					g.students.push({_id:st._id})
					// g.students.push({_id:st._id, username:st.username, firstName:st.firstName, lastName:st.lastName, email:st.email, language:st.language, registeredAt:st.registeredAt, lastLogin:st.lastLogin})
					g.save((err)=>{
						if(err){console.log(err)}
						st.groups.push(g._id)
						st.save((err)=>{
							res.redirect(req.get("referer"))
						})
					})
				}
			})
		}
	})
})
router.get("/users/deleteSingleUser",middleware.isLoggedInTeacher,(req,res)=>{
	let rg_id=req.query.rg_id,
		user_id=req.query.user_id
	Admin.findByIdAndRemove(user_id,(err,st)=>{
		if(err){console.log(err)}
		else{
			Group.find({"author.username" : req.user.username},(err,foundGroups)=>{
				foundGroups.forEach((group,j)=>{
					var ind2
					group.students.forEach((gst,i)=>{
						if(gst._id==user_id){
							ind2=i
						}
					})
					group.students.splice(ind2,1)
					group.save((err)=>{
						if(j+1==foundGroups.length){	
								res.redirect("/tests/groups/edit/?group_id=" + rg_id)
						}
					})
				})
			})
		}
	})
})
router.get("/users/editUserPopup",middleware.isLoggedInTeacher,(req,res)=>{
	let rg_id=req.query.rg_id,
		user_id=req.query.user_id
	Admin.findById(user_id,(err,st)=>{
		if(err){console.log(err)}
		else{
			res.render("groups/delete/editUserPopup",{st:st,rg_id:rg_id,user_id:user_id})
		}
	})
})
router.put("/users/group/editMemberDetails",middleware.isLoggedInTeacher,async (req,res,next)=>{
	let div_id=req.body.div_id,
		user_id=req.body.user_id,
		user=req.body.user,
		password=req.body.password;
	
	try{
		var st = await Admin.findByIdAndUpdate(user_id,user)
		if(password){
			await st.setPassword(password)
			await st.save()
		}
		req.flash("success","Details have been changed successfully.")
		res.redirect("back")
	}catch(err){
		throw new Error(err)
	}
})
//Add Registration Code
router.post("/tests/groups/setRegistrationCodes/",middleware.isLoggedInTeacher,(req,res)=>{
	let num=parseInt(req.body.addnumofstudents),
		rg_id=req.body.rg_id,
		regCodes=[]
	Group.findById(rg_id,(err,G)=>{
		if(err){console.log(err)}
		else{
			for(i=0;i<num;i++){
				var pushedCode=makeid(10)
				regCodes.push(pushedCode)
				var newCode={}
				newCode.code=pushedCode;
				makeDate(newCode)
				setUser(newCode,req.user)
				setGroup(newCode,G)
				Code.create(newCode,(err,C)=>{
					if(err){console.log(err)}
					else{
						if(regCodes.length==num){
							Code.find({"author.username":req.user.username,"group.id":G._id},(err,fCs)=>{
								res.render("groups/Edit/registrationcodes",{
									codes:regCodes,G:G,num:num,foundCodes:fCs
								})
							})
						}	
					}
				})
			}
				
		}
	})
})
//See Registration Codes 
router.get("/tests/groups/setRegistrationCodes/",middleware.isLoggedInTeacher,(req,res)=>{
	let rg_id=req.query.group
	Group.findById(rg_id,(err,G)=>{
		if(err){console.log(err)}
		else{
			Code.find({"author.username":req.user.username,"group.id":G._id},(err,fCs)=>{
				if(err){console.log(err)}
				else{
					res.render("groups/Edit/registrationcodes",{
						G:G,foundCodes:fCs,codes:[]
					})
				}
			})
		}
	})
})
//Remove Registration Code
router.delete("/tests/groups/setRegistrationCodes/:id", middleware.isLoggedInTeacher ,(req,res)=>{
	var codeId=req.params.id,
		rg_id=req.body.rg_id;
	Code.findByIdAndRemove(codeId,(err,C)=>{
		if(err){console.log(err)}
		else{
			Code.find({"author.username":req.user.username,"group.id":rg_id},(err,fCs)=>{
				Group.findById(rg_id,(err,G)=>{
					res.render("groups/Edit/registrationcodes",{G:G,foundCodes:fCs,codes:[]})
				})
			})
		}
	})
})

						// Functions
function makeid(length) {
	var result		= '';
	var characters	= 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
var makeDate = function(newCode){
	return newCode.createdAt=Date.now()
}
var setUser=function(newCode,user){
	newCode.author={id:user._id,username:user.username};
	return newCode
}
var setGroup=function(newCode,group){
	newCode.group={id:group._id,group_name:group.group_name};
	return newCode
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
module.exports=router;