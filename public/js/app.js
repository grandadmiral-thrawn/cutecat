/**
 * app.js: front-end core
 */

(function ($) {

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
            console.log("You picked left!");
            var data = {side:'left'}
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
