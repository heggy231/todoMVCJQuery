Mapped method:

#new-todo			         =>  keyup		=>  .create ()			// key is released
#toggle-all			         =>  change		=>  .toggleAll ()		         // value of input changes
#footer #clear-completed	=>  click		=>  .destroyCompleted ()	// click
#todo-list  .toggle		         =>  change		=>  .toggle ()			// value of input changes
#todo-list  label		         =>  dbclick		=>  .edit ()			         // double click
#todo-list  .edit			=>  keyup		=>  .editKeyup ()		         // key is released
#todo-list  .edit			=>  focusout        =>  .update ()			// element loses focus
#todo-list  .destroy		=>  click		=>  .destroy ()			// click


This is map of element inside of DOM
1. start from index.html
look up each method calls for eventListener $().on('mouseEvent',this.methodCall)
check to see Event Listeners corresponds each event Listeners

ex) 
$('#new-todo').on('keyup', this.create.bind(this));
look up id: '#new-todo'  in index.html, confirm eventListener exists

- Note: when in element tab under console, remember to have Event Listeners tab clicked.
- Note2: uncheck Ancestors under Event Listeners

Under Event listerners tab, also note that it tells you where the script is called.  for #new-todo calls this.create method as the below code indicated:
$('#new-todo').on('keyup', this.create.bind(this));

2. #toggle-all under 
$('#toggle-all').on('change', this.toggleAll.bind(this));

		toggleAll: function (e) {
      // looking at value of 'checked' property .prop('checked')
      // under console select <input id="toggle-all" type="checkbox"> $0
      // $0.checked true when checked vs false unclicked
			var isChecked = $(e.target).prop('checked');

			this.todos.forEach(function (todo) {
        // set todo.completed equal current state of isChecked f/t
				todo.completed = isChecked;
			});

			this.render();
		},

- ( ) toDo for Heggy: toggleAll method implement in pjs.

Step to play around in DOM element's property .check to inspect what .prop('checked') is doing.
- Go to console, element tab, search #toggle
- select it now it is $0
- go to console > $0
  <input id="toggle-all" type="checkbox">
- $0.checked // if checked > true outputs vice versa

4. .filter()
getActiveTodos: function () {
      // array.filter filters some elements out (callback function is true leave alone)
      // when callback function returns false it will keep 
			return this.todos.filter(function (todo) {
				return !todo.completed;
			});

- Main function of filter: filter unwanted items.  if filter is true>> keep; otherwise>> delete;

- play around:
// basic idea of filter
var originalArray = [0, 1, 0, 1, 0];
// filter only 1's and remove anything else out.
function filterFunction(number){
	return number === 1;
}
// pass in filterFunction (callback function) into filter (higherorder function)
// higher order function summary https://watchandcode.com/courses/practical-javascript/lectures/1126356

originalArray.filter(function filterFunction(number){
	return number === 1;
});
// OR simply calling the name of filterFunction
originalArray.filter(filterFunction);

- Console activity:
// basic idea of filter
var originalArray = [0, 1, 0, 1, 0];
// filter only 1's and remove anything else out.
function filterFunction(number){
	return number === 1;
}
// pass in filterFunction (callback function) into filter (higher order function)
// higher order function summary https://watchandcode.com/courses/practical-javascript/lectures/1126356

originalArray.filter(function filterFunction(number){
	return number === 1;
});
// OR simply calling the name of filterFunction
originalArray.filter(filterFunction);

- Lesson from console: filters return items only if stmt is true

5) understanding getActiveTodos's filter()'s callback function !todo.completed

		getActiveTodos: function () {
      // array.filter filters some elements out (callback function is true leave alone)
      // when callback function returns false it will keep 
			return this.todos.filter(function (todo) {
				return !todo.completed;
			});

- console excercise:

 var todo = { completed: false
	// I am active todo; not done yet!
}

function prepForFilterForActiveTodo(todo) {
    // active todo> completed: false
    // but filter method only filters true
    // therefore, flip it !todo.completed >> !false > true
	return !todo.completed;
}

// make sure todo.completed is indeed false
// we are assigning todo.completed to be false.
todo.completed = false;  
prepForFilterForActiveTodo(todo);

- now pass in prepForFilterForActiveTodo(todo) in higher order function todos.filter.

- create a todos array with todos.completed
var todos = [{completed:false}, {completed: true}, {completed: false}];

todos.filter(function prepForFilterForActiveTodo(todo){
	return !todo.completed;
});
// returns 2 objects since 2 objts becomes true when prepForFilterForActiveTodo() callback function evaluates !todo.completed;

6) getCompletedTodos() is just the opposite getActiveTodos() 

- console playtime:
// first set simple test case to check my prepForFilterForActiveTodo function
// is working
var todos = {completed: true};

function prepForFilterForActiveTodo(todo) {
    // active todo> completed: false
    // but filter method only filters true
    // therefore, flip it !todo.completed >> !false > true
	return todo.completed;
}

todos; // output: true

// create a real test case todo with label and completed

