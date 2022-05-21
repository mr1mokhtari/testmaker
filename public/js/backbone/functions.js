var tests_array = [];
var groups_array = [];
var relation_array = [];
var links_array = [];
var category_array = [];
var category_parents_array = [];

/*
$( window ).scroll(function() {
    if ( $('#load_more_row').visible(true) ) {
        console.log('on');
    } else {
        console.log('off');
    }
});
*/


function getDistFromBottomForBackboneAutoLoad () {

  var scrollPosition = window.pageYOffset;
  var windowSize     = window.innerHeight;
  var bodyHeight     = document.body.offsetHeight;

  return Math.max(bodyHeight - (scrollPosition + windowSize), 0);

}

backbone_is_currently_loading_data = false;


if (typeof isMSIE8 === 'undefined') {
    /* Don't use in IE8 */
    document.addEventListener('scroll', function () {
        dist_to_bottom = getDistFromBottomForBackboneAutoLoad();
        // console.log('scrolling', getDistFromBottom());

        if (!backbone_is_currently_loading_data && dist_to_bottom > 0 && dist_to_bottom <= 500) {
            backbone_loading_data = true;
            // console.log('now');
            $('.loadMore').trigger('click');

        }

    });
}


/* LOAD Tests/Groups/Links/Assignments JSON (all in one file) */
function tests_json_to_array(json_file) {

    $.ajax({
        async: false,
        url: json_file,
        dataType: "json",
        success: function(data) {

            /* Separate data into separate variables */

            var list_tests_data = data.list_tests_data;
            if (list_tests_data != 'nodata'){

                for (var test in list_tests_data)
                {
                   if (list_tests_data.hasOwnProperty(test)) {
                        var value = list_tests_data[test];

                        var test_obj = {
                            id: test,
                            name: replaceInvalidJavascriptChars(value.test_name),
                            //name: value.test_name,
                            cat_id: value.cat_id
                        };

                        tests_array.push(test_obj);
                   }
                }

            }

            var list_reg_groups_data = data.list_reg_groups_data;
            if (list_reg_groups_data != 'nodata'){
                for (var group in list_reg_groups_data)
                {
                    if (list_reg_groups_data.hasOwnProperty(group)) {
                        var value = list_reg_groups_data[group];

                        var group_obj = {
                            id: group,
                            name: replaceInvalidJavascriptChars(value.rg_name),
                            //name:       value.rg_name,
                            teacher_id: value.teacher_id,
                            members: value.members,
                            tests: value.tests
                        };

                        groups_array.push(group_obj);
                    }
                }
            }


            var tests_in_reg_group_data = data.tests_in_reg_group_data;
            if (tests_in_reg_group_data != 'nodata') {

                for (var relation in tests_in_reg_group_data) {
                  //  if (data.hasOwnProperty(relation)) {
                        var value = tests_in_reg_group_data[relation];

                        var relation_obj = {
                            group_id: value.rg_id,
                            test_id: value.test_id,
                            show_from: value.show_from,
                            show_until: value.show_until,
                            time_limit: value.time_limit,
                            passmark: value.passmark,
                            results: value.results,
                            available: value.available,
                            display_dates: value.display_dates
                        };

                        relation_array.push(relation_obj);
                    }
               // }
            }

            var list_non_reg_groups_data = data.list_non_reg_groups_data;
            var tests_in_non_reg_group_data = data.tests_in_non_reg_group_data;
            for (var link_id in list_non_reg_groups_data) {
                var non_reg_group = list_non_reg_groups_data[link_id];
                for (var test_non_reg_group in tests_in_non_reg_group_data) {

                    var value = tests_in_non_reg_group_data[test_non_reg_group];
                    if (link_id == value['nrg_id']) {

                        non_reg_group['show_from'] = value.show_from;
                        non_reg_group['show_until'] = value.show_until;
                        non_reg_group['save_results'] = value.save_results;
                        non_reg_group['time_limit'] = value.time_limit;
                        non_reg_group['passmark'] = value.passmark;
                        non_reg_group['results'] = value.results;
                        non_reg_group['available'] = value.available;
                        non_reg_group['display_dates'] = value.display_dates;
                        non_reg_group['name'] = list_non_reg_groups_data[link_id].nrg_name;
                        non_reg_group['ext_test_id'] = list_non_reg_groups_data[link_id].ext_test_id;
                        non_reg_group['id'] = link_id;
                        links_array.push(non_reg_group);
                    }
                }
            }

            var list_categories_data = data.list_categories_data;
            if (list_categories_data != 'nodata'){

                for (var category in list_categories_data)
                {
                    if (list_categories_data.hasOwnProperty(category)) {
                        category_array[category] = list_categories_data[category];
                    }
                }
            }

            var list_category_parents_data = data.list_category_parents_data;
            if (list_category_parents_data != 'nodata'){

                for (var category_parent in list_category_parents_data)
                {
                    if (list_category_parents_data.hasOwnProperty(category_parent)) {
                        category_parents_array[category_parent] = list_category_parents_data[category_parent];
                    }
                }
            }

        }
    });

}


