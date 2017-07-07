1. 
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

toggleAll is something we should implement to pjs.
( ) toDo for Heggy

2. 
