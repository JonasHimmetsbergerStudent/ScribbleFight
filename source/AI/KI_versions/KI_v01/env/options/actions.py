'''
10 Actions taken by AI to mimic player
These are:
spacebar	JUMP
A		    LEFT
D		    RIGHT
S		    DOWN -- not implemented
E		    BOMB
Q		    BLACKHOLE
R		    PIANO
C		    MINE
F		    SMALL
click(angle)DEFAULT
'''


def takeAction(driver, actions):
    driver.execute_script(actions)


def getWinMeasurements(driver):
    # get measurements of window that is played in
    measurements = driver.execute_script(
        "return {'iwidth':window.innerWidth, 'iheight':window.innerHeight, 'owidth':window.outerWidth, 'oheight':window.outerHeight} ;")
    return measurements['iwidth'], measurements['iheight'], measurements['owidth'], measurements['oheight'],


def hasFocus(driver):
    # check if window has focus
    # hat browser localhost (spiel) als current tab offen?
    if '://localhost:' in driver.current_url:
        # hat document focus
        script = 'return document.hasFocus()'
        return driver.execute_script(script)
    return False
