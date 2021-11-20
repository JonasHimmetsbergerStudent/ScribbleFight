import engineio
import asyncio
import socketio
import time
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException

options = webdriver.ChromeOptions()
options.add_argument("start-maximized")
options.add_argument("disable-infobars")
driver = webdriver.Chrome(chrome_options=options,
                          executable_path=ChromeDriverManager().install())
url = 'http://localhost:3000/'
driver.get(url)


obs = None

loop = asyncio.get_event_loop()
sio = socketio.AsyncClient(reconnection=True,
                           logger=False,
                           engineio_logger=False)


@sio.event
async def connect():
    print('connected to server !!!!!!!!!!!!!')


@sio.event
async def disconnect():
    print('disconnect !!!!!!!!!!!!!')


@sio.event
async def visCopyToPython(data):
    global obs
    obs = data
    driver.execute_script('moveRight();')


async def start_server():
    await sio.connect('http://localhost:3001')
    myPlayerId = driver.execute_script('return myPlayer.id;')
    print('MAPLAYERID: %s' % (myPlayerId))
    await sio.emit('clientId', myPlayerId)
    await sio.wait()


def start():
    time.sleep(2)
    loop.run_until_complete(start_server())


start()
