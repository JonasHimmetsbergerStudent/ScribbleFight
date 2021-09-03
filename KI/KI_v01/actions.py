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

print(driver.get_window_size())
print(driver.get_window_position())
# wenn url bestimmte form hat (zb '.../fight') dann startet ki
print(driver.current_url)
''''''


def jump():
    pg.press('space')


def left():
    pg.press('a')


def right():
    pg.press('d')


# def down():
#     pg.press('s')


def bomb():
    pg.press('e')


def blackhole():
    pg.press('q')


def piano():
    pg.press('r')


def mine():
    pg.press('c')


def small():
    pg.press('f')


def default(driver, mousePos):  # how tf do i shoot
    realx, realy, maxx, maxy = getWinMeasurements(driver)
    x = mousePos.x
    y = mousePos.y

    if x > realx:
        x = realx
    if mousePos.x < 0:
        x = 0

    if mousePos.y > maxy:
        y = maxy
    if mousePos.y < (maxy - realy):
        y = (maxy - realy)

    pg.click(x=x, y=y)


def getWinMeasurements(driver):
    measurements = driver.execute_script(
        "return {'iwidth':window.innerWidth, 'iheight':window.innerHeight, 'owidth':window.outerWidth, 'oheight':window.outerHeight} ;")
    return measurements['iwidth'], measurements['iheight'], measurements['owidth'], measurements['oheight'],
