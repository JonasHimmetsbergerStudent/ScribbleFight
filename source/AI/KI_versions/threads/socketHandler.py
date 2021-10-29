import threading
import asyncio
import socketio
from gym.spaces import Box


class SocketHandler(threading.Thread):
    def __init__(self, playerID):
        threading.Thread.__init__(self)
        self.obs = Box(0, 0, (165, 165), int).sample()
        self.sio = None
        self.playerID = playerID

    async def start_server(self):
        await self.sio.connect('http://localhost:3001')
        await self.sio.emit('clientId', self.playerID)
        self.sio.on('visCopyToPython', self.visCopyToPython)
        await self.sio.wait()

    async def connect(self):
        print('connected to server !!!!!!!!!!!!!')

    async def disconnect(self):
        print('disconnect !!!!!!!!!!!!!')

    async def visCopyToPython(self, data):
        # print('A')
        self.obs = data

    def run(self):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        self.sio = socketio.AsyncClient(reconnection=True,
                                        logger=False,
                                        engineio_logger=False)
        loop.run_until_complete(self.start_server())

    def reset(self):
        self.obs = Box(0, 0, (165, 165), int).sample()
