var storage;
var todosFromStorage;
var sha1;

function init() {
    storage = storageManager;
    todosFromStorage = storage.getTodos();
    sha1 = new Hashes.SHA1
}

function TodoItem(id, content, isDone) {
    this.id = id;
    this.content = content;
    this.isCompleted = isDone;
}

function ViewModel() {
    var that = this;
    that.newTodoHandler = function (data, event) {
        var inputElement = event.currentTarget;
        if (event.keyCode === 13) {
            addTodo(inputElement.value);
            inputElement.value="";
        }
        return true;
    };

    that.destroyHandler = function (data, event) {
        deleteTodo(event.currentTarget.name);
        return true;
    }

    that.todos = ko.observableArray(todosFromStorage)
}

function deleteTodo(id) {
    viewModel.todos.remove(function (todo) {
        return todo.id == id;
    });
    storage.save(viewModel.todos);
}

function addTodo (value) {
    var id = sha1.hex(value);
    var newTodo = new TodoItem(id, value, false);
    viewModel.todos.push(newTodo);
    storage.save(viewModel.todos);
}

init();
var viewModel = new ViewModel();
ko.applyBindings(viewModel);

