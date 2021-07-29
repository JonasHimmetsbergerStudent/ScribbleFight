
let interval = ping = null,
    ms = 0,
    svg = document.getElementById("boundingBox"),
    polygon = document.getElementById("draggable"),
    drawOri = [],
    converted = false;


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
    $('#contr, #snap').css('visibility', 'hidden');
    $('#log, #convert, #back, #adjustment, #loading').css('display', 'none');
    $("#start").on("click", function () {
        $("#startCover").css('display', 'none')
        screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
        screen.orientation.lock("portrait")
            .then(function () {
                alert('Locked');
            })
            .catch(function (error) {
                console.warn(error);
            });
        $('#loading').css('display', 'flex')
        startCameraStream();

        interval = window.setInterval(function () {
            emitImage()
        }, 500);

    });

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

            let x = value[0] * video.offsetWidth / 500;
            if (x < 10) x = 10
            if (x > (video.offsetWidth - 10)) x = video.offsetWidth - 10

            let y = value[1] * video.offsetHeight / (500 * video.offsetHeight / video.offsetWidth);
            if (y < 10) y = 10
            if (y > (video.offsetHeight - 10)) y = video.offsetHeight - 10

            point.x = x
            point.y = y
            polygon.points.appendItem(point);
        }
        $('#snap').css('visibility', 'visible')
        $('#loading').css('display', 'none')
        window.clearInterval(ping);
        $('#ping').html('<p>Ping: ' + ms + '</p>');
    });


    socket.on('perspective transformed', function (msg) {
        $('#loading').css('display', 'none');
        if (msg.error) {
            alert(msg.error)
            return;
        }
        $('#convert, div.ui-draggable, main').css('display', 'none');
        $('#log, #adjustment').css('display', 'flex')
        str = "data:image/png;base64," + msg.buffer;
        $("#img").attr("src", str);
    });

    socket.on('playable map', function (msg) {
        $('#loading').css('display', 'none');
        if (msg.error) {
            alert(msg.error)
            return;
        }
        alert(msg.map)
    });


    $('#convert').click(function (e) {
        if (snap === null || polygon.points.length === 0) {
            alert('Convertion failed');
            return;
        }
        const base64 = snap.src.replace(/.*base64,/, '');
        let snipset = [],
            ratio = video.videoWidth / $('#converted canvas').width();
        [...polygon.points].forEach(element => {
            snipset.push([element.x * ratio, element.y * ratio]);
        });
        socket.emit('getDataFromImage', { img: base64, snipset: snipset });
        $('#loading').css('display', 'flex');
        converted = true;
    });

    $('#back').click(function (e) {
        if (!converted) {
            $('#loading').css('display', 'flex');
            $("div.ui-draggable, #converted canvas").remove();
            $('#snap').css('visibility', 'visible');
            $('#ping').css('display', 'block');
            $('#converted').css('display', 'none');
            video.style.display = "flex";
            $('#convert').prop('disabled', false);
            $('#convert, #back').css('display', 'none');
            $('#loading').css('display', 'flex')
            startCameraStream();

            interval = window.setInterval(function () {
                emitImage()
            }, 500);
        } else {
            converted = false;
            $('#convert, div.ui-draggable, main').css('display', 'flex');
            $('#log, #adjustment').css('display', 'none')
        }
    });


    $('#send').click(function () {
        let w = $('#img').get(0).getBoundingClientRect().width;
        let h = $('#img').get(0).getBoundingClientRect().height;
        $('#log').width(w).height(h)
        html2canvas($('#log').get(0)).then(canvas => {
            src = canvas.toDataURL('image/png');
            const base64 = src.replace(/.*base64,/, '');
            socket.emit('convert img to map', { data: base64 });
            $('#loading').css('display', 'flex');
        });
        $('#log').width('100%').height('100%')
    })

    function emitImage() {
        if (typeof currentStream === 'undefined') return;
        let src = takeSnapshot(false).src;
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

