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
click(x,y)	DEFAULT
'''


def jump(driver):
    driver.execute_script('jump()')


def left(driver):
    driver.execute_script('moveLeft(); mirrorSpriteLeft();')


def right(driver):
    driver.execute_script('moveRight(); mirrorSpriteRight();')


def down(driver):
    pass


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
    x = mousePos['x']
    y = mousePos['y']

    '''
    # check if click ins within bounds
    # might be obsolete
    realx, realy, maxx, maxy = getWinMeasurements(driver)
    if x > realx:
        x = realx
    if x < 0:
        x = 0

    if y > realy:
        y = realy
    if y < 0:
        y = 0
    '''

    driver.execute_script('defaultAttack(%s, %s)' % (x, y))


def getWinMeasurements(driver):  # get measurements of window that is played in
    measurements = driver.execute_script(
        "return {'iwidth':window.innerWidth, 'iheight':window.innerHeight, 'owidth':window.outerWidth, 'oheight':window.outerHeight} ;")
    return measurements['iwidth'], measurements['iheight'], measurements['owidth'], measurements['oheight'],


def hasFocus(driver):  # check if window has focus
    # hat browser localhost (spiel) als current tab offen?
    if '://localhost:' in driver.current_url:
        # hat document focus
        script = 'return document.hasFocus()'
        return driver.execute_script(script)
    return False
