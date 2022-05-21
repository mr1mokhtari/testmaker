$(window).bind("load", function() {

    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Routers: {}
    };

    // Format data

    tests_json_to_array(get_tests_data_json_path);

    var json_tests = tests_json();

    var json_groups = groups_json();

    var json_links = links_json();

    var json_categories = categories_json();

    /* Loading too many items at once is slow in DOM and Searching hangs etc */
	var backbone_lazy_load__global_display_per_request = 30;






    // CATEGORIES START

    App.Models.Category = Backbone.Model.extend({});

    App.Collections.Categories = Backbone.Collection.extend({
        model: App.Models.Category
    });

    App.Views.Category = Backbone.View.extend({
        tagName: 'select',

        id: 'cat_select',

        initialize: function() {
            _.bindAll(this, 'render');
        },

        render: function() {

            $(this.el).attr('name','cat_id').addClass('cats_in_qb_filter');

            var template = $("#categoryTemplate").html();

            var categories_select_template = _.template( template, { categories: this.collection.toJSON() });

            this.$el.html(categories_select_template);

            return this;
        }
    });

    // CATEGORIES END

















    // TESTS START

    App.Models.Test = Backbone.Model.extend({});

    App.Collections.Tests = Backbone.Collection.extend({
        model: App.Models.Test,


	    initialize: function() {
	        this.sort_key = 'name';
		},

		comparator: function(a, b) {

        	if (this.sort_key == 'name'){
		        var name_a = a.get(this.sort_key).toUpperCase();
		        var name_b = b.get(this.sort_key).toUpperCase();
		        return (name_a < name_b) ? -1 : (name_a > name_b) ? 1 : 0;
	        } else {
        		/* Can't uppercase INTs */
		        var name_a = a.get(this.sort_key);
		        var name_b = b.get(this.sort_key);
		        return (name_a > name_b) ? -1 : (name_a < name_b) ? 1 : 0; //  reverse order
	        }

		},


        search : function(value){
            if(value == "") return this;

            return _(this.filter(function(data) {
				//var pattern = new RegExp(escapeDataForJson(value),"gi");
				var pattern = new RegExp(value,"gi");
                return pattern.test(data.get("name"));
            }));
        },

        sortGroups: function(test) {
            test.get('groups').sort(function(a, b) {
                var name_a = a.name.toUpperCase();
                var name_b = b.name.toUpperCase();
                return (name_a < name_b) ? -1 : (name_a > name_b) ? 1 : 0;
            });
        },

        sortLinks: function(test) {
            test.get('links').sort(function(a, b) {
                var name_a = a.name.toUpperCase();
                var name_b = b.name.toUpperCase();
                return (name_a < name_b) ? -1 : (name_a > name_b) ? 1 : 0;
            });
        },

        filterByCategoryId : function(id){
            return _(this.filter(function(data) {
                if(id == '-1') return this;

                return data.get("cat_id") == id;
            }));
        },

	    /* Sort top level Groups */
		sortDateAdded : function(){
			this.sort_key = 'id';
            return this.sort();
		},

	    /* Sort top level Groups */
		sortAlphabetical : function(){
			this.sort_key = 'name';
            return this.sort();
		}
    });

    App.Views.Test = Backbone.View.extend({
        tagName: 'li',

        initialize: function() {
            _.bindAll(this, 'render');
            this.model.bind('change', this.render);
            this.template = _.template($('#testTemplate').html());
        },

        events: {
           // 'click .test_container': 'showGroups', // removed to use sitewide $(document).on('click', '.accordion-toggle', function() {
            'click .open_embed_links': 'showDirectLinkCode'
        },

        /*showGroups: function(event) {
			if (!$(event.target).is("a")){//stop containers closing if clicking a link
				this.$('.test_container').toggleClass('closed').toggleClass('open');
				this.$('.test_groups').slideToggle('fast').toggleClass('hide');
			}
        },*/

        showDirectLinkCode: function(event) {
            event.preventDefault();
            this.$('#'+$(event.target).data('ext_test_id')).slideToggle('fast').toggleClass('hide');
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    App.Views.TestsList = App.Views.Test.extend({});


    /*
        Lazy loading only keeps current items on page when Load More when button is pressed or auto scroll
     */
    App.Views.Tests = Backbone.View.extend({
        tagName: 'section',

        initialize: function() {
            _.bindAll(this, 'render');
            this.template = _.template($('#testBaseTemplate').html());
            this.templateEmpty = _.template($('#testEmptyTemplate').html());
            this.collection.bind('reset', this.render);

            /* Lazy Load vars */
            this.lazy_load__global_display_per_request = backbone_lazy_load__global_display_per_request; // default
	        this.lazy_load__items_currently_displayed_on_page = 0; // default
            this.lazy_load__last_filter_type = 'alpha'; // default
			this.lazy_load__last_filter_value = '';
			this.lazy_load__do_counters_reset = false;

			this.resetLazyLoadCounterVars();
        },
        events: {
            'click .expandAll': 'showTests',
            'click .collapseAll': 'hideTests',
            'change #cat_select': 'filterByCategoryId',
            'keyup #test_search': 'search',
	        'click .loadMore': 'renderMore',
	        'click .sortAlphabetical' : 'sortAlphabetical',
	        'click .sortDateAdded' : 'sortDateAdded'
        },

	    resetLazyLoadCounterVars: function (event){
			this.lazy_load__items_currently_displayed_on_page = 0;
			this.total_results_in_filter = 0;
	    },

        showTests: function(event) {
            event.preventDefault();
            this.$('.test_container').removeClass('closed').addClass('open');
            this.$('.test_groups').show().removeClass('hide');
        },

        hideTests: function(event) {
            event.preventDefault();
            this.$('.test_container').removeClass('open').addClass('closed');
            this.$('.test_groups').hide().addClass('hide');
        },



        filterByCategoryId: function(event) {
        	event.preventDefault();

            var category_id = this.$('#cat_select').val();

            if (isNaN(category_id)) {
           	    alert('You can only filter using Sub Categories, not Parent Categories.');
           	    return;
            }

            this.lazy_load__last_filter_type = 'by_cat_id';
			this.lazy_load__last_filter_value = category_id;
			this.lazy_load__do_counters_reset = true;

            this.renderList(this.collection.filterByCategoryId(category_id));
        },

        search: function(event){
			// Do not put event.preventDefault(); here, it will break search from Top nav global search bar

            var search_value = $("#test_search").val();

            this.lazy_load__last_filter_type = 'by_search';
			this.lazy_load__last_filter_value = search_value;
			this.lazy_load__do_counters_reset = true;

            this.renderList(this.collection.search(search_value));
        },

        sortAlphabetical: function(event) {
            event.preventDefault();

            this.lazy_load__last_filter_type = 'alpha';
			this.lazy_load__last_filter_value = '';
			this.lazy_load__do_counters_reset = true;

            this.renderList(this.collection.sortAlphabetical());
        },

        sortDateAdded: function(event) {
            event.preventDefault();

            this.lazy_load__last_filter_type = 'recently_added';
			this.lazy_load__last_filter_value = '';
			this.lazy_load__do_counters_reset = true;

            this.renderList(this.collection.sortDateAdded());
        },

	    renderMore : function(event) {
			event.preventDefault();

			this.lazy_load__do_counters_reset = false;

        	if (this.lazy_load__last_filter_type === 'alpha'){
        		this.renderList(this.collection);

	        } else if (this.lazy_load__last_filter_type === 'recently_added'){
        		this.renderList(this.collection);

	        } else if (this.lazy_load__last_filter_type === 'by_cat_id') {
		        this.renderList(this.collection.filterByCategoryId(this.lazy_load__last_filter_value));

	        } else if (this.lazy_load__last_filter_type === 'by_search') {
		        this.renderList(this.collection.search(this.lazy_load__last_filter_value));
	        }

	    },






	    showHideLoadMoreButton: function(event){


            if (this.total_results_in_filter > this.lazy_load__items_currently_displayed_on_page){
            	this.$('#load_more_row').show();
            } else {
            	this.$('#load_more_row').hide();
            }

	    },



		/* Render by filters */
        renderList : function(tests){


        	if (this.lazy_load__do_counters_reset  === true){
        		this.resetLazyLoadCounterVars();
        		$(".table-body").html("");
        		var display_from =  0;
				var display_to =    this.lazy_load__global_display_per_request;
	        } else {
				var display_from =  this.lazy_load__items_currently_displayed_on_page;
				var display_to =    this.lazy_load__items_currently_displayed_on_page + this.lazy_load__global_display_per_request;

	        }

			this.length_with_results = 0;


        	local_this = this;

			var lazy_loader__local_counter = 0;
			var lazy_loader__local_items_displayed_this_render = 0;

            tests.each(function(test){

            	if (lazy_loader__local_counter >= display_from && lazy_loader__local_counter < display_to) {


		            var view = new App.Views.TestsList({
			            model: test,
			            collection: this.collection
		            });
		            $(".table-body").append(view.render().el);

		            lazy_loader__local_items_displayed_this_render++;
	            }
            	lazy_loader__local_counter++;
            });

            this.lazy_load__items_currently_displayed_on_page += lazy_loader__local_items_displayed_this_render;

            this.total_results_in_filter = lazy_loader__local_counter;

            this.showHideLoadMoreButton();



            $('.table-body').show();

            /* Allow next auto scrolling load in functions.js */
            backbone_loading_data=false;

            return this;
        },





		/* Initial render, and called with .sort() */
        render: function() {
            var tests,
                collection = this.collection,
                categories = this.options.categories,
                category_parents = this.options.category_parents;

            this.$el.html(this.template({}));



            tests = this.$('.table-body');
            local_this = this;



            if (collection.length > 0) {

				/* Hide bottom HTML not required when no tests exists */
				if (collection.length < 10) {
					this.$('div.hide_if_no_data_bottom').html('&nbsp;');
				}




                /* render cats only if we have tests */

                // get rendered categories select html
                var categoriesView = new App.Views.Category({ collection: categories });
                //this.$('#test_search').after(categoriesView.render().el);
                this.$('#cat_filter').after(categoriesView.render().el);



				var lazy_loader__local_counter = 0;
				var lazy_loader__local_items_displayed_this_render = 0;

                collection.each( function(test) {

                	if (lazy_loader__local_counter < local_this.lazy_load__global_display_per_request) {

		                collection.sortGroups(test);
		                collection.sortLinks(test);

		                var view = new App.Views.TestsList({
			                model: test,
			                collection: collection
		                });

		                tests.append(view.render().el);

		                lazy_loader__local_items_displayed_this_render++

	                }

                    lazy_loader__local_counter++;
                });

                this.lazy_load__items_currently_displayed_on_page = lazy_loader__local_items_displayed_this_render;

	            this.total_results_in_filter = lazy_loader__local_counter;

	            this.showHideLoadMoreButton();

            }
            else {
                /* Hide HTML not required when no tests exists */
                /* Must reference div.class no just .class else IE8 has a heart attack */
                this.$('div.hide_if_no_data, span.hide_if_no_data').html('&nbsp;');
                this.$('div.hide_if_no_data_bottom, span.hide_if_no_data').html('&nbsp;');
                tests.append(this.templateEmpty({}));

            }

            /* Allow next auto scrolling load in functions.js */
            backbone_loading_data=false;

            return this;
        }
    });

    // TESTS END












    // GROUPS START

    App.Models.Group = Backbone.Model.extend({ });

    App.Collections.Groups = Backbone.Collection.extend({
        model: App.Models.Group,

	    initialize: function() {
	        this.sort_key = 'name';
		},

		comparator: function(a, b) {

        	if (this.sort_key == 'name'){
		        var name_a = a.get(this.sort_key).toUpperCase();
		        var name_b = b.get(this.sort_key).toUpperCase();
		        return (name_a < name_b) ? -1 : (name_a > name_b) ? 1 : 0;
	        } else {
        		/* Can't uppercase INTs */
		        var name_a = a.get(this.sort_key);
		        var name_b = b.get(this.sort_key);
		        return (name_a > name_b) ? -1 : (name_a < name_b) ? 1 : 0; //  reverse order
	        }

		},

		search : function(value){
			if(value == "") return this;


			return _(this.filter(function(data) {
				//var pattern = new RegExp(escapeDataForJson(value),"gi");
				var pattern = new RegExp(value,"gi");
				return pattern.test(data.get("name"));
			}));
		},

	    /* Sort second level Tests */
        sortTests: function(group) {
            group.get('tests').sort(function(a, b) {
                var name_a = a.name.toUpperCase();
                var name_b = b.name.toUpperCase();
                return (name_a < name_b) ? -1 : (name_a > name_b) ? 1 : 0;
            });
        },

	    /* Sort top level Groups */
		sortDateAdded : function(){
			this.sort_key = 'id';
            return this.sort();
		},

	    /* Sort top level Groups */
		sortAlphabetical : function(){
			this.sort_key = 'name';
            return this.sort();
		}
    });



    App.Views.Group = Backbone.View.extend({
        tagName: 'li',

        initialize: function() {
            _.bindAll(this, 'render');
            this.model.bind('change', this.render);
            this.template = _.template($('#groupTemplate').html());
        },

        //events: {
            //'click .group_container': 'showGroups' // removed to use sitewide $(document).on('click', '.accordion-toggle', function() {
        //},

        /*showGroups: function(event) {
			if (!$(event.target).is("a")){//stop containers closing if clicking a link
            	this.$('.group_container').toggleClass('closed').toggleClass('open');
           		// fetch groups to display use test id to get groups
           		this.$('.group_tests').slideToggle('fast').toggleClass('hide');
			}
        },*/

        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });




    App.Views.GroupsList = App.Views.Group.extend({});



	/*
        Lazy loading only keeps current items on page when Load More when button is pressed or auto scroll
     */
    App.Views.Groups = Backbone.View.extend({
        tagName: 'section',

        initialize: function() {
            _.bindAll(this, 'render');
            this.template = _.template($('#groupsBaseTemplate').html());
            this.templateEmpty = _.template($('#groupEmptyTemplate').html());
            this.collection.bind('reset', this.render);

            /* Lazy Load vars */
            this.lazy_load__global_display_per_request = backbone_lazy_load__global_display_per_request; // default
	        this.lazy_load__items_currently_displayed_on_page = 0; // default
            this.lazy_load__last_filter_type = 'alpha'; // default
			this.lazy_load__last_filter_value = '';
			this.lazy_load__do_counters_reset = false;

			this.resetLazyLoadCounterVars();
        },

        events: {
            'click .expandAll': 'showGroups',
            'click .collapseAll': 'hideGroups',
			'keyup #group_search': 'search',
	        'click .loadMore': 'renderMore',
	        'click .sortAlphabetical' : 'sortAlphabetical',
	        'click .sortDateAdded' : 'sortDateAdded'
        },

	    resetLazyLoadCounterVars: function (event){
			this.lazy_load__items_currently_displayed_on_page = 0;
			this.total_results_in_filter = 0;
	    },

        showGroups: function(event) {
            event.preventDefault();
            this.$('.group_container').removeClass('closed').addClass('open');
            // fetch groups to display use test id to get groups
            this.$('.group_tests').show().removeClass('hide');
        },

        hideGroups: function(event) {
            event.preventDefault();
            this.$('.group_container').removeClass('open').addClass('closed');
            this.$('.group_tests').hide().addClass('hide');
        },

		search: function(event){
			// Do not put event.preventDefault(); here, it will break search from Top nav global search bar

			var search_value = $("#group_search").val();

            this.lazy_load__last_filter_type = 'by_search';
			this.lazy_load__last_filter_value = search_value;
			this.lazy_load__do_counters_reset = true;

            this.renderList(this.collection.search(search_value));
		},

        sortAlphabetical: function(event) {
            event.preventDefault();

            this.lazy_load__last_filter_type = 'alpha';
			this.lazy_load__last_filter_value = '';
			this.lazy_load__do_counters_reset = true;

            this.renderList(this.collection.sortAlphabetical());
        },

        sortDateAdded: function(event) {
            event.preventDefault();

            this.lazy_load__last_filter_type = 'recently_added';
			this.lazy_load__last_filter_value = '';
			this.lazy_load__do_counters_reset = true;

            this.renderList(this.collection.sortDateAdded());
        },

	    renderMore : function(event) {
			event.preventDefault();

			this.lazy_load__do_counters_reset = false;

        	if (this.lazy_load__last_filter_type === 'alpha'){
        		this.renderList(this.collection);

	        } else if (this.lazy_load__last_filter_type === 'recently_added'){
        		this.renderList(this.collection);

	        } else if (this.lazy_load__last_filter_type === 'by_cat_id') {
		        this.renderList(this.collection.filterByCategoryId(this.lazy_load__last_filter_value));

	        } else if (this.lazy_load__last_filter_type === 'by_search') {
		        this.renderList(this.collection.search(this.lazy_load__last_filter_value));
	        }

	    },


	    showHideLoadMoreButton: function(event){


            if (this.total_results_in_filter > this.lazy_load__items_currently_displayed_on_page){
            	this.$('#load_more_row').show();
            } else {
            	this.$('#load_more_row').hide();
            }

	    },




	    /* Render by filters */
		renderList : function(groups){


        	if (this.lazy_load__do_counters_reset  === true){
        		this.resetLazyLoadCounterVars();
				$(".table-body").html("");
				var display_from =  0;
				var display_to =    this.lazy_load__global_display_per_request;
	        } else {
				var display_from =  this.lazy_load__items_currently_displayed_on_page;
				var display_to =    this.lazy_load__items_currently_displayed_on_page + this.lazy_load__global_display_per_request;

	        }

			this.length_with_results = 0;


        	local_this = this;

			var lazy_loader__local_counter = 0;
			var lazy_loader__local_items_displayed_this_render = 0;


			groups.each(function(group){

				if (lazy_loader__local_counter >= display_from && lazy_loader__local_counter < display_to) {

					var view = new App.Views.GroupsList({
						model: group,
						collection: this.collection
					});
					$(".table-body").append(view.render().el);
					lazy_loader__local_items_displayed_this_render++;
	            }
            	lazy_loader__local_counter++;

			});

			this.lazy_load__items_currently_displayed_on_page += lazy_loader__local_items_displayed_this_render;

            this.total_results_in_filter = lazy_loader__local_counter;

            this.showHideLoadMoreButton();

			$('.table-body').show();

			/* Allow next auto scrolling load in functions.js */
            backbone_loading_data=false;

			return this;
		},




	    /* Initial render, and called with .sort() */
        render: function() {
            var $groups,
                collection = this.collection;

            this.$el.html(this.template({}));


            $groups = this.$('.table-body');
            local_this = this;


            if (collection.length > 0) {

				/* Hide bottom HTML not required when no tests exists */
				if (collection.length < 10) {
					this.$('div.hide_if_no_data_bottom').html('&nbsp;');
				}


				var lazy_loader__local_counter = 0;
				var lazy_loader__local_items_displayed_this_render = 0;

                collection.each( function(group) {

                	if (lazy_loader__local_counter < local_this.lazy_load__global_display_per_request) {

	                    collection.sortTests(group);

	                    var view = new App.Views.GroupsList({
	                        model: group,
	                        collection: collection
	                    });

	                    $groups.append(view.render().el);

	                    lazy_loader__local_items_displayed_this_render++

	                }

                	lazy_loader__local_counter++;
                });

                this.lazy_load__items_currently_displayed_on_page = lazy_loader__local_items_displayed_this_render;

	            this.total_results_in_filter = lazy_loader__local_counter;

	            this.showHideLoadMoreButton();

            }
            else {

                /* Hide HTML not required when no tests exists */
                /* Must reference div.class no just .class else IE8 has a heart attack */
                this.$('div.hide_if_no_data, span.hide_if_no_data').html('&nbsp;');
                this.$('div.hide_if_no_data_bottom, span.hide_if_no_data').html('&nbsp;');
                $groups.append(this.templateEmpty({}));
            }

            /* Allow next auto scrolling load in functions.js */
            backbone_loading_data=false;

            return this;
        }
    });

    // GROUPS END












    // LINKS START

    App.Models.Link = Backbone.Model.extend({ });

    App.Collections.Links = Backbone.Collection.extend({
        model: App.Models.Link,

	    initialize: function() {
	        this.sort_key = 'name';
		},

	    comparator: function(a, b) {

        	if (this.sort_key == 'name'){
		        var name_a = a.get(this.sort_key).toUpperCase();
		        var name_b = b.get(this.sort_key).toUpperCase();
		        return (name_a < name_b) ? -1 : (name_a > name_b) ? 1 : 0;
	        } else {
        		/* Can't uppercase INTs */
		        var name_a = a.get(this.sort_key);
		        var name_b = b.get(this.sort_key);
		        return (name_a > name_b) ? -1 : (name_a < name_b) ? 1 : 0; //  reverse order
	        }

		},

		search : function(value){
			if(value == "") return this;

			return _(this.filter(function(data) {
				//var pattern = new RegExp(escapeDataForJson(value),"gi");
				var pattern = new RegExp(value,"gi");
				return pattern.test(data.get("name"));
			}));
		},

		sortDateAdded : function(){
			this.sort_key = 'id';
            return this.sort();
		},

		sortAlphabetical : function(){
			this.sort_key = 'name';
            return this.sort();
		}

    });

    App.Views.Link = Backbone.View.extend({
        tagName: 'li',

        initialize: function() {
            _.bindAll(this, 'render');
            this.model.bind('change', this.render);
            this.template = _.template($('#linkTemplate').html());
        },

        events: {
            //'click .link_container': 'showLinks', // removed to use sitewide $(document).on('click', '.accordion-toggle', function() {
            'click .ex_link': 'showDirectLinkCode'
        },

        /*showLinks: function(event) {
			if (!$(event.target).is("a")){//stop containers closing if clicking a link
            	this.$('.link_container').toggleClass('closed').toggleClass('open');
            	// fetch groups to display use test id to get groups
            	this.$('.link_tests').slideToggle('fast').toggleClass('hide');
			}
        },*/

        showDirectLinkCode: function(event) {
            event.preventDefault();
            this.$('.linksinafold').slideToggle('fast').toggleClass('hide');
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    App.Views.LinksList = App.Views.Link.extend({});


    /*
        Lazy loading only keeps current items on page when Load More when button is pressed or auto scroll
     */
    App.Views.Links = Backbone.View.extend({
        tagName: 'section',

        initialize: function() {
            _.bindAll(this, 'render');
            this.template = _.template($('#linksBaseTemplate').html());
            this.templateEmpty = _.template($('#linkEmptyTemplate').html());
            this.collection.bind('reset', this.render);

            /* Lazy Load vars */
            this.lazy_load__global_display_per_request = backbone_lazy_load__global_display_per_request; // default
	        this.lazy_load__items_currently_displayed_on_page = 0; // default
            this.lazy_load__last_filter_type = 'alpha'; // default
			this.lazy_load__last_filter_value = '';
			this.lazy_load__do_counters_reset = false;

			this.resetLazyLoadCounterVars();
        },

        events: {
            'click .expandAll': 'showLinks',
            'click .collapseAll': 'hideLinks',
			'keyup #link_search': 'search',
	        'click .loadMore': 'renderMore',
	        'click .sortAlphabetical' : 'sortAlphabetical',
	        'click .sortDateAdded' : 'sortDateAdded'
        },

	    resetLazyLoadCounterVars: function (event){
			this.lazy_load__items_currently_displayed_on_page = 0;
			this.total_results_in_filter = 0;
	    },

        showLinks: function(event) {
            event.preventDefault();
            this.$('.link_container').removeClass('closed').addClass('open');
            // fetch groups to display use test id to get groups
            this.$('.link_tests').show().removeClass('hide');
        },

        hideLinks: function(event) {
            event.preventDefault();
            this.$('.link_container').removeClass('open').addClass('closed');
            this.$('.link_tests').hide().addClass('hide');
        },

		search: function(event){
			// Do not put event.preventDefault(); here, it will break search from Top nav global search bar

			var search_value = $("#link_search").val();

			this.lazy_load__last_filter_type = 'by_search';
			this.lazy_load__last_filter_value = search_value;
			this.lazy_load__do_counters_reset = true;

			this.renderList(this.collection.search(search_value));
		},

        sortAlphabetical: function(event) {
            event.preventDefault();

            this.lazy_load__last_filter_type = 'alpha';
			this.lazy_load__last_filter_value = '';
			this.lazy_load__do_counters_reset = true;

            this.renderList(this.collection.sortAlphabetical());
        },

        sortDateAdded: function(event) {
            event.preventDefault();

            this.lazy_load__last_filter_type = 'recently_added';
			this.lazy_load__last_filter_value = '';
			this.lazy_load__do_counters_reset = true;

            this.renderList(this.collection.sortDateAdded());
        },

	    renderMore : function(event) {
			event.preventDefault();

			this.lazy_load__do_counters_reset = false;

        	if (this.lazy_load__last_filter_type === 'alpha'){
        		this.renderList(this.collection);

	        } else if (this.lazy_load__last_filter_type === 'recently_added'){
        		this.renderList(this.collection);

	        } else if (this.lazy_load__last_filter_type === 'by_cat_id') {
		        this.renderList(this.collection.filterByCategoryId(this.lazy_load__last_filter_value));

	        } else if (this.lazy_load__last_filter_type === 'by_search') {
		        this.renderList(this.collection.search(this.lazy_load__last_filter_value));
	        }

	    },






	    showHideLoadMoreButton: function(event){


            if (this.total_results_in_filter > this.lazy_load__items_currently_displayed_on_page){
            	this.$('#load_more_row').show();
            } else {
            	this.$('#load_more_row').hide();
            }

	    },


	    /* Render by filters */
		renderList : function(links){


			if (this.lazy_load__do_counters_reset  === true){
        		this.resetLazyLoadCounterVars();
        		$(".table-body").html("");
        		var display_from =  0;
				var display_to =    this.lazy_load__global_display_per_request;
	        } else {
				var display_from =  this.lazy_load__items_currently_displayed_on_page;
				var display_to =    this.lazy_load__items_currently_displayed_on_page + this.lazy_load__global_display_per_request;

	        }

			this.length_with_results = 0;


        	local_this = this;

			var lazy_loader__local_counter = 0;
			var lazy_loader__local_items_displayed_this_render = 0;

			links.each(function(link){

				if (lazy_loader__local_counter >= display_from && lazy_loader__local_counter < display_to) {
					var view = new App.Views.LinksList({
						model: link,
						collection: this.collection
					});
					$(".table-body").append(view.render().el);

					lazy_loader__local_items_displayed_this_render++;
	            }
            	lazy_loader__local_counter++;
			});

			this.lazy_load__items_currently_displayed_on_page += lazy_loader__local_items_displayed_this_render;

            this.total_results_in_filter = lazy_loader__local_counter;

            this.showHideLoadMoreButton();



			$('.table-body').show();

			/* Allow next auto scrolling load in functions.js */
            backbone_loading_data=false;

			return this;
		},




	    /* Initial render, and called with .sort() */
        render: function() {
            var $links,
                collection = this.collection;

			this.$el.html(this.template({}));



            $links = this.$('.table-body');
            local_this = this;



            if (collection.length > 0) {

				/* Hide bottom HTML not required when no tests exists */
				if (collection.length < 10) {
					this.$('div.hide_if_no_data_bottom').html('&nbsp;');
				}


				var lazy_loader__local_counter = 0;
				var lazy_loader__local_items_displayed_this_render = 0;


                collection.each(function(link){

                	if (lazy_loader__local_counter < local_this.lazy_load__global_display_per_request) {


		                var view = new App.Views.LinksList({
			                model: link,
			                collection: collection
		                });

		                $links.append(view.render().el);

		                lazy_loader__local_items_displayed_this_render++

	                }

                	lazy_loader__local_counter++;
                });

                this.lazy_load__items_currently_displayed_on_page = lazy_loader__local_items_displayed_this_render;

	            this.total_results_in_filter = lazy_loader__local_counter;

	            this.showHideLoadMoreButton();

            }
            else {
                /* Hide HTML not required when no tests exists */
                /* Must reference div.class no just .class else IE8 has a heart attack */
                this.$('div.hide_if_no_data, span.hide_if_no_data').html('&nbsp;');
                this.$('div.hide_if_no_data_bottom, span.hide_if_no_data').html('&nbsp;');
                $links.append(this.templateEmpty({}));
            }

            /* Allow next auto scrolling load in functions.js */
            backbone_loading_data=false;

            return this;
        }
    });

    // LINKS END















    App.Routers.Tests = Backbone.Router.extend({
        routes: {
            '': 'tests',
            'tests': 'tests',
			'tests/': 'tests',
			'tests/:name': 'testsFilter', // e.g. /#tests/Test 10

			'groups': 'groups',
			'groups/': 'groups',
			'groups/:name': 'groupsFilter', // e.g /#groups/Group 8

			'links': 'links',
			'links/': 'links',
			'links/:name': 'linksFilter' // e.g /#links/Link 3

		},

        initialize: function() {
            window.tests = new App.Collections.Tests(json_tests);
            window.categories = new App.Collections.Categories(json_categories);
            window.groups = new App.Collections.Groups(json_groups);
            window.links = new App.Collections.Links(json_links);
        },

        start: function() {
            Backbone.history.start();
        },

        tests: function() {

            this.testsView = new App.Views.Tests({
                collection: window.tests,
                categories: window.categories//,
                //category_parents: window.category_parents
            });

            $('#content').empty();
            $('#content').append(this.testsView.render().el);

        },
		testsFilter:function (name) {
			// render list as usual
			this.testsView = new App.Views.Tests({
				collection:window.tests,
				categories:window.categories,
                category_parents: window.category_parents
			});

			$('#content').empty();
			$('#content').append(this.testsView.render().el);

			$('#content #test_search').val(name); // add search value to search textbox
			this.testsView.search(); // use view to apply search based on search textbox value
		},

        groups: function() {

            this.groupsView = new App.Views.Groups({
                collection: window.groups
            });

            $('#content').empty();
            $('#content').append(this.groupsView.render().el);

        },
		groupsFilter: function(name) {
			this.groupsView = new App.Views.Groups({
				collection: window.groups
			});

			$('#content').empty();
			$('#content').append(this.groupsView.render().el);

			$('#content #group_search').val(name); // add search value to search textbox
			this.groupsView.search(); // use view to apply search based on search textbox value
		},

        links: function() {

            this.linksView = new App.Views.Links({
                collection: window.links
            });

            $('#content').empty();
            $('#content').append(this.linksView.render().el);

        },
		linksFilter:function (name) {

			this.linksView = new App.Views.Links({
				collection:window.links
			});

			$('#content').empty();
			$('#content').append(this.linksView.render().el);

			$('#content #link_search').val(name); // add search value to search textbox
			this.linksView.search(); // use view to apply search based on search textbox value
		}
});

    $(function() {
        window.Workspace = new App.Routers.Tests();
        window.Workspace.start();
    });

});