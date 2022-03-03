from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from PIL import Image

import scanner.cv2scan as scanner
import cv2
import numpy as np
import base64
import json
import math

app = Flask(__name__)
app.config['SECRET_KEY'] = '\xfd{H\xe5<\x95\xf9\xe3\x96.5\xd1\x01O<!\xd5\xa2\xa0\x9fR"\xa1\xa8'
socketio = SocketIO(app)


def convertB64ToCv2img(messageStr):
    im_bytes = base64.b64decode(messageStr)
    # im_arr is one-dim Numpy array
    im_arr = np.frombuffer(im_bytes, dtype=np.uint8)
    return cv2.imdecode(im_arr, flags=cv2.IMREAD_UNCHANGED)


def convertCv2imgToB64(cv2img):
    _, im_arr = cv2.imencode('.png', cv2img)
    im_bytes = im_arr.tobytes()
    im_b64 = base64.b64encode(im_bytes)
    return im_b64.decode('utf-8')


@app.route('/')
def index():
    return render_template('index.html')


@socketio.on('my image')
def test_message(message):
    base64_data = message['data']
    img = convertB64ToCv2img(base64_data)  # COVERT B64 MESSAGE TO CV2 IMAGE
    edges = scanner.check(img)

    lists = edges.tolist()
    json_str = json.dumps(lists)

    emit('edge array', {'edges': json_str})


@socketio.on('getDataFromImage')
def test_message(message):
    base64_data = message['img']
    snipset = np.array(message['snipset'])
    img = convertB64ToCv2img(base64_data)  # COVERT B64 MESSAGE TO CV2 IMAGE
    try:
        wrapedImg = scanner.getWrappedImg(img, snipset)
        json_str = convertCv2imgToB64(wrapedImg)

        emit('perspective transformed', {'buffer': json_str})
    except:
        emit('perspective transformed', {
             'error': 'Perspective transform didn\'t work'})


@socketio.on('convert img to map')
def test_message(message):
    try:
        base64_data = message['data']
        # COVERT B64 MESSAGE TO CV2 IMAGE
        img = convertB64ToCv2img(base64_data)

        '''
        # make square
        widht, height, _ = img.shape
        size = int(max(widht, height))
        img = np.array(scanner.makeSquare(
            cv2.cvtColor(img, cv2.COLOR_BGR2BGRA), size))
        '''

        heightImg, widthImg, chanel = img.shape
        n = 55 * 8 / max(heightImg, widthImg)
        resized = cv2.resize(
            img, (math.floor(widthImg * n), math.floor(heightImg * n)))
        playerMap = scanner.getPlayableArray(resized)

        json_str = json.dumps(playerMap)

        # NOTE für di Ben
        # iar = Pixel als Numpy-Array
        # img = Bild als OpenCV2 Bild

        # iar = np.asarray(playerMap).tolist()
        cv2.imwrite('./source/prototypes/streamFusion/output/input.png', img)

        emit('playable map', {'map': json_str})
    except:
        emit('playable map', {
             'error': 'convert img to map didn\'t work'})


@socketio.on('connect')
def test_connect():
    emit('my response', {'data': 'Connected'})


@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')


if __name__ == '__main__':
    # Aufpassen, dass port nicht geblockt ist und IP passt
    # app.run(debug=True, host="192.168.0.21", port=443, ssl_context='adhoc')
    # mit der ip addresse herumspielen :D
    print('server running')
    socketio.run(app, host="192.168.0.21", port=443, certfile="./cert/cert.pem",
                 keyfile="./keys/key.pem")
    print('server stopped')
