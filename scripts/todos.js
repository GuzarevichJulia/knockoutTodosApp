(function () {

    "use strict";

    var storage;
    var allTodosFromStorage;

    function init() {
        storage = storageManager;
        allTodosFromStorage = storage.getTodos();
        viewModel.todos(ko.utils.arrayMap(allTodosFromStorage, function (t) {
            return new TodoItem(t.id, t.content, t.isCompleted)
        }));
        updateArrays();
        viewModel.displayedTodos(viewModel.todos());
    }

    function updateArrays() {
        viewModel.activeTodos(viewModel.todos().filter(function (t) {
            return t.isCompleted() == false;
        }));
        viewModel.completedTodos(viewModel.todos().filter(function (t) {
            return t.isCompleted() == true;
        }));
        viewModel.activeCount(viewModel.activeTodos().length);
        viewModel.isDisplayed((viewModel.todos().length > 0));
    }

    function TodoItem(id, content, isDone) {
        this.id = ko.observable(id);
        this.content = ko.observable(content);
        this.isCompleted = ko.observable(isDone);
    }

    function completeTodo(id) {
        var todo = ko.utils.arrayFirst(viewModel.todos(), function (t) {
            return t.id() == id;
        });

        todo.isCompleted(todo.isCompleted() == true ? false : true);
        updateArrays();
        storage.save(viewModel.todos);
    }

    function deleteTodo(id) {
        var todo = ko.utils.arrayFirst(viewModel.todos(), function (t) {
            return t.id() == id;
        });

        if (todo.isCompleted() == false) {
            var previousAllCount = viewModel.activeCount();
            viewModel.activeCount(previousAllCount - 1);
        }
        viewModel.todos.remove(todo);
        updateArrays();
        viewModel.displayedTodos(viewModel.todos());
        storage.save(viewModel.todos);
    }

    function addTodo(value) {
        var date = new Date();
        var id = date.getTime();
        var newTodo = new TodoItem(id, value, false);
        viewModel.todos.push(newTodo);
        viewModel.displayedTodos(viewModel.todos());
        storage.save(viewModel.todos);
        updateArrays();
    }

    function clearCompletedTodos() {
        for (var i = 0; i < viewModel.completedTodos().length; i++) {
            viewModel.todos.remove(viewModel.completedTodos()[i]);
        }
        storage.save(viewModel.todos);
        updateArrays();
        viewModel.displayedTodos(viewModel.todos());
    }

    function ViewModel() {
        function newTodoHandler(data, event) {
            var inputElement = event.currentTarget;
            if (event.keyCode === 13) {
                var value = (inputElement.value).trim();
                if (value != "") {
                    addTodo(value);
                }
                inputElement.value = "";
            }
            return true;
        };

        function completeHandler(data, event) {
            var element = event.currentTarget;
            completeTodo(element.name);
            return true;
        };

        function destroyHandler(data, event) {
            deleteTodo(event.currentTarget.name);
            return true;
        };

        function showAll() {
            this.displayedTodos(this.todos());
        };

        function showActive() {
            this.displayedTodos(this.activeTodos());
        };

        function showCompleted() {
            this.displayedTodos(this.completedTodos());
        };

        function clearCompleted() {
            clearCompletedTodos();
            return true;
        };

        function saveChanges() {
            var element = event.currentTarget;
            var value = (element.value).trim();
            if(value == "")
            {
                deleteTodo(element.id);
            }
            storage.save(viewModel.todos);
        };

        var todos = ko.observableArray();
        var activeTodos = ko.observableArray();
        var completedTodos = ko.observableArray();
        var displayedTodos = ko.observableArray();
        var activeCount = ko.observable(0);
        var isDisplayed = ko.observable();

        return {
            newTodoHandler: newTodoHandler,
            completeHandler: completeHandler,
            destroyHandler: destroyHandler,
            showAll: showAll,
            showActive: showActive,
            showCompleted: showCompleted,
            clearCompleted: clearCompleted,
            saveChanges: saveChanges,
            todos: todos,
            activeTodos: activeTodos,
            completedTodos: completedTodos,
            displayedTodos: displayedTodos,
            activeCount: activeCount,
            isDisplayed: isDisplayed
        };
    };

    var viewModel = new ViewModel();
    init();
    ko.applyBindings(viewModel);
}());
