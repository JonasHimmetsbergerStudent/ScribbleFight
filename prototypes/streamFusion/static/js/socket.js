
let interval = ping = null;
let ms = 0;
let svg = document.getElementById("boundingBox");
let polygon = document.getElementById("draggable");
let convertedOnce = false
let drawOri = [];


function b64(e) {
    let t = "";
    let n = new Uint8Array(e);
    let r = n.byteLength;
    for (let i = 0; i < r; i++) {
        t += String.fromCharCode(n[i])
    }
    return window.btoa(t)
}


$(document).ready(function () {
    let socket = io();


    socket.on('my response', function (msg) {
        console.log('Received: ' + msg.data);
    });


    socket.on('edge array', function (data) {
        if (interval == null || !interval) return;
        $("#draggable").attr("points", "");
        data = JSON.parse(data.edges);
        data = data.flat(1);

        for (value of data) {
            let point = svg.createSVGPoint();
            point.x = value[0];
            point.y = value[1];
            polygon.points.appendItem(point);
        }

        window.clearInterval(ping);
        $('#ping').html('<p>Ping: ' + ms + '</p>');
    });


    socket.on('perspective transformed', function (msg) {
        if (msg.error) {
            alert(msg.error)
            return;
        }
        str = "data:image/png;base64," + msg.buffer;
        $("#img").attr("src", str);
        $("#img").attr("src", str);
    });


    $('#convert').click(function (e) {
        if (!convertedOnce) {
            convertedOnce = true;
            interval = window.setInterval(function () {
                emitImage()
            }, 500);
            $("#snap").css('visibility', 'visible')
            $('#convert').css('visibility', 'hidden');
        } else {
            if (snap === null || polygon.points.length === 0) return;
            const base64 = snap.src.replace(/.*base64,/, '');
            let snipset = [];
            [...polygon.points].forEach(element => {
                snipset.push([element.x, element.y]);
            });
            socket.emit('getDataFromImage', { img: base64, snipset: snipset });
            $('main').css('display', 'none');
            $('#log').css('visibility', 'visible')
            $("div.ui-draggable").remove();
        }
    });

    function emitImage() {
        if (typeof currentStream === 'undefined') return;

        let src = takeSnapshot().src;
        const base64 = src.replace(/.*base64,/, '');
        socket.emit('my image', { data: base64 });
        ms = 0;
        ping = window.setInterval(function () { ms += 1 }, 1);
    }
});


document.onkeypress = function (e) {
    /*if ((e.keyCode || e.which) === 13) {
        e.preventDefault();
        window.clearInterval(interval);
        console.log('Interval cleared');
    }*/
};


function takeSnapshot() {
    let context;
    let width = video.offsetWidth,
        height = video.offsetHeight;

    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);

    src = canvas.toDataURL('image/png');

    return { src: src, canvas: canvas };
}