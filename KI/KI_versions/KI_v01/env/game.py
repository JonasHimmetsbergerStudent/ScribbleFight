'''DEPENDENCIES'''
# openai gym
import gym
from gym import Env
from gym.spaces import Discrete, Box, Dict, Tuple, MultiBinary, MultiDiscrete
from gym.utils import seeding, EzPickle
from KI_v01.env.options.actions import *
from KI_v01.env.options.observations import *

# stable baselines
from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import DummyVecEnv
from stable_baselines3.common.evaluation import evaluate_policy

# webdriver
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager

# other
import numpy as np
import random
import os
import time

'''VARIABLES'''
FPS = 30
BUTTONS = [
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
        url = '://localhost:%s/fight' % (port)
        return url in self.driver.current_url

    def update(self):
        # get stats via cookies
        self.dmgDealt, self.knockback, self.deaths, self.kills = getStats(
            self.driver)


class Game:

    '''AI INTERFACE TO SCRIBBLEFIGHT GAME INSTANCE'''

    def __init__(self):
        # self.np_random = 0
        # self.seed()
        self.scribble_fight = ScribbleFight()
        self.min_game_length = 60 * FPS  # 1 min
        self.previous_damage_dealt = 0
        self.previous_knockback = 0
        self.previous_kills = 0
        self.previous_deaths = 0

    def seed(self, seed=None):
        self.np_random, seed = seeding.np_random(seed)
        return [seed]

    def action(self, action):
        if (self.scribble_fight.isPlaying() is False):
            return

        # take action
        # down action not implemented
        if action == 0:
            jump(self.scribble_fight.driver)
        if action == 1:
            left(self.scribble_fight.driver)
        if action == 2:
            right(self.scribble_fight.driver)
        if action == 3:
            bombAttack(self.scribble_fight.driver)
        if action == 4:
            blackHoleAttack(self.scribble_fight.driver)
        if action == 5:
            pianoTime(self.scribble_fight.driver)
        if action == 6:
            placeMine(self.scribble_fight.driver)
        if action == 7:
            makeMeSmall(self.scribble_fight.driver)
        if action == 8:
            pass

        # update and save in-game stats
        self.scribble_fight.update()

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
            self.previous_damage_dealt = dmgDealt
        if knockback > self.previous_knockback:
            reward -= 1
            self.previous_knockback = knockback
        if kills > self.previous_kills:
            reward += 1000
            self.previous_kills = kills
        if deaths > self.previous_deaths:
            # the reason why less reward is given when dying is because
            # I want the ai to be a killer machine
            reward -= 990
            self.scribble_fight.just_died = True
            self.previous_deaths = deaths
            # when player dies the variables need to be reset
            self.reset()
        else:
            self.scribble_fight.just_died = False

        return reward

    def is_done(self):
        # returns if game won
        pass

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

    def observe(self):
        # get computer vision
        return getVisual(self.scribble_fight.driver)

    def view(self):
        pass
