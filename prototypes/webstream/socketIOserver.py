from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import cv2
import numpy as np
import base64

app = Flask(__name__)
app.config['SECRET_KEY'] = '\xfd{H\xe5<\x95\xf9\xe3\x96.5\xd1\x01O<!\xd5\xa2\xa0\x9fR"\xa1\xa8'
socketio = SocketIO(app)


@app.route('/')
def index():
    return render_template('index.html')


@socketio.on('my event')
def test_message(message):
    emit('my response', {'data': message['data']})


@socketio.on('my image')
def test_message(message):
    base64_data = message['data']

    im_bytes = base64.b64decode(base64_data)
    # im_arr is one-dim Numpy array
    im_arr = np.frombuffer(im_bytes, dtype=np.uint8)
    img = cv2.imdecode(im_arr, flags=cv2.IMREAD_COLOR)
    imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # cv2.imwrite('image.png', imgGray)

    _, im_arr = cv2.imencode('.png', imgGray)
    im_bytes = im_arr.tobytes()
    im_b64 = base64.b64encode(im_bytes)

    emit('imageConversionByClient', {'buffer': im_b64.decode('utf-8')})


@socketio.on('my broadcast event')
def test_message(message):
    emit('my response', {'data': message['data']}, broadcast=True)


@socketio.on('connect')
def test_connect():
    emit('my response', {'data': 'Connected'})


@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')


if __name__ == '__main__':
    print('server running')
    socketio.run(app, certfile="./cert/cert.pem", keyfile="./keys/key.pem")
    # socketio.run(app)
    print('server closed')
