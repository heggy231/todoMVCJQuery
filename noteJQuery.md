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