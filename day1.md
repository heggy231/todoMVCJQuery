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

