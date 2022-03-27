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
        console.log(data.clientId)
        let gameId = data.gameId;
        let clientId = data.clientId;
        let localGameId = localStorage.getItem("myGame");
        let localClientId = localStorage.getItem("myId")
        //console.log("Bruhhh")
        console.log("localclient: " + localClientId)
        console.log("Client: " + clientId)
        if (gameId != localGameId && clientId != localClientId) {
            console.log("Falscher Client/Game");
        } else {
            console.log("Bis zu edge Array")
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
        }
    });


    socket.on('perspective transformed', function (msg) {
        console.log(msg.clientId)
        let gameId = msg.gameId;
        let clientId = msg.clientId;
        let localGameId = localStorage.getItem("myGame");
        let localClientId = localStorage.getItem("myId")
        //console.log("Bruhhh")
        console.log("localclient: " + localClientId)
        console.log("Client: " + clientId)
        if (gameId != localGameId && clientId != localClientId) {
            console.log("Falscher Client/Game");
        } else {
            console.log("Bis zu Perspective")
            $('#loading').css('display', 'none');
            if (msg.error) {
                alert(msg.error)
                return;
            }
            $('#convert, div.ui-draggable, main').css('display', 'none');
            $('#log, #adjustment').css('display', 'flex')
            str = "data:image/png;base64," + msg.buffer;
            $("#img").attr("src", str);
        }
    });

    socket.on('playable map', function (msg) {
        console.log(msg.clientId)
        let gameId = msg.gameId;
        let clientId = msg.clientId;
        let localGameId = localStorage.getItem("myGame");
        let localClientId = localStorage.getItem("myId");
        let img = msg.img;
        let map = msg.map;
        //console.log("Bruhhh")
        console.log("localclient: " + localClientId)
        console.log("Client: " + clientId)
        console.log("Bittte")
        if (gameId != localGameId && clientId != localClientId) {
            console.log("Falscher Client/Game");
        } else {

            console.log(img);

            const socketBen = io('http://localhost:3001')
            const payLoad = {
                "method": "picUploaded",
                "clientId": clientId,
                "gameId": gameId,
                "img": img,
                "map": map
            }

            socketBen.emit('picUploaded', payLoad)

            $('#loading').css('display', 'none');
            if (msg.error) {
                alert(msg.error)
                return;
            }
            // alert(msg.map)
        }

        // Zurück zum Ben Teil lets go

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
        let gameId = localStorage.getItem("myGame");
        let clientId = localStorage.getItem("myId");
        console.log("Bis zu GetData")
        socket.emit('getDataFromImage', {
            img: base64,
            snipset: snipset,
            gameId: gameId,
            clientId: clientId
        });
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
                console.log("Bis !converted")
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
        let gameId = localStorage.getItem("myGame");
        let clientId = localStorage.getItem("myId");
        html2canvas($('#log').get(0)).then(canvas => {
            src = canvas.toDataURL('image/png');
            const base64 = src.replace(/.*base64,/, '');
            socket.emit('convert img to map', {
                data: base64,
                gameId: gameId,
                clientId: clientId
            });
            $('#loading').css('display', 'flex');
        });
        $('#log').width('100%').height('100%')
    })

    function emitImage() {
        let gameId = localStorage.getItem("myGame");
        let clientId = localStorage.getItem("myId");
        if (typeof currentStream === 'undefined') return;
        let src = takeSnapshot(false).src;
        const base64 = src.replace(/.*base64,/, '');
        socket.emit('my image', {
            data: base64,
            gameId: gameId,
            clientId: clientId
        });
        ms = 0;
        ping = window.setInterval(function () {
            ms += 1
        }, 1);
    }
});

var convertBase64ToBlob = function (base64) {
    var base64Arr = base64.split(',');
    var imgtype = '';
    var base64String = '';
    if (base64Arr.length > 1) {
        //If the image is Base64, remove the header information
        base64String = base64Arr[1];
        imgtype = base64Arr[0].substring(base64Arr[0].indexOf(':') + 1, base64Arr[0].indexOf(';'));
    }
    //Decode Base64
    var bytes = atob(base64String);
    //var bytes = base64;
    var bytesCode = new ArrayBuffer(bytes.length);
    //Convert to typed array
    var byteArray = new Uint8Array(bytesCode);

    //Converting Base64 to ASCII code
    for (var i = 0; i < bytes.length; i++) {
        byteArray[i] = bytes.charCodeAt(i);
    }

    //Generate blob object (file object)
    return new Blob([bytesCode], {
        type: imgtype
    });
};


document.onkeypress = function (e) {
    /*if ((e.keyCode || e.which) === 13) {
        e.preventDefault();
        window.clearInterval(interval);
        console.log('Interval cleared');
    }*/
};