var todo = [
    {label: "thing1",
	completed: true},

    {label: "thing2",
	completed: false},

    {label: "thing3",
	completed: true}
];

todo.filter(function prepForFilterForActiveTodo(todo) {
    // active todo> completed: false
    // but filter method only filters true
    // therefore, flip it !todo.completed >> !false > true
	return todo.completed;
}); 
// output: 2 objects with true has been filtered out 

7) Under Note: 2- See what `this` is without using bind.

- pick #toggle-all to experiment 

create funtion under bindEvents:
	// this will show what bind.this is set to.
	      function whatIsThis(){
        console.log(this);
      }

- first try with '#toggle-all' 
original:
$('#toggle-all').on('change', this.toggleAll.bind(this));

change to:
$('#toggle-all').on('change', whatIsThis);

once you go to app and click 'toggle-all' button
you will see the output on the console
<input id="toggle-all" type="checkbox">
which means this is pointing to '#toggle-all'

However, for our use, we want to bind this to App object.  Therefore, 
$('#toggle-all').on('change', this.toggleAll.bind(this));  // this points to App objt

- !Note the syntax for .on to bind just pass in the function definition (whatIsthis) with no ().  Syntax is NOT function() but just function definition (such as whatIsThis)
$('#toggle-all').on('change', whatIsThis);

- ( ) read about .call() 
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call

https://www.w3schools.com/js/js_function_call.asp

8) learn about method chaining
      $('#todo-list')
				.on('change', '.toggle', this.toggle.bind(this))
				.on('dblclick', 'label', this.edit.bind(this))
				.on('keyup', '.edit', this.editKeyup.bind(this))
				.on('focusout', '.edit', this.update.bind(this))
				.on('click', '.destroy', this.destroy.bind(this));

- play in console:

// learn about technique: method chaining
// first, create an empty obj
var myFakeElement = {};

var myFakeElement = {
// 'on' method
	on: function(something) {
		console.log('Running .on with ' + something);
	}
};

myFakeElement.on('gordon');
// Running .on with gordon

However, when you run myFakeElement as method chaining you must return this at the end of the function.

var myFakeElement = {
// 'on' method
	on: function(something) {
		console.log('Running .on with ' + something);
		return this;
	}
};

myFakeElement
	.on('heggy')
	.on('frankie')
	.on('rajeev');

// second method chaining will run this.on('frankie')

// output: Running .on with heggy, 
						Running .on with frankie, 
						Running .on with rajeev


9) Day 3

- play in console to understand $($0).data(key,value)
- Remember, $0 means selected element

- $($0).data() is jQuery method that enables you to save arbitrary data on elements
	$($0) // $0 is element selected <ul id="todo-list"> and then wrap it up with jQuery element
        // either $($0) or jQuery($0)
	var heggyElement = $($0); // this sets heggyElement as jQuery element
	heggyElement // call heggyElement

	// output: [ul#todo-list, context: ul#todo-list] // this is jQuery wrapped element

	heggyElement.data('name', 'frankie'); // set heggyElement with data name: frankie
	// output: [ul#todo-list, context: ul#todo-list]

	heggyElement.data('name'); // give me back frankie

- In summary .data() is jQuery method that save arbitrary data on elements
- now going back we look at editKeyup method;
	// we are assigning abort: true (this is applied inside of update method)
		$(e.target).data('abort', true).blur();

(10) update method has 3 different path
https://watchandcode.com/courses/77710/lectures/1232964 day 3 (43:21)

- First, input.val nothing

- Second, .data('abort', true) from editKeyup method abort to be true

- Third, else .data('abort', false) from editKeyup method abort to be false which is the original state of the .data(key,value)

Summary, update method is codependent of editKeyup method (both method needs tobe study at the same time)

(11) uuid play time:
- if code looks complex just copy paste in console
- Remember to name it first before running

function uuid () {
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
		}
uuid();

// output: "52eb4800-5cf2-4cc9-bf37-518d6e376f47" same structure 
// with random string with dashes inbtwn

(12) Day 4 Templating
https://watchandcode.com/courses/77710/lectures/1284592

- render method 
Looking over whole app find where render() is called.

(13) Day 4 Handlebars
- play in console first using simple string turn it into handlebars
// PreReq read: https://github.com/wycats/handlebars.js/
// First, go to http://tryhandlebarsjs.com/
// Second, type in console Handlebars
// Output: d {helpers: Object, partials: Object, decorators: Object, __esModule: true, HandlebarsEnvironment: function…}

// <div> {{title}} </div>
// {title: 'I am the one'}
// we want word to show up inside html element replacing mustache {{title}}
// <div> I am the one </div>

var htmlTemplate = '<div>{{title}}</div>';
// turn string into handlebars template
// set a new var to Handlars' compile method pass in handlebars template (htmlTemplate)
var handlebarsTemplate = Handlebars.compile(htmlTemplate);
handlebarsTemplate({title: 'I am the one'}); // make this into html element
// output: <div> I am the one </div>