/* CREATE TESTS MODEL */
function tests_json() {

    var json = '';

    //for (var test in tests_array)
    var i=0, tests_length = tests_array.length;
    for ( i; i<tests_length; i++ )
    {
        assign_count = 0;

        var groups = '';

        var value = tests_array[i];

        relation_array.filter(function (relation) {

            if (relation.test_id == value.id)
            {

                groups_array.filter(function (group) {

                    if (group.id == relation.group_id)
                    {
                        assign_count++;

                        groups = groups.concat('{id:' + group.id
                            + ', name:"' +          	group.name
                            + '", show_from: ' +       relation.show_from
                            + ', show_until: ' +      relation.show_until
                            //+ '", save_results: "' +    relation.save_results
                            + ', time_limit: ' +      relation.time_limit
                            + ', passmark: ' +        relation.passmark
                            + ', results: ' +         relation.results
                            + ', available: ' +       relation.available
                            + ', display_dates: "' +   relation.display_dates
                            + '"},');
                    }

                });

            }

        });

        if (groups.length > 0)
        {
            if ( groups.charAt( groups.length-1 ) ==  ',')
            {
                groups = groups.slice(0, -1);
            }
        }

        var links = '';

        links_array.filter( function (link) {

            if (link.test_id == value.id)
            {
                assign_count++;
                links = links.concat('{id:' + link.id
                    + ', name:"' +         	link.name
                    + '", ext_test_id: "' +     link.ext_test_id
                    + '", show_from: ' +       link.show_from
                    + ', show_until: ' +      link.show_until
                    + ', save_results: ' +    link.save_results
                    + ', time_limit: ' +      link.time_limit
                    + ', passmark: ' +        link.passmark
                    + ', results: ' +         link.results
                    + ', available: ' +       link.available
                    + ', display_dates: "' +   link.display_dates
                    + '"},');
            }

        });

        if (links.length > 0)
        {
            if ( links.charAt( links.length-1 ) ==  ',')
            {
                links = links.slice(0, -1);
            }
        }

        var new_json_format = '{ id:' + value.id
            + ', name:"' +        		value.name
            + '", cat_id:' +           value.cat_id
            + ', assign_count: ' +    assign_count
            + ',groups: [' + groups + '], '
            + 'links: [' + links + ']}';

        json = json.concat("," + new_json_format);
    }

    json = '[' + json.substr(1, json.length) + ']';


    return eval(json);
    // use of eval is fine as the source of JSON is safe and only for displaying data.
}



/* CREATE GROUPS MODEL */
function groups_json() {

    json = '';
    //for (var group in groups_array){//incorrect way to loop and array
    var i=0, groups_length = groups_array.length;
    if (groups_length != 0) {
        for (i; i < groups_length; i++) {

            test_count = 0;

            var tests = '';

            var value = groups_array[i];

            relation_array.filter(function (relation) {

                if (relation.group_id == value.id) {
                    tests_array.filter(function (test) {

                        if (test.id == relation.test_id) {
                            test_count++;

                            tests = tests.concat('{id:' + test.id
                            + ', name:"' + test.name
                            + '", show_from: ' + relation.show_from
                            + ', show_until: ' + relation.show_until
                                //+ '", save_results: "' +    relation.save_results
                            + ', time_limit: ' + relation.time_limit
                            + ', passmark: ' + relation.passmark
                            + ', results: ' + relation.results
                            + ', available: ' + relation.available
                            + ', display_dates: "' + relation.display_dates
                            + '"},');

                        }

                    });
                }

            });

            if (tests.length > 0) {
                if (tests.charAt(tests.length - 1) == ',') {
                    tests = tests.slice(0, -1);
                }
            }

            var new_json_format = '{ id:' + value.id
                + ', name:"' + value.name
                + '", members:' + value.members
                + ', teacher_id:' + value.teacher_id
                + ', test_count: ' + test_count
                + ', tests: [' + tests + ']' + '}';

            json = json.concat("," + new_json_format);
        }
    }

    json = '[' + json.substr(1, json.length) + ']';

    return eval(json);
}


