
def getStats(driver):
    dmgDealt, knockback, deaths, kills = 0, 0, 0, 0

    dmgDealt, knockback, deaths, kills = driver.execute_script(
        'return [myPlayer.dmgDealt, myPlayer.knockback, myPlayer.death, myPlayer.kills]')

    return dmgDealt, knockback, deaths, kills


def getStatsViaCookies(driver):
    cookies = driver.get_cookies()
    dmgDealt, knockback, deaths, kills = 0, 0, 0, 0
    for i in range(4):
        cookie = cookies[i]
        if cookie['name'] == u'dmgDealt':
            dmgDealt = float(cookie['value'])
        if cookie['name'] == u'knockback':
            knockback = int(cookie['value'])
        if cookie['name'] == u'death':
            deaths = int(cookie['value'])
        if cookie['name'] == u'kills':
            kills = int(cookie['value'])
    return dmgDealt, knockback, deaths, kills


def getVisual(driver):
    visualArr = driver.execute_script('return visCopy')
    return visualArr
