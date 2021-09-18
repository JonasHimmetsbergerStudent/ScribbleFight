# from KI_v01.env.options.actions import *
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
import time

'''Auslagern'''
options = webdriver.ChromeOptions()
options.add_argument("start-maximized")
options.add_argument("disable-infobars")
driver = webdriver.Chrome(chrome_options=options,
                          executable_path=ChromeDriverManager().install())
url = 'http://localhost:3000/'
driver.get(url)

# driver.set_window_position(10, 10)
# print(driver.get_window_size())
# print(driver.get_window_position())
# wenn url bestimmte form hat (zb '.../fight') dann startet ki
print(driver.current_url)
''''''


def test(driver):
    x = 10
    # time.sleep(3)
    for item in range(5):
        y = item * 3
        time.sleep(3)
        myDict = {"x": x, "y": y}
        print(getVars(driver))
        # default(driver, myDict)
        # left(driver)


def getVars(driver):
    cookies = driver.get_cookies()
    dmgDealt, knockback, death, kills = 0, 0, 0, 0
    for i in range(4):
        cookie = cookies[i]
        if cookie['name'] == u'dmgDealt':
            dmgDealt = float(cookie['value'])
        if cookie['name'] == u'knockback':
            knockback = int(cookie['value'])
        if cookie['name'] == u'death':
            death = int(cookie['value'])
        if cookie['name'] == u'kills':
            kills = int(cookie['value'])
    return dmgDealt, knockback, death, kills


test(driver)
driver.quit()
