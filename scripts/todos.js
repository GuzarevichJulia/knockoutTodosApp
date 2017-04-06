function TodoItem(id, content, isDone) {
    this.id = id;
    this.content = content;
    this.isXMLDoc = isDone;
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
        that.todos.splice(0,1);
        return true;
    }

    that.todos = ko.observableArray([
        new TodoItem(2, "second", false),
        new TodoItem(3, "third", false),
        new TodoItem(4, "forth", false)
    ])
}

var viewModel = new ViewModel();

function addTodo (value) {
    var newTodo = new TodoItem(5, value, false);
    viewModel.todos.push(newTodo);
}

ko.applyBindings(viewModel);