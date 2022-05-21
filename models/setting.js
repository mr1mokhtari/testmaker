var mongoose	=require("mongoose");
var settingSchema	=new mongoose.Schema({
	forTest:String,
	forGroup:String,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Admin"
		},
		username:String
	},
	
	show_from:String,
	show_from_date:String,
	show_from_h:String,
	show_from_m:String,
	show_from_full:String,
	show_until_date:Date,
	show_until_h:String,
	show_until_m:String,
	show_until_full:String,
	show_results_when_unavailable:String,
	can_resume_when_unavailable:String,
	practice:String,
	attempts_allowed:String,
	show_instructions:{type:String,default:'0'},
	time_limit:String,
	save_finish_later:String,
	
	questions_displayed_per_page:String,
	show_question_points_during_test:String,
	show_question_category_during_test:String,
	random_q:String,
	must_select_answer:String,
	correct_to_continue:String,
	test_feedback_q:String,
	test_feedback_qca:String,
	allow_click_previous:String,
	allow_spellcheck:String,
	//	upon completion
	show_score_points:String,
	show_score_percentage:String,
	show_test_feedback:String,
	show_answers:String,
	show_correct_answers:String,
	display_all_questions_in_results:String,
	
	show_category_stats:String,
	passmark:String,
	passmarktext:String,
	failmarktext:String,
	email_results:String, //hidden
	instructor_email:String,
	email_id_0:String,
	email_student:String,
	email_student_show_score_points:String,
	email_student_show_score_percentage:String,
	email_student_show_test_feedback:String,
	
	email_student_show_answers:String,
	email_student_show_correct_answers:String,
	email_student_show_incorrect_only:String,
	email_student_show_category_stats:String,
	email_student_from:String,
	email_student_subject:String,
	email_send_type:String,
	email_student_send_type_auto:String,
	email_student_send_date_date:String,
	email_student_send_date_h:String,
	email_student_send_date_m:String,
	email_student_send_date_ampm:String,
	email_student_send_if_not_graded:String,
	allow_printing:String,
	allow_copytext:String,
	allow_pastetext:String,
	save_as_default:String
});
var Setting=mongoose.model("Setting",settingSchema);
module.exports=Setting;
