import socketio

sio = socketio.Client()

sio.connect('http://localhost:3000')

sio.emit('visCopyViaSocketIO', {'clientid': 0})


@sio.on('visCopy')
def on_message(data):
    obs = data
