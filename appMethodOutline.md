#new-todo			         =>  keyup		=>  .create ()			// key is released
#toggle-all			         =>  change		=>  .toggleAll ()		         // value of input changes
#footer #clear-completed	=>  click		=>  .destroyCompleted ()	// click
#todo-list  .toggle		         =>  change		=>  .toggle ()			// value of input changes
#todo-list  label		         =>  dbclick		=>  .edit ()			         // double click
#todo-list  .edit			=>  keyup		=>  .editKeyup ()		         // key is released
#todo-list  .edit			=>  focusout        =>  .update ()			// element loses focus
#todo-list  .destroy		=>  click		=>  .destroy ()			// click

This is map of element inside of DOM

https://docs.google.com/presentation/d/1m9ko9z3V6ohtUj4war3B-FYcfAj4d6pLpXaszukDAjA/edit?usp=sharing