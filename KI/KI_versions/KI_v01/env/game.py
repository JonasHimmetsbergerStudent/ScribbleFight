
import gym
from gym import Env
from gym.spaces import Discrete, Box, Dict, Tuple, MultiBinary, MultiDiscrete
from gym.utils import seeding, EzPickle
from KI_v01.env.options.actions import *
from KI_v01.env.options.observations import *

import numpy as np
import random
import os

from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import DummyVecEnv
from stable_baselines3.common.evaluation import evaluate_policy

FPS = 25
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
    def __init__(self):
        self.kills = 0
        self.deaths = 0
        self.damage_dealt = 0
        self.knockback = 0


class Game:
    def __init__(self):
        self.seed()
        self.scribble_fight = ScribbleFight()
        self.min_game_length = 60 * FPS

    '''def seed(self, seed=None):
        self.np_random, seed = seeding.np_random(seed)
        return [seed]'''

    def action(self, action):
        # take actions
        # down action not implemented
        if action == 0:
            jump(self.scribble_fight.getDriver())
        if action == 1:
            left(self.scribble_fight.getDriver())
        if action == 2:
            right(self.scribble_fight.getDriver())
        if action == 3:
            bombAttack(self.scribble_fight.getDriver())
        if action == 4:
            blackHoleAttack(self.scribble_fight.getDriver())
        if action == 5:
            pianoTime(self.scribble_fight.getDriver())
        if action == 6:
            placeMine(self.scribble_fight.getDriver())
        if action == 7:
            makeMeSmall(self.scribble_fight.getDriver())
        if action == 8:  # TODO implement default attack
            pass

    def evaluate(self):
        reward = 0

        # evaluate reward
        if self.scribble_fight.damage_dealt > previous_damage_dealt:
            reward += 1
        if self.scribble_fight.knockback > previous_knockback:
            reward -= 1
        if self.scribble_fight.kills > previous_kills:
            reward += 1000
        # the reason why less reward is given when dying is because I want
        # the ai to be a killer machine
        if self.scribble_fight.deaths > previous_deaths:
            reward -= 990

        return reward

    def is_done(self):
        pass

    def observe(self):
        pass

    def view(self):
        pass