/* CREATE LINKS MODEL */
function links_json() {

    var json = '';

    //for (var link in links_array)
    var i=0, links_length = links_array.length;
    for ( i; i<links_length; i++ )
    {
        var test_value = '';
        var value = links_array[i];

        tests_array.filter(function (test) {

            if (test.id == value.test_id)
            {
                test_value = ',test_id: "' +    value.test_id
                    + '",test_name: "' +        test.name + '"';

                //return;
            }

        });

        var new_json_format = '{ id:' + value.id
            + ', name:"' +         	value.name
            + '", teacher_id:' +       value.teacher_id
            + '' +test_value
            + ', show_from: ' +        value.show_from
            + ', show_until: ' +      value.show_until
            + ', save_results: ' +    value.save_results
            + ', time_limit: ' +      value.time_limit
            + ', passmark: ' +        value.passmark
            + ', results: ' +         value.results
            + ', ext_test_id: "' +     value.ext_test_id
            + '", available: ' +       value.available
            + ', display_dates: "' +   value.display_dates
            + '"}';


        json = json.concat("," + new_json_format);
    }

    json = '[' + json.substr(1, json.length) + ']';

    return eval(json);
}



/* Load Categories json */
function categories_json() {
/*
    json = '';

    for (var category in category_array)
    {
       if (category_array.hasOwnProperty(category)) {
            var value = category_array[category];

            var new_json_format = '{ id:' + category
                + ', name:"' + replaceInvalidJavascriptChars(value.cat_name) + '"}';
                //+ '", name:"' + 			value.cat_name
                //+ '", teacher_id:' + value.teacher_id


            json = json.concat("," + new_json_format);
       }
    }

    return eval('[' + json.substr(1, json.length) + ']'); // use of eval is fine as the source of JSON is safe and only for displaying data.
*/

    json = '';
    i = -2;
    tests_in_cats_array = [];

    for (var test in tests_array){
        var value = tests_array[test];
        if (typeof tests_in_cats_array[value.cat_id] === 'undefined') {
            tests_in_cats_array[value.cat_id] = 1;
        } else {
            tests_in_cats_array[value.cat_id]++;
        }
    }

    for (var category_parent in category_parents_array) {
        //i--;

        if (category_parents_array.hasOwnProperty(category_parent)) {
            var value = category_parents_array[category_parent];

            var new_json_format = '{ id: "p' + value.parent_id + '"' //+ i //+ category_parent
                + ', name:"&nbsp;-&nbsp;' + replaceInvalidJavascriptChars(value.parent_name) + '&nbsp;-"}';
            //+ '", name:"' + 	value.cat_name
            //+ '", teacher_id:' + value.teacher_id

            json = json.concat("," + new_json_format);
            //console.log(json);


            for (var category in category_array) {
                if (category_array.hasOwnProperty(category)) {
                    var value2 = category_array[category];

                    if (value2.parent_id == category_parent) {

                        if (typeof tests_in_cats_array[value2.cat_id] === 'undefined') {
                            tests_in_cats_array[value2.cat_id] = 0
                        }
                        var new_json_format2 = '{ id:' + value2.cat_id
                            + ', name:"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + replaceInvalidJavascriptChars(value2.cat_name) + ' (' + tests_in_cats_array[value2.cat_id] + ')"}';
                        //+ '", name:"' + 			value.cat_name
                        //+ '", teacher_id:' + value.teacher_id

                        json = json.concat("," + new_json_format2);

                    }
                }
            }
        }
    }

    return eval('[' + json.substr(1, json.length) + ']'); // use of eval is fine as the source of JSON is safe and only for displaying data.

}



/**
 * Escape all line terminators so javascript can use them when recreating second json array (backslashes cause various issues when in group/test/link/category names)
 * @param str
 * @return str
 * Ref: http://timelessrepo.com/json-isnt-a-javascript-subset
 * The following characters are consider to be line terminators:
 * \u000A - Line Feed
 * \u000D - Carriage Return
 * \u2028 - Line separator
 * \u2029 - Paragraph separator
 * This text caused error: " ÐšÑƒÑ€Ñ Ð›Ð¸Ñ‚ÐµÑ€Ð°Ñ‚ÑƒÑ€Ð°â€¨ ÐÐ¾Ð²Ð¾Ð³Ð¾ Ð·Ð°Ð²ÐµÑ‚Ð° " which contains a unicode carriage return after second word
 */
function replaceInvalidJavascriptChars(str){
    //Used tp break IE8 but fixed when I fixed incorrect looping arrays by using "for" loop over original "for-in" loops above
    //we replace line break chars in PHP on the way in as well, used here for any we missed previously to removing in php
    //we must escape backslashes as well

    if (str.length) {
        return str.replace("\u2028", "").replace("\u2029", "").replace("\u000A", "").replace("\u000D", "").replace(/\\/g, '\\\\');
    } else {
        return str;
    }

}