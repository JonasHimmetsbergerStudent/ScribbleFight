
def getStats(driver):
    dmgDealt, knockback, deaths, kills = 0, 0, 0, 0

    # FIXME eine andere variable ois cookieArr?
    dmgDealt, knockback, deaths, kills = driver.execute_script(
        'return [cookieArr["dmgDealt"], cookieArr["knockback"], cookieArr["death"], cookieArr["kills"]]')

    return dmgDealt, knockback, deaths, kills


def getVisual(driver):
    visualArr = driver.execute_script('return visCopy')
    return visualArr
