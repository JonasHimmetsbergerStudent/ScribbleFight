$(document).ready(function () {
    $('#contr, #log, #snap').css('visibility', 'hidden')
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
        startCameraStream();
    });
});