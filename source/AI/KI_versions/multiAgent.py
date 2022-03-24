# stable baselines
from stable_baselines3 import A2C, PPO
from stable_baselines3.common.env_util import make_vec_env

# threading
import threading
from threads.socketHandler import *

# import env
import KI_v01  # important


# other
import os


class KI():
    def __init__(self):
        self.env = make_vec_env('ScribbleFight-v0', n_envs=2)

    def run(self):
        log_path = os.path.join('Traning', 'Logs')
        model = PPO("MlpPolicy", self.env, verbose=1, tensorboard_log=log_path)
        model.learn(total_timesteps=100)
        obs = self.env.reset()

        for i in range(1000):
            action, _state = model.predict(obs, deterministic=True)
            obs, reward, done, info = self.env.step(action)
            self.env.render()
            if done:
                obs = self.env.reset()


if __name__ == "__main__":
    ki = KI()

    for item in ki.env.get_attr('pygame'):
        while not item.scribble_fight.readystate:
            continue

    ki.run()
