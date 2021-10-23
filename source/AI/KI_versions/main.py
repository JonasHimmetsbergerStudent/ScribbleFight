# openai gym
import gym
from gym import Env
from gym.spaces import Discrete, Box, Dict, Tuple, MultiBinary, MultiDiscrete

# stable baselines
from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import VecFrameStack
from stable_baselines3.common.evaluation import evaluate_policy

# threading
import threading
from threads.socketHandler import *

# import env
import KI_v01

# other
import time
from KI_v01.env.gym_env import CustomEnv


class KI(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.env = CustomEnv()

    def run(self):
        episodes = 100
        for episode in range(1, episodes+1):
            state = self.env.reset()
            done = False
            score = 0

            while not done:
                self.env.render()
                actions = self.env.action_space.sample()
                actions[0] = 1 
                actions[1] = 1
                state, reward, done, info = self.env.step(actions)
                score += reward
            print('Episode:{} Score:{}'.format(episode, score))

        self.env.close()


if __name__ == "__main__":
    threads = []
    thread1 = KI()
    while not thread1.env.pygame.scribble_fight.readystate:
        continue
    thread2 = thread1.env.pygame.scribble_fight.socket_handler
    # thread2 = SocketHandler(thread1.env.pygame.scribble_fight.playerId)

    # Start new Threads
    print("now starting Game Thread")
    thread1.start()
    print("now starting Observation Thread")
    thread2.start()

    threads.append(thread1)
    threads.append(thread2)

    # for item in range(100):
    #     time.sleep(1)
    #     print(thread2.obs)

    for t in threads:
        t.join()


'''
TODO 
* implement default attack

* isPlaying url richtig gestalten

* Rafi sagen, dass er einen start button machen soll (unter localhost:300), 
    der alle gleichzeitig auf eine url weiterleitet (localhost:3000/fight)

* implement winning condition

* implement view (render visual array)
'''
