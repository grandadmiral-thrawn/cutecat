(function ($) {
    $(document).ready(function () {

        var messages = [];
        var socket_url = window.location.protocol + '//' + document.domain + ':' + location.port;
        var socket = io.connect(socket_url);
        var field = $("#field")[0];
        var sendButton = $("#send")[0];
        var content = $("#content")[0];

        socket.on('message', function (data) {
            if(data.message) {
                messages.push(data.message);
                var html = '';
                for (var i = 0; i < messages.length; ++i) {
                    html += messages[i] + '<br />';
                }
                content.innerHTML = html;
            } else {
                console.log("There is a problem:", data);
            }
        });

        sendButton.onclick = function (event) {
            event.preventDefault();
            var text = field.value;
            socket.emit('send', { message: text });
        }; 
    });
})(jQuery);
