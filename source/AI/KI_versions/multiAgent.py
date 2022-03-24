# stable baselines
import time
from stable_baselines3 import A2C, PPO
from stable_baselines3.common.env_util import make_vec_env
from stable_baselines3.common.evaluation import evaluate_policy
import gym

# threading
import threading
from threads.socketHandler import *

# import env
import KI_v01  # important


# other
import os


class KI():
    def __init__(self):
        self.env = gym.make('ScribbleFight-v0')

    def run(self):
        log_path = os.path.join('Traning', 'Logs')
        model = PPO("MlpPolicy", self.env, verbose=1, tensorboard_log=log_path)
        print("wetsdf")
        model.learn(total_timesteps=0)
        # obs = self.env.reset()

        # for i in range(1000):
        #     print("training")
        #     action, _state = model.predict(obs, deterministic=True)
        #     obs, reward, done, info = self.env.step(action)
        #     self.env.render()
        #     if done:
        #         obs = self.env.reset()

        print('was jetzt huh?')
        save_path = os.path.join('Traning', 'Saved_Models', 'PPO')

        model.save(save_path)
        del model
        model = PPO.load(save_path, self.env)
        evaluate_policy(model, self.env, n_eval_episodes=10000)


if __name__ == "__main__":
    ki = KI()

    # time.sleep(10)

    ki.run()
