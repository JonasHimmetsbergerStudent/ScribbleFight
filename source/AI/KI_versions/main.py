# openai gym
import gym
from gym import Env
from gym.spaces import Discrete, Box, Dict, Tuple, MultiBinary, MultiDiscrete

# stable baselines
from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import VecFrameStack
from stable_baselines3.common.evaluation import evaluate_policy

# import env
import KI_v01

# other
import numpy as np
import random
import os
import time

if __name__ == "__main__":
    env = gym.make("ScribbleFight-v0")
    time.sleep(1)

    episodes = 6
    for episode in range(1, episodes+1):
        state = env.reset()
        done = False
        score = 0

        while not done:
            env.render()
            action = env.action_space.sample()
            n_state, reward, done, info = env.step(action)
            score += reward
            print(action)
        print('Episode:{} Score:{}'.format(episode, score))
    env.close()


'''
TODO 
* implement default attack

* isPlaying url richtig gestalten

* Rafi sagen, dass er einen start button machen soll (unter localhost:300), 
    der alle gleichzeitig auf eine url weiterleitet (localhost:3000/fight)

* implement winning condition

* implement view (render visual array)
'''
'''
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from KI_v01.env.options.actions import *
from KI_v01.env.options.observations import *
import time

def testMain():
    # Auslagern
    options = webdriver.ChromeOptions()
    options.add_argument("start-maximized")
    options.add_argument("disable-infobars")
    driver = webdriver.Chrome(chrome_options=options,
                              executable_path=ChromeDriverManager().install())
    url = 'http://localhost:3000/'
    driver.get(url)

    # driver.set_window_position(10, 10)
    # print(driver.get_window_size())
    # print(driver.get_window_position())
    # wenn url bestimmte form hat (zb '.../fight') dann startet ki
    print(driver.current_url)
    ''''''

    def test(driver):
        x = 10
        # time.sleep(3)
        # for item in range(5):
        # y = item * 3
        time.sleep(3)

        # myDict = {"x": x, "y": y}
        print(getStats(driver))
        # print(getStats(driver))
        # default(driver, myDict)
        # left(driver)

    test(driver)
    driver.quit()

testMain()
'''
