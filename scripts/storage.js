var storageManager = (function () {
    var storage = localStorage;
    var key = "myTodos";
    var todosArray = [];

    init();

    return{
        save: function (todos) {
            var jsonData = ko.toJSON(todos);
            storage.setItem(key, jsonData);
        },

        getTodos: function () {
            return todosArray;
        }
    };

    function init() {
        var todos = getDataFromStorage();
        if (todos != null){
            todosArray = todos;
        }
    }

    function getDataFromStorage() {
        if (storage.getItem(key) != null) {
            var data = JSON.parse(storage[key]);
            return data;
        }
        return null;
    }
})()