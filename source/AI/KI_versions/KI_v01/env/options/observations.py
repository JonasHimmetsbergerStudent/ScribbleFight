
def getStats(driver):
    dmgDealt, knockback, deaths, kills = 0, 0, 0, 0

    dmgDealt, knockback, deaths, kills = driver.execute_script(
        'return [myPlayer.dmgDealt, myPlayer.knockback, myPlayer.death, myPlayer.kills]')

    return dmgDealt, knockback, deaths, kills


def getVisual(driver):
    visualArr = driver.execute_script('return visCopy')
    return visualArr
