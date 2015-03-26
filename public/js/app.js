/**
 * app.js: front-end core
 */

(function ($) {
    
    // Create modal alert windows (using Foundation reveal)<-- creates a light box that drops down
    function modal_alert(bodytext, bodytag, headertext) {
        var modal_body;
        if (headertext) {
            $('#modal-header').empty().text(headertext);
        }
        if (bodytext) {
            modal_body = (bodytag) ? $('<' + bodytag + ' />') : $('<p />');
            $('#modal-body').empty().append(
                modal_body.text(bodytext)
            );
        }
        $('#modal-dynamic').foundation('reveal', 'open');
    }

    // Receive messages through websocket from server
    function socket_listeners(socket) {
        var messages, markup;
        messages = [];
        socket.on('message', function (data) {
            if (data && data.message) {
                messages.push(data.message);
                markup = '';
                for (var i = 0, len = messages.length; i < len; ++i) {
                    markup += messages[i] + '<br />';
                }
                $('#content').html(markup);
            }
        });
    }

    // Send messages through websocket to server
    function socket_emitters(socket) {
        $('#chat-form').submit(function (event) {
            event.preventDefault();
            socket.emit('send', {
                message: $('#field').val()
            });
            this.reset();
        });
        $("#pick-left").click(function (event) {
            event.preventDefault();
            var data = {side:'left'};
            var prompt = "...just like everyone else!";
            modal_alert(prompt, "h4", "You picked cat 1!");
        });
        $("#pick-right").click(function (event) {
            event.preventDefault();
            var data = {side:'right'};
            var prompt = "...like a boss!";
            modal_alert(prompt, "h4", "You picked cat 2!");
        });
    }

    $(document).ready(function () {
        var socket_url, socket;
        
        socket_url = window.location.protocol + '//' + document.domain + ':' + location.port;
        socket = io.connect(socket_url);
        socket.on("connect", function(){
            socket_listeners(socket);
            socket_emitters(socket);  
        });
    });

})(jQuery);
