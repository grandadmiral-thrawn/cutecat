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
        socket.on('new-cats', function (data) {
            if (data && data.left){
                var imagepath = '/images/';
                $('#pick-left img').attr('src', imagepath+data.left);
                $('#pick-right img').attr('src', imagepath+data.right);
            }
        });
        socket.on('picked-count', function (data) {
            var tagline, modaltext;
            if (data && data.times_picked) {
                if (data.side==='left') {
                    modaltext = "You picked cat 1!";
                    
                } else {
                    modaltext = "You picked cat 2!";
                    
                }
                tagline = "Just like " + data.times_picked+ " other people";
                /* displays in the drop down lightbox as header text (modal alert)*/
                modal_alert(tagline, "h4", modaltext);
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
            /* function for getting which cat was picked and the file-name*/
            var data = {
                side:'left',
                filename: $('#pick-left img').attr('src')};
            socket.emit('picked', data);
            /* displays in the drop down lightbox as body text (modal alert)*/    
            
        });
        $("#pick-right").click(function (event) {
            event.preventDefault();
            var data = {
                side:'right',
                filename: $('#pick-right img').attr('src')};
            socket.emit('picked', data);
        });
    }

    /* doc ready is like the main function */
    $(document).ready(function () {
        var socket_url, socket;
        /* socket_listeners and socket_emitters come online to set up an environment where we can have call backs */
        socket_url = window.location.protocol + '//' + document.domain + ':' + location.port;
        socket = io.connect(socket_url);
        socket.on("connect", function(){
            socket_listeners(socket);
            socket_emitters(socket);  
        });
    });

})(jQuery);
