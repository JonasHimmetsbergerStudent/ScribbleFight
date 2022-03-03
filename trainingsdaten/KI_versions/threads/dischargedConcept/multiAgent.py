# openai gym
import gym
from gym import Env
from gym.spaces import Discrete, Box, Dict, Tuple, MultiBinary, MultiDiscrete

# stable baselines
from stable_baselines3 import A2C
from stable_baselines3.common.env_util import make_vec_env
from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import VecFrameStack, SubprocVecEnv
from stable_baselines3.common.evaluation import evaluate_policy

# threading
import threading
from threads.socketHandler import *

# import env
import KI_v01  # important


# other
import time
import os
from KI_v01.env.gym_env import CustomEnv


class KI(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        # self.env = CustomEnv()
        # self.env = gym.make('ScribbleFight-v0')
        # self.env.seed(0)
        self.env = make_vec_env('ScribbleFight-v0', n_envs=2)
        # self.env_name = 'ScribbleFight-v0'
        # self.nproc = 2
        # envs = [self.make_env(self.env_name, seed)
        #         for seed in range(self.nproc)]
        # self.envs = SubprocVecEnv(envs)

    # def make_env(self, env_id, seed):
    #     env = gym.make(env_id)
    #     env.seed(seed)
    #     return env

    def run(self):
        log_path = os.path.join('Traning', 'Logs')
        model = A2C("MlpPolicy", self.env, verbose=1, tensorboard_log=log_path)
        model.learn(total_timesteps=400)


if __name__ == "__main__":
    threads = []
    thread1 = KI()

    for item in thread1.env.get_attr('pygame'):
        while not item.scribble_fight.readystate:
            continue

    # Start new Threads
    print("now starting Game Thread")
    thread1.start()
    threads.append(thread1)

    print("now starting Observation Threads")
    for item in thread1.env.get_attr('pygame'):
        thread2 = item.scribble_fight.socket_handler
        thread2.start()
        threads.append(thread2)

    for t in threads:
        t.join()
