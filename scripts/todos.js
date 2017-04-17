var storage;
var allTodosFromStorage;
var sha1;

function init() {
    storage = storageManager;
    allTodosFromStorage = storage.getTodos();
    sha1 = new Hashes.SHA1;
}

function updateArrays() {
    viewModel.activeTodos(viewModel.todos().filter(function (t) {
        return t.isCompleted == false;
    }));
    viewModel.completedTodos(viewModel.todos().filter(function (t) {
        return t.isCompleted == true;
    }));
    viewModel.activeCount(viewModel.activeTodos().length);
}

function TodoItem(id, content, isDone) {
    this.id = id;
    this.content = content;
    this.isCompleted = isDone;
}

function completeTodo(id) {
    var todo = ko.utils.arrayFirst(viewModel.todos(), function (t) {
        return t.id == id;
    });

    if(todo.isCompleted == true) {
        todo.isCompleted = false;
    }
    else {
        todo.isCompleted = true;
    }
    updateArrays();
    storage.save(viewModel.todos);
    console.log(viewModel.todos());
}

function deleteTodo(id) {
    var todo = ko.utils.arrayFirst(viewModel.todos(), function (t) {
        return t.id == id;
    });
    if (todo.isCompleted == false){
        var previousAllCount = viewModel.activeCount();
        viewModel.activeCount(previousAllCount - 1);
    }
    viewModel.todos.remove(todo);
    updateArrays();
    viewModel.displayedTodos(viewModel.todos());
    storage.save(viewModel.todos);
}

function addTodo (value) {
    var id = sha1.hex(value);
    var newTodo = new TodoItem(id, value, false);
    viewModel.todos.push(newTodo);
    viewModel.displayedTodos(viewModel.todos());
    storage.save(viewModel.todos);
    updateArrays();
}

function clearCompletedTodos() {
    for(var i = 0; i < viewModel.completedTodos().length; i++){
        viewModel.todos.remove(viewModel.completedTodos()[i]);
    }
    storage.save(viewModel.todos);
    updateArrays();
    viewModel.displayedTodos(viewModel.todos());
}

init();

var viewModel = {
    that : this,
    newTodoHandler : function (data, event) {
        var inputElement = event.currentTarget;
        if (event.keyCode === 13) {
            addTodo(inputElement.value);
            inputElement.value="";
        }
        return true;
    },

    completeHandler : function (data, event) {
        var element = event.currentTarget;
        completeTodo(element.name);
        return true;
    },

    destroyHandler : function (data, event) {
        deleteTodo(event.currentTarget.name);
        return true;
    },

    showAll : function () {
        this.displayedTodos(this.todos());
    },

    showActive : function () {
        this.displayedTodos(this.activeTodos());
    },

    showCompleted : function () {
        this.displayedTodos(this.completedTodos());
    },

    clearCompleted : function () {
        clearCompletedTodos();
        return true;
    },

    todos : ko.observableArray(allTodosFromStorage),
    activeTodos : ko.observableArray(),
    completedTodos : ko.observableArray(),
    displayedTodos : ko.observableArray(allTodosFromStorage),
    activeCount : ko.observable(0)
}

updateArrays();
ko.applyBindings(viewModel);

