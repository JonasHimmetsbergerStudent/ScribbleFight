import time
from time import sleep
from selenium.webdriver.common.action_chains import ActionChains
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
import pyautogui as pg


'''Auslagern'''
options = webdriver.ChromeOptions()
# options.add_argument("start-maximized")
options.add_argument("disable-infobars")
driver = webdriver.Chrome(chrome_options=options,
                          executable_path=ChromeDriverManager().install())
url = 'http://localhost:3000/'
driver.get(url)

driver.set_window_position(100, 100)
print(driver.get_window_size())
print(driver.get_window_position())
# wenn url bestimmte form hat (zb '.../fight') dann startet ki
print(driver.current_url)
''''''


def pressKey(driver, key):
    if hasFocus(driver) is False or key not in pg.KEYBOARD_KEYS:
        return
    pg.press(key)


def jump(driver):
    pressKey(driver, 'space')


def left(driver):
    pressKey(driver, 'a')


def right(driver):
    pressKey(driver, 'd')


# def down(driver):
    # pressKey(driver, 's')


def bomb(driver):
    pressKey(driver, 'e')


def blackhole(driver):
    pressKey(driver, 'q')


def piano(driver):
    pressKey(driver, 'r')


def mine(driver):
    pressKey(driver, 'c')


def small(driver):
    pressKey(driver, 'f')


def default(driver, mousePos):  # how tf do i shoot
    if hasFocus(driver) is False:
        return
    realx, realy, maxx, maxy = getWinMeasurements(driver)
    drPos = driver.get_window_position()
    margin = 8
    drx = drPos.get('x') + margin
    dry = drPos.get('y') + margin
    x = mousePos['x']
    y = mousePos['y']

    if x > realx + drx:
        x = realx + drx
    if x < drx:
        x = drx

    if y > maxy + dry:
        y = maxy + dry
    if y < (maxy - realy + dry):
        y = (maxy - realy + dry)

    pg.click(x=x, y=y)


def getWinMeasurements(driver):
    measurements = driver.execute_script(
        "return {'iwidth':window.innerWidth, 'iheight':window.innerHeight, 'owidth':window.outerWidth, 'oheight':window.outerHeight} ;")
    return measurements['iwidth'], measurements['iheight'], measurements['owidth'], measurements['oheight'],


def hasFocus(driver):
    script = 'return document.hasFocus()'
    return driver.execute_script(script)


# for i in range(5):
#     mousePos = {
#         'x': 0,
#         'y': 0
#     }
#     default(driver=driver, mousePos=mousePos)
#     time.sleep(1)
#     i += 1
