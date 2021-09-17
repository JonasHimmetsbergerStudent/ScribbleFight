
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

    def seed(self, seed=None):
        self.np_random, seed = seeding.np_random(seed)
        return [seed]

    def action(self, action):
        pass

    def evaluate(self):
        pass

    def is_done(self):
        pass

    def observe(self):
        pass

    def view(self):
        pass
