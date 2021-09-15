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

    if x > realx + drx - 30:
        x = realx + drx - 30
    if x < drx:
        x = drx

    if y > maxy + dry - 30:
        y = maxy + dry - 30
    if y < (maxy - realy + dry + 30):
        y = (maxy - realy + dry + 30)

    pg.click(x=x, y=y)


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
    for i in range(5):
        time.sleep(0.5)
        # https://www.autoitscript.com/autoit3/docs/functions/ControlClick.htm
        # ControlClick ( "title", "text", controlID [, button = "left" [, clicks = 1 [, x [, y]]]] )
        title = win32gui.GetWindowText(win32gui.GetForegroundWindow())
        autoit.control_click(title,
                             '', button="left", click=1, x=200, y=200)


test(driver)

# driver.quit()
