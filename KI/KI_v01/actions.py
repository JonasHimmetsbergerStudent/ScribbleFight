import autoit
import win32gui
import win32con
import win32api
import time
from selenium.webdriver.common.action_chains import ActionChains
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
import pyautogui as pg


'''Auslagern'''
options = webdriver.ChromeOptions()
options.add_argument("start-maximized")
options.add_argument("disable-infobars")
driver = webdriver.Chrome(chrome_options=options,
                          executable_path=ChromeDriverManager().install())
url = 'http://localhost:3000/'
driver.get(url)

# driver.set_window_position(10, 10)
print(driver.get_window_size())
print(driver.get_window_position())
# wenn url bestimmte form hat (zb '.../fight') dann startet ki
print(driver.current_url)
''''''


def pressKey(driver, key):
    # if hasFocus(driver) is False or key not in pg.KEYBOARD_KEYS:
    #     return
    pg.press(key)


def jump(driver):
    pressKey(driver, 'space')


def left(driver):
    pressKey(driver, 'a')


def right(driver):
    pressKey(driver, 'd')


# def down(driver):
    # pressKey(driver, 's')


def bombAttack(driver):
    driver.execute_script('bombAttack()')


def blackHoleAttack(driver):
    driver.execute_script('blackHoleAttack()')


def pianoTime(driver):
    driver.execute_script('pianoTime()')


def placeMine(driver):
    driver.execute_script('placeMine()')


def makeMeSmall(driver):
    driver.execute_script('makeMeSmall()')


def default(driver, mousePos):
    realx, realy, maxx, maxy = getWinMeasurements(driver)
    x = mousePos['x']
    y = mousePos['y']

    if x > realx:
        x = realx
    if x < 0:
        x = 0

    if y > realy:
        y = realy
    if y < 0:
        y = 0

    driver.execute_script('defaultAttack(%s, %s)' % (x, y))


def getWinMeasurements(driver):
    measurements = driver.execute_script(
        "return {'iwidth':window.innerWidth, 'iheight':window.innerHeight, 'owidth':window.outerWidth, 'oheight':window.outerHeight} ;")
    return measurements['iwidth'], measurements['iheight'], measurements['owidth'], measurements['oheight'],


def hasFocus(driver):
    # hat browser localhost (spiel) als current tab offen?
    if '://localhost:' in driver.current_url:
        # hat document focus
        script = 'return document.hasFocus()'
        return driver.execute_script(script)
    return False


def test(driver):
    x = 10
    time.sleep(3)
    for item in range(180):
        y = item * 3
        time.sleep(0.5)
        myDict = {"x": x, "y": y}
        default(driver, myDict)
        left(driver)


test(driver)
driver.quit()
