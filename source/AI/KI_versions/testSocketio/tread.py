import threading
import time
import engineio
import asyncio
import socketio
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException

exitFlag = 0


class Game(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.driver = None
        self.run()

    def run(self):
        options = webdriver.ChromeOptions()
        options.add_argument("start-maximized")
        options.add_argument("disable-infobars")
        self.driver = webdriver.Chrome(options=options,
                                       executable_path=ChromeDriverManager().install())
        url = 'http://localhost:3000/'
        self.driver.get(url)
        time.sleep(3)
        while True:
            self.driver.execute_script('moveRight();')

    def isPlaying(self):
        try:
            self.driver.execute_script(
                'return myPlayer.id;')
        except:
            return False
        return True


class SocketHandl(threading.Thread):
    def __init__(self, driver):
        threading.Thread.__init__(self)
        self.obs = None
        self.sio = None
        self.driver = driver
        time.sleep(3)
        self.run()

    async def start_server(self):
        await self.sio.connect('http://localhost:3001')
        myPlayerId = self.driver.execute_script('return myPlayer.id;')
        await self.sio.emit('clientId', myPlayerId)
        self.sio.on('visCopyToPython', self.visCopyToPython)
        await self.sio.wait()

    async def connect(self):
        print('connected to server !!!!!!!!!!!!!')

    async def disconnect(self):
        print('disconnect !!!!!!!!!!!!!')

    async def visCopyToPython(self, data):
        print('A')
        self.obs = data

    def run(self):
        loop = asyncio.get_event_loop()
        self.sio = socketio.AsyncClient(reconnection=True,
                                        logger=False,
                                        engineio_logger=False)
        loop.run_until_complete(self.start_server())


# Create new threads
thread1 = Game()
thread2 = SocketHandl(thread1.driver)

# Start new Threads
print("now starting Thread 1")
thread1.start()
print("now starting Thread 2")
thread2.start()
