# import socketio
# import time
# from random import random
# from random import seed
# from selenium import webdriver
# from webdriver_manager.chrome import ChromeDriverManager
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from selenium.webdriver.common.by import By
# from selenium.common.exceptions import TimeoutException

# options = webdriver.ChromeOptions()
# options.add_argument("start-maximized")
# options.add_argument("disable-infobars")
# driver = webdriver.Chrome(chrome_options=options,
#                           executable_path=ChromeDriverManager().install())
# url = 'http://localhost:3000/'
# driver.get(url)


# def start():
#     time.sleep(2)
#     sio = socketio.Client()

#     myPlayerId = driver.execute_script('return myPlayer.id;')
#     print(myPlayerId)

#     sio.connect('http://localhost:3001')

#     sio.emit('clientId', myPlayerId)

#     seed(1)


# def setObs(data):
#     obs = data.visCopy
#     print('Ä')


# start()

import numpy as np
a1 = np.array([1, 4, 2, 6, 7])
a2 = np.array([1, 2, 4, 6, 7])
print((a1 == a2).all())
