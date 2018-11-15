$(document).ready(function () {
    var $newItemInput = $("input.new-item");
    var $todoContainer = $(".todo-container");
    var $dateRow = $(".date-row");
    $(document).on("click", "button.delete", deleteTodo);
    $(document).on("click", "button.complete", toggleComplete);
    $(document).on("click", ".todo-item", editTodo);
    $(document).on("keyup", ".todo-item", finishEdit);
    $(document).on("blur", ".todo-item", cancelEdit);
    $(document).on("submit", "#todo-form", insertTodo);

    var todos = [];
    var socket = io.connect('http://localhost:8080');

    getTodos();
    showDate();

    function showDate() {
        var date = moment().format("dd MMM Do YY");
        $dateRow.prepend(date);
    }

    function initializeRows() {
        $todoContainer.empty();
        var rowsToAdd = [];
        for (var i = 0; i < todos.length; i++) {
            rowsToAdd.push(createNewRow(todos[i]));
        }
        $todoContainer.prepend(rowsToAdd);
    }

    function getTodos() {
        $.get("/api/todos", function (data) {
            todos = data;
            initializeRows();
        });
    }

    function deleteTodo(event) {
        event.stopPropagation();
        var id = $(this).data("id");
        $.ajax({
            method: "DELETE",
            url: "/api/todos/" + id
        }).then(getTodos);
    }

    function editTodo() {
        var currentTodo = $(this).data("todo");
        $(this).children().hide();
        $(this).children("input.edit").val(currentTodo.text);
        $(this).children("input.edit").show();
        $(this).children("input.edit").focus();
    }

    function toggleComplete(event) {
        event.stopPropagation();
        var todo = $(this).parent().data("todo");
        todo.complete = !todo.complete;
        updateTodo(todo);
    }

    function finishEdit(event) {
        var updatedTodo = $(this).data("todo");
        if (event.which === 13) {
            updatedTodo.text = $(this).children("input").val().trim();
            $(this).blur();
            updateTodo(updatedTodo);
        }
    }

    function updateTodo(todo) {
        $.ajax({
            method: "PUT",
            url: "/api/todos",
            data: todo
        }).then(getTodos);
    }

    function cancelEdit() {
        var currentTodo = $(this).data("todo");
        if (currentTodo) {
            $(this).children().hide();
            $(this).children("input.edit").val(currentTodo.text);
            $(this).children("span").show();
            $(this).children("button").show();
        }
    }

    function createNewRow(todo) {
        var $newInputRow = $(
            [
                "<li class='list-group-item todo-item'>",
                "<span>",
                todo.text,
                "</span>",
                "<input type='text' class='edit' style='display: none;'>",
                "<button class='delete btn btn-danger'>x</button>",
                "<button class='complete btn btn-primary'>✓</button>",
                "</li>"
            ].join("")
        );

        $newInputRow.find("button.delete").data("id", todo.id);
        $newInputRow.find("input.edit").css("display", "none");
        $newInputRow.data("todo", todo);
        if (todo.complete) {
            $newInputRow.find("span").css("text-decoration", "line-through");
        }
        return $newInputRow;
    }

    function insertTodo(event) {
        event.preventDefault();
        var todo = {
            text: $newItemInput.val().trim(),
            complete: false
        };

        $.post("/api/todos", todo, getTodos);
        socket.emit('new-todo', {todo : todo});
        $newItemInput.val("");
    }

    socket.on('emit-todo', function(data){
        console.log(data);
    });

});