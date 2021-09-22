
def getStats(driver):
    cookies = driver.get_cookies()
    dmgDealt, knockback, deaths, kills = 0, 0, 0, 0
    for i in range(4):  # FIXME sind es eh die ersten 4?
        cookie = cookies[i]
        if cookie['name'] == u'dmgDealt':
            dmgDealt = int(cookie['value'])
        if cookie['name'] == u'knockback':
            knockback = int(cookie['value'])
        if cookie['name'] == u'death':
            deaths = int(cookie['value'])
        if cookie['name'] == u'kills':
            kills = int(cookie['value'])
    return dmgDealt, knockback, deaths, kills


def getVisual(driver):
    cookies = driver.get_cookies()
    visual = []
    cookie = cookies[4]  # FIXME ist es eh die nr 5?
    if cookie['name'] == u'visual':
        visual = cookie['value']
    return visual
