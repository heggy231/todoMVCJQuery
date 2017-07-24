/*global jQuery, Handlebars, Router */
jQuery(function ($) {
	'use strict';
	
	// To run debugger on .registerHelper just add a another item with break point .registerHelper()
	// we are adding Handlebars helper to create
	// custom handlebar. eq stands for equality
	// options let you have two templates depend on situations
	Handlebars.registerHelper('eq', function (a, b, options) {
		// a is equal to b then run option.fn() and option.inverse() are HandlebarsTemplates which pass 'this' (data object same obj we passed inside of .footerTemplate(data) in renderFooter() method)
		// if a === b pass, run .fn(this) {{else}} run .inverse()
		// debugger > hover over 'this' you can see it has activeTodoCount, activeTodoWord, completedTodos, filter
		// same as the dataObj passed into renderFooter's this.footerTemplate(dataObj)
		// notice that inside index.html there is no {{else}} therefore options.inverse() is not used
		// ex) index.html under #footer-template > note <a {{#eq filter 'all'}}class="selected"{{/eq}} doesn't have {{else}}
		// if options.inverse() was called there would have been {{else}} inside of <a {{#eq filter 'all'}}class="selected"{{else}}show this instead{{/eq}}
		return a === b ? options.fn(this) : options.inverse(this);
	});

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;
	
	// generating unique id using bit manipulations
	var util = {
		uuid: function () {
			/*jshint bitwise:false */
			var i, random;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
			}

			return uuid;
		},
		pluralize: function (count, word) {
			return count === 1 ? word : word + 's';
		},
		store: function (namespace, data) {
			if (arguments.length > 1) {
				return localStorage.setItem(namespace, JSON.stringify(data));
			} else {
				var store = localStorage.getItem(namespace);
				return (store && JSON.parse(store)) || [];
			}
		}
	};

	var App = {
		init: function () {
			this.todos = util.store('todos-jquery');
			// $('#todo-template').html() raw html string and compile it as Handlebars
			// todoTemplate is Handlebars template, in render()
			// todoTemplate(data) < gets the data
			this.todoTemplate = Handlebars.compile($('#todo-template').html());
			this.footerTemplate = Handlebars.compile($('#footer-template').html());
			this.bindEvents();

			new Router({
				'/:filter': function (filter) {
					this.filter = filter;
					this.render();
				}.bind(this)
			}).init('/all');
		},
		bindEvents: function () {
			$('#new-todo').on('keyup', this.create.bind(this));
			$('#toggle-all').on('change', this.toggleAll.bind(this));
			$('#footer').on('click', '#clear-completed', this.destroyCompleted.bind(this));
			$('#todo-list')
				.on('change', '.toggle', this.toggle.bind(this))
				// textTodo input field is label when dbclick run edit method
				.on('dblclick', 'label', this.edit.bind(this))
				.on('keyup', '.edit', this.editKeyup.bind(this))
				.on('focusout', '.edit', this.update.bind(this))
				.on('click', '.destroy', this.destroy.bind(this));
		},
		// render method shows up where data gets changed in some way
		render: function () {

			// footer has different filters all, active, completed
			// getFilteredTodos() returns arrays of todos depend on which filter
			// we have applied (all/active/completed)
			// this.getFilteredTodos() is an array and on handlebar you can use 'this'
			var todos = this.getFilteredTodos();

			// grab ul id #todo-list, .html() jQuery get return content (even html markup)
			// using HandlebarsTemplate todo insert  todos
			// todoTemplate(todos) is HandlebarsTemplate which gets todos as data
			// its resulting .html() insert into elements that has #todo-list
			// todos is an array that is why we may refer it as 'this'
			$('#todo-list').html(this.todoTemplate(todos));

			// toggle boolean hides (F)/shows (T) element, visibility method
			// show main part of app when there is some todos
			// main includes toggle-all and todo-list elements
			$('#main').toggle(todos.length > 0);
			
			// for toggle all sets .property change 'checked' or unchecked depend on 
			// this.getActiveTodos().length === 0 is true/false
			// #toggle-all; when there is no active todo it is checked since nothing to more to check
			$('#toggle-all').prop('checked', this.getActiveTodos().length === 0);
			this.renderFooter();

			// each time render() is called focus on #new-todo input text area
			$('#new-todo').focus();
			
			// browser based simple database so it remembers your last session when revisit the pg
			util.store('todos-jquery', this.todos);
		},
		renderFooter: function () {
			// number of todos
			var todoCount = this.todos.length;
			// number of activetodo
			var activeTodoCount = this.getActiveTodos().length;
			//  what is passed inside of .footerTemplate is data obj
			// grabs footerTemplate which is html template for footer (all/active..)
			// Now fetch right data for each button on template '1 item left'/'all'/'active'/'completed'/'clear completed'
			var template = this.footerTemplate({
				// ex: 1 item left 
				activeTodoCount: activeTodoCount,
				// ex: item or items 
				// should it be item or multiple items depends on how many todos there are
				// this is done with pluralize method on util obj
				activeTodoWord: util.pluralize(activeTodoCount, 'item'),
				// completedTodos figures out how many there are completedTodos
				// it has. any numbers (true) than show "Clear completed"
				completedTodos: todoCount - activeTodoCount,
				// show outline around selected footer's filtered item
				// eq customeMade HandlebarsTemplate is accessing filter property
				filter: this.filter
			});

			// this displays footer method only when todo exists (todoCount > 0)
			// injecting template (footerTemplate method) into #footer element in html
			$('#footer').toggle(todoCount > 0).html(template);
		},
		toggleAll: function (e) {
			var isChecked = $(e.target).prop('checked');

			this.todos.forEach(function (todo) {
				todo.completed = isChecked;
			});

			this.render();
		},
		getActiveTodos: function () {
			return this.todos.filter(function (todo) {
				return !todo.completed;
			});
		},
		getCompletedTodos: function () {
			return this.todos.filter(function (todo) {
				return todo.completed;
			});
		},
		getFilteredTodos: function () {
			if (this.filter === 'active') {
				return this.getActiveTodos();
			}

			if (this.filter === 'completed') {
				return this.getCompletedTodos();
			}

			return this.todos;
		},
		destroyCompleted: function () {
			this.todos = this.getActiveTodos();
			this.filter = 'all';
			this.render();
		},
		// accepts an element from inside the `.item` div and
		// returns the corresponding index in the `todos` array
		// https://watchandcode.com/courses/77710/lectures/1134202 (48:34)
		// indexFromEl (el) is button.destroy
		// in PJS https://github.com/heggy231/todoList/blob/master/version10.js
		// assigning each todo with id of its position (i) 
    // todoLi.id = i;
		indexFromEl: function (el) { // when press destroy el = button.destroy
      // button.destroy is nested inside of 'li', find .data.id (value of id)
      // index == position of i
      // $(el) is jQuery elements methods (jQuery .closest)
			var id = $(el).closest('li').data('id'); // id is really long string
			var todos = this.todos;
			var i = todos.length;
      
    // while i > 0; first i = todos.length, then it will decrease by 1
		// first i = todo.length into while loop, but while first see this initial 
		// after while stmt process i value then i gets decreased by 1 (i-- post decr)
    // https://youtu.be/rYVy-bUWcXQ
    // pre decrement vs post decrement while loop video hint
			while (i--) {
        // ith todo element's id match ith element of id of e.target
				if (todos[i].id === id) {
          // position of the id of the array is i not id
					return i;
				}
			}
		},
		// create method gets called on keyUp event when key is pressed
		// and let go
		create: function (e) {
			// input field get wrapped in jQuery elemen
			var $input = $(e.target);
			// .val() > get value of input
			// .trim() > trim all the white space
			// in debugger, you can verify that local val equals user's input
			var val = $input.val().trim();

			// e.which is key on keyboard in number (every key has number)
			// if value pressed is not enter key OR no value
			if (e.which !== ENTER_KEY || !val) {
				// get out of create function since user doesn't
				// want to save data no enter or no value (!val) inside
				return;
			}

			// user pressed enter
			this.todos.push({
				// to understand uuid() copy whole function into console
				// in essence uuid() creates unique name for each element in array
				id: util.uuid(),
				// new obj is created under scope > local: this.todos.title
				title: val,
				completed: false
			});

			// it clears val input field
			$input.val('');

			// new item gets display bottom of todoList
			this.render();
		},
		toggle: function (e) {
			var i = this.indexFromEl(e.target);
			this.todos[i].completed = !this.todos[i].completed;
			this.render();
		},
		// this method should be re-named switch to "editingModeLook"
		edit: function (e) {
			// e.target where user clicked on with closest ancestor li that encloses all
			// add css class 'editing' to 'li', from li, .find class of '.edit'
			// it gives edit box the different look for editing mode style
			var $input = $(e.target).closest('li').addClass('editing').find('.edit');
			// parse $input.val($input.val()).focus() for ez understanding
			// it will grab $input and put focus on it (cursor in the input box)
			// however, the cursor is at the beginning of the input
			// if you comment out $input.focus(); you can see no cursor inside the input box
			// jQuery hack to make the cursor to the back 
			// $input.val($input.val()); 


			// $input.focus(); 			// put the cursor inside the input box
			// this is method chaining $input.val($input.val()) and $input.focus();
			$input.val($input.val()).focus();
		},

		// to go thru this in debugger dbclick input field to go 
		// into editing mode, then hit any key ex: 'a' to trigger 
		// editkeyup evnt
		editKeyup: function (e) {
			// e.which is key you pressed = enterkey then blur
			// pressing enter key means user likes to save data
			// e.which (a = 35) != enterKey (13)
			if (e.which === ENTER_KEY) {
				// .blur() takes you out of focus input
				// (takes you out of current edit mode)
				e.target.blur();
			}
			// check if the key you pressed(e.which) is esc?
			// pressing esc means user doesn't want to save data
			if (e.which === ESCAPE_KEY) {
				// we are assigning abort key : true value
				// +(this info is applied inside of update method)
				$(e.target).data('abort', true).blur();
			}
		},
		// update gets triggerred 
		// under editing mode > click outside to loose focus
		// .on('focusout', '.edit', this.update.bind(this))
		// strongly urge to run through debugger on update.
		// debugger shows everything
		update: function (e) {
			// input field where user clicked on
			var el = e.target; // debugger tells el= input.edit
			// wrap el with jQuery element
			var $el = $(el);
			// get value by trimming off all the white space
			var val = $el.val().trim();

			// no value > user prob want to delete
			// if unsure if(!val) will be true or not try Boolean(!"") in console
			if (!val) {
				// remember destroy method find the id > its position of array i
				this.destroy(e);
				return;
			}

			// only runs when esc key is pressed from editKeyup method 'abort is true
			// $(e.target).data('abort', true) > this sets data 'abort': true 
			// when esc key is pressed inside edit mode abort sets false
			if ($el.data('abort')) {
				// set the element data back to original state abort: false
				$el.data('abort', false);
			// any key other than esc key > this code runs
			} else {
			// here we will set the data since esc wasn't pressed
			// indexFromEl(el) returns i position set to new value
			// title (key property name) : val (value) pair
			// this.todo[i].title = val sets property key = value
				this.todos[this.indexFromEl(el)].title = val;
			}
			// when this.render runs it saves data and gets out of edit mode
			this.render();
		},

		// when user press x delete function runs
		// function (e) jquery event object
		destroy: function (e) {
      // e.target stands for x we pressed
      // this.indexFromEl(e.target) first grab id > i (position i)
      // splice delete start i, delete 1 element
      // e.target https://watchandcode.com/courses/60264/lectures/1102312 at 3:40
			this.todos.splice(this.indexFromEl(e.target), 1);
			this.render();
		}
	};

	App.init();
});