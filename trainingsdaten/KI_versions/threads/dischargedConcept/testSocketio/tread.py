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
        self.startBrowser()

    def startBrowser(self):
        options = webdriver.ChromeOptions()
        options.add_argument("start-maximized")
        options.add_argument("disable-infobars")
        self.driver = webdriver.Chrome(options=options,
                                       executable_path=ChromeDriverManager().install())
        url = 'http://localhost:3000/'
        self.driver.get(url)

    def isPlaying(self):
        try:
            self.driver.execute_script(
                'return myPlayer.id;')
        except:
            return False
        return True

    def run(self):
        while True:
            self.driver.execute_script('moveRight();')


class SocketHandl(threading.Thread):
    def __init__(self, driver):
        threading.Thread.__init__(self)
        self.obs = None
        self.sio = None
        self.driver = driver

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
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        self.sio = socketio.AsyncClient(reconnection=True,
                                        logger=False,
                                        engineio_logger=False)
        loop.run_until_complete(self.start_server())

    def get_or_create_eventloop(self):
        try:
            return asyncio.get_event_loop()
        except RuntimeError as ex:
            if "There is no current event loop in thread" in str(ex):
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                return asyncio.get_event_loop()


class Fusion():
    def init(self):
        pass

    def letsego(self):
        threads = []
        # Create new threads
        thread1 = Game()

        time.sleep(2)
        thread2 = SocketHandl(thread1.driver)

        # Start new Threads
        print("now starting Thread 1")
        thread1.start()
        print("now starting Thread 2")
        thread2.start()

        threads.append(thread1)
        threads.append(thread2)

        for item in range(10):
            time.sleep(1)
            print(thread2.obs)

        for t in threads:
            t.join()


fusion = Fusion()
Fusion.letsego(fusion)
