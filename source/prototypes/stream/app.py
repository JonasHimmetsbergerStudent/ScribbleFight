from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = '\xfd{H\xe5<\x95\xf9\xe3\x96.5\xd1\x01O<!\xd5\xa2\xa0\x9fR"\xa1\xa8'
socketio = SocketIO(app)


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    # Aufpassen, dass port nicht geblockt ist und IP passt
    app.run(debug=True, host="192.168.0.21", port=443, ssl_context='adhoc')
    # socketio.run(app, host="192.168.0.21", port=443, certfile="./cert/cert.pem",
    #              keyfile="./keys/key.pem")
