'''DEPENDENCIES'''
# options
from KI_v01.env.options.actions import *
from KI_v01.env.options.observations import *

# webdriver
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager


'''VARIABLES'''
FPS = 30
BUTTONS = [  # not needed
    "SPACE",
    "A",
    "D",
    "E",
    "Q",
    "R",
    "C",
    "F",
    "LEFTCLICK",
]


class ScribbleFight:

    '''SCRIBBLE FIGHT GAME'''

    def __init__(self):
        self.driver = None
        self.start()
        self.dmgDealt = 0
        self.knockback = 0
        self.kills = 0
        self.deaths = 0
        self.just_died = False

    def start(self):
        options = webdriver.ChromeOptions()
        options.add_argument("start-maximized")
        options.add_argument("disable-infobars")
        self.driver = webdriver.Chrome(chrome_options=options,
                                       executable_path=ChromeDriverManager().install())
        url = 'http://localhost:3000/'
        self.driver.get(url)

    def isPlaying(self):
        port = 3000
        url = '://localhost:%s' % (port)
        # url = '://localhost:%s/fight' % (port)
        return url in self.driver.current_url

    def update(self):
        # get stats
        self.dmgDealt, self.knockback, self.deaths, self.kills = getStats(
            self.driver)

    def action(self, action, angle):
        # down ('s') action not implemented
        if action == 0:
            jump(self.driver)
        if action == 1:
            left(self.driver)
        if action == 2:
            right(self.driver)
        if action == 3:
            bombAttack(self.driver)
        if action == 4:
            blackHoleAttack(self.driver)
        if action == 5:
            pianoTime(self.driver)
        if action == 6:
            placeMine(self.driver)
        if action == 7:
            makeMeSmall(self.driver)
        if action == 8:
            default(self.driver, angle)


class Game:

    '''AI INTERFACE TO SCRIBBLEFIGHT GAME INSTANCE'''

    def __init__(self):
        # self.np_random = 0 # not needed
        # self.seed() # not needed
        self.scribble_fight = ScribbleFight()
        self.min_game_length = 30 * FPS  # 1 min
        self.nothingChanged = 0  # player didn't accomplish anything in this timespan
        self.just_won = False  # the winning condition has yet to be implemented
        self.previous_damage_dealt = 0
        self.previous_knockback = 0
        self.previous_kills = 0
        self.previous_deaths = 0
        self.angle = 0  # angle in which the ai can shoot a bullet

    def action(self, action):
        # if current browser window has wrong url
        #   then dont execute action
        if (self.scribble_fight.isPlaying() is False):
            return

        # take action
        if action < 9:
            self.scribble_fight.action(action, self.angle)
        if action == 9:
            self.angle += 5
            if self.angle > 360:
                self.angle -= 360
        if action == 10:
            self.angle -= 5
            if self.angle < 0:
                self.angle += 360

        # update and save in-game stats
        self.scribble_fight.update()

    def observe(self):
        # get computer vision
        return getVisual(self.scribble_fight.driver)

    def evaluate(self):
        reward = 0
        dmgDealt = self.scribble_fight.dmgDealt
        knockback = self.scribble_fight.knockback
        kills = self.scribble_fight.kills
        deaths = self.scribble_fight.deaths

        # evaluate reward
        # if reward is calculated then update previous_x varibales
        #   since they will be used for future comparison and reward calculation
        if dmgDealt > self.previous_damage_dealt:
            reward += 1
        if knockback > self.previous_knockback:
            reward -= 1
        if kills > self.previous_kills:
            reward += 1000
        if deaths > self.previous_deaths:
            # the reason why less reward is given when dying is because
            # I want the ai to be a killer machine
            reward -= 990
            self.scribble_fight.just_died = True

        self.previous_damage_dealt = dmgDealt
        self.previous_knockback = knockback
        self.previous_kills = kills
        self.previous_deaths = deaths

        if reward == 0:
            self.nothingChanged += 1
        else:
            self.nothingChanged = 0

        return reward

    def is_done(self):
        # returns if game won or nothing changed or agent died
        return self.scribble_fight.just_died or self.just_won or self.nothingChanged == self.min_game_length

    def reset(self):
        # reset in-game varibales
        self.scribble_fight.update()
        # reset variables
        # they should always be 0 because a reset only accures after death or as initialisation
        self.previous_damage_dealt = self.scribble_fight.dmgDealt  # should always be 0
        self.previous_knockback = self.scribble_fight.knockback  # should always be 0
        self.previous_kills = self.scribble_fight.kills  # should always be 0
        self.previous_deaths = self.scribble_fight.deaths
        self.scribble_fight.just_died = False
        self.nothingChanged = 0
        self.angle = 0

    def info(self):
        # return all infos about player
        #   not really needed tho
        return self.scribble_fight.dmgDealt, self.scribble_fight.knockback, self.scribble_fight.kills, self.scribble_fight.deaths

    def view(self):
        # render visual array?
        pass

    def seed(self, seed=None):
        # i dont really know why i implemented this
        self.np_random, seed = seeding.np_random(seed)
        return [seed]
