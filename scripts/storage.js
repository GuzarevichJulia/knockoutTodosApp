function Storage() {
    var storageType = localStorage;

    return{
        put: function (todo) {
            var jsonData = JSON.stringify(todo);
            storageType.setItem(todo.id, jsonData);
        }
    };
}