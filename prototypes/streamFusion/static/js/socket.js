
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
        // $("#img").attr("src", "data:image/png;base64," + data.buffer);
        // str = "data:image/png;base64," + b64(data.buffer);
        str = "data:image/png;base64," + data.buffer;
        $("#img").attr("src", str);
        window.clearInterval(interval);
        console.log(ms)
    });


    socket.on('imageConversionByServer', function (data) {
        console.log(data);
        $("#img").attr("src", data);
    });


    $('#convert').click(function (event) {
        event.preventDefault();
        if (typeof currentStream === 'undefined') return;

        let src = takeSnapshot();
        const base64 = src.replace(/.*base64,/, '');
        socket.emit('my image', { data: base64 });
        interval = window.setInterval(function () { ms += 1 }, 1);

        return false;
    });
});

document.onkeypress = function (e) {
    if ((e.keyCode || e.which) === 13) {
        e.preventDefault();
        window.clearInterval(interval);
        $('#log').append('<p>Interval cleared</p>');
    }
};

function takeSnapshot() {
    var context;
    var width = video.offsetWidth,
        height = video.offsetHeight;

    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);

    src = canvas.toDataURL('image/png');

    return src;
}