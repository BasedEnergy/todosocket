$(function () {

    const state = {
        todoList: [],
        baseUrl: 'https://devin-todolist.herokuapp.com'
    };

    const render = function () {

        $.ajax({
            url: state.baseUrl + '/api/data',
            type: 'GET',
            success: function (data) {
                state.todoList = data;

                $('#list').empty();

                state.todoList.forEach((li, i) =>
                    $('#list').append(
                        $('<li>').attr('id', 'item' + i).append([
                            $('<input>').attr({ type: 'checkbox', id: i + li._id, class: 'check', checked: (li.checked === 'true') }),
                            $('<label>').attr({ for: 'li' + i, class: 'lbl' }).append(li.label),
                            $('<button>').attr({ id: li._id + i, class: 'delete' }).append(
                                $('<i>').attr('class', 'fas fa-times')
                            )
                        ])
                    )
                );
            }
        });
    };


    $('#addbutton').on('click', function () {

        const newItem = {
            label: $('#input').val().trim(),
            checked: false
        };

        $.ajax({
            url: state.baseUrl + '/api/data',
            type: 'POST',
            data: { item: newItem },
            success: function (done) {
                if (done)
                    render();
            }
        });
    });


    $('#list').on('click', '.delete', function () {
        //Extracting _id from the id
        let ID = $(this).attr('id');
        ID = ID.slice(0, ID.length - 1);

        $.ajax({
            url: state.baseUrl + '/api/data',
            type: 'DELETE',
            data: { _id: ID },
            success: function (done) {
                if (done)
                    render();
            }
        });
    });


    $('#list').on('click', '.check', function () {
        //Extracting label from the id
        let ID = $(this).attr('id');
        ID = ID.slice(1, ID.length);

        $.ajax({
            url: state.baseUrl + '/api/data',
            type: 'PUT',
            data: { _id: ID, checked: $(this).is(':checked') },
            success: function (done) {
                if (done)
                    render();
            }
        });
    });

    render();
});