function checkMobile() {
    var isMobile = false; //initiate as false
    // device detection
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        isMobile = true;
    }
    // return isMobile;
    return true
}


const video = document.getElementById('video'),
    // button = document.getElementById('button'), select = document.getElementById('select'),
    flipBtn = document.getElementById('camera-facing-flip'),
    constraints = {
        video: {
            width: { ideal: 3840 },
            height: { ideal: 2160 },
            frameRate: { ideal: 25 }
        },
        audio: false
    };

let currentStream,
    cameras = [],
    cameraCounter = 0,
    shouldFaceUser = false,
    stream = null,
    actWidth, actHeight,
    snap = null;

function startCameraStream() {
    if (checkMobile()) { // if app is used on mobile device then show video stream
        capture();
        document.querySelector('#error').style.display = 'none';
    } else { // else: don't
        document.querySelector('#error').style.display = 'block';
    }
}

function stopMediaTracks(_stream) {
    _stream.getTracks().forEach(track => {
        track.stop();
    });
}

// check whether we can use facingMode
let supports = navigator.mediaDevices.getSupportedConstraints();

flipBtn.addEventListener('click', function () {
    if (stream == null) return
    // we need to flip, stop everything
    stopMediaTracks(stream);
    // toggle / flip
    shouldFaceUser = !shouldFaceUser;
    capture();
});

navigator.mediaDevices.enumerateDevices()
    .then(gotDevices)
    .catch(error => {
        console.error('Argh!', error.name || error)
    });

async function gotDevices(deviceInfos) {
    deviceInfos.forEach(device => {
        if (device.kind === 'videoinput') cameras.push(device)
    });

    await sleep(1000);

    if (cameras.length > 1 && supports['facingMode'] === true) flipBtn.disabled = false;
    else flipBtn.disabled = true;
}

function capture() {
    if (typeof currentStream !== 'undefined') {
        stopMediaTracks(currentStream);
    }

    if (supports['facingMode'] === true)
        constraints.video.facingMode = shouldFaceUser ? 'user' : 'environment';

    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(async _stream => {
            stream = _stream;
            currentStream = _stream;
            video.srcObject = _stream;
            video.play();


            const track = _stream.getVideoTracks()[0],
                capabilities = track.getCapabilities(),
                settings = track.getSettings(),
                input = document.getElementById('zoom-slider'),
                error = document.getElementById('error');

            _stream.getVideoTracks().forEach(t => {
                console.log(t.label);
            })

            console.log(JSON.stringify(capabilities) + (_stream.getVideoTracks()));

            $('#contr').css('visibility', 'visible')
            await sleep(1000);
            svg.style.width = video.offsetWidth // / video.videoWidth
            svg.style.height = video.offsetHeight // video.videoHeight
            // Check whether zoom is supported or not.
            if (!('zoom' in capabilities)) {
                if (!error.innerHTML.includes(track.label)) error.innerHTML += 'Zoom is not supported by ' + track.label + '<br>';
                return Promise.reject('Zoom is not supported by ' + track.label);
            } else {
                input.style.display = 'block';
                // Map zoom to a slider element.
                input.min = capabilities.zoom.min;
                input.max = capabilities.zoom.max;
                input.step = capabilities.zoom.step;
                input.value = settings.zoom;
                input.oninput = function (event) {
                    track.applyConstraints({
                        advanced: [{
                            zoom: event.target.value
                        }]
                    });
                }
                input.hidden = false;
            }

            return navigator.mediaDevices.enumerateDevices();
        })
        .catch(error => {
            console.error('Argh!', error.name || error)
        });
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

$('#snap').click(function () {
    interval = window.clearInterval(interval);
    snap = takeSnapshot()
    $('#converted').append(snap.canvas);
    $('#converted').css('display', 'block')
    stopMediaTracks(stream);
    video.style.display = "none";
    draggablePolygon(polygon);
    $('#convert').prop('disabled', false);
    $('#convert').css('visibility', 'visible');
    $('#snap').css('visibility', 'hidden');
});

function draggablePolygon(polygon) {
    var points = polygon.points;
    var svgRoot = $(polygon).closest("svg");

    for (var i = 0; i < points.numberOfItems; i++) {
        (function (i) { // close over variables for drag call back
            var point = points.getItem(i);

            var handle = document.createElement("div");
            handle.className = "handle";
            document.body.appendChild(handle);

            var base = svgRoot.position();
            // center handles over polygon
            var cs = window.getComputedStyle(handle, null);
            base.left -= (parseInt(cs.width) + parseInt(cs.borderLeftWidth) + parseInt(cs.borderRightWidth)) / 2;
            base.top -= (parseInt(cs.height) + parseInt(cs.borderTopWidth) + parseInt(cs.borderBottomWidth)) / 2;

            handle.style.left = base.left + point.x + "px";
            handle.style.top = base.top + point.y + "px";

            $(handle).draggable({
                scroll: false,
                containment: "#boundingBox",
                drag: function (event) {
                    point.x = parseInt(handle.style.left) - base.left;
                    point.y = parseInt(handle.style.top) - base.top;
                }
            });
        }(i));
    }
}
