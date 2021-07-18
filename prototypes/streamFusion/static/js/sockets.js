
var interval = null;
var ms = 0;

function b64(e) {
    var t = "";
    var n = new Uint8Array(e);
    var r = n.byteLength;
    for (var i = 0; i < r; i++) {
        t += String.fromCharCode(n[i])
    }
    return window.btoa(t)
}

$(document).ready(function () {
    var socket = io();

    socket.on('my response', function (msg) {
        $('#log').append('<p>Received: ' + msg.data + '</p>');
    });

    socket.on('imageConversionByClient', function (data) {
        console.log(data.buffer);
        // $("#img").attr("src", "data:image/png;base64," + b64(data.buffer));
        $("#img").attr("src", "data:image/png;base64," + data.buffer);
        window.clearInterval(interval);
        console.log(ms)
    });

    socket.on('imageConversionByServer', function (data) {
        console.log(data);
        $("#img").attr("src", data);
    });

    $('form#emitImage').submit(function (event) {
        event.preventDefault();
        const reader = new FileReader();
        reader.onload = function () {
            const base64 = this.result.replace(/.*base64,/, '');
            socket.emit('my image', { data: base64 });
            interval = window.setInterval(function () { ms += 1 }, 1);
        };
        reader.readAsDataURL(document.getElementById("image").files[0]);
        return false;
    });
    // $('form#emit').submit(function (event) {
    //     interval = window.setInterval(function () {
    //         socket.emit('my event', { data: $('#emit_data').val() });
    //     }, 1000);
    //     return false;
    // });
    // $('form#broadcast').submit(function (event) {
    //     socket.emit('my broadcast event', { data: $('#broadcast_data').val() });
    //     return false;
    // });
});

document.onkeypress = function (e) {
    if ((e.keyCode || e.which) === 13) {
        e.preventDefault();
        window.clearInterval(interval);
        $('#log').append('<p>Interval cleared</p>');
    }
};