# not yet implemented
'''
TODO 
* in observations.py sind die cookie indizes fix falsch

* action funktionsaufruf könnte man noch auf scribbleFight class auslagern,
    denn schließlich sind es ja ingame actions

* implement default attack

* implement is_done (return if game won)

* ordnerstruktur verbessern (so wie in slidea)

* isPlaying url richtig gestalten

* Rafi sagen, dass er einen start button machen soll (unter localhost:300), 
    der alle gleichzeitig auf eine url weiterleitet (localhost:3000/fight)
'''
import time
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from KI_v01.env.options.actions import *
from KI_v01.env.options.observations import *


def testMain():
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
            # myDict = {"x": x, "y": y}
            print(getStats(driver))
            # default(driver, myDict)
            # left(driver)

    test(driver)
    driver.quit()


testMain()
