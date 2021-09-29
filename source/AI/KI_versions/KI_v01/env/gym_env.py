import gym
from gym.spaces import Discrete, Box
from KI_v01.env.game import Game


class CustomEnv(gym.Env):

    '''
    This is an environment in wich an AI learns to play ScribbleFight
    '''

    #metadata = {'render.modes' : ['human']}
    def __init__(self):
        self.pygame = Game()
        # "SPACE", "A", "D", "E", "Q", "R", "C", "F", "LEFTCLICK", ANGLE+, ANGLE-
        self.action_space = Discrete(11)
        '''random output when observation_space is sampled:
        [[[0],[0],[0],...],
         [[0],[1],[0],...],
              .....,
         [[0],[1],[3],...],
         [[0],[1],[5],...]]'''
        self.observation_space = Box(0, 10, (165, 165, 1), int)

    def reset(self):
        self.pygame.reset()
        obs = self.pygame.observe()
        return obs

    def step(self, action):
        self.pygame.action(action)
        obs = self.pygame.observe()
        reward = self.pygame.evaluate()
        done = self.pygame.is_done()
        # info = self.pygame.info()  # not really needed
        return obs, reward, done, {}

    def render(self, mode="human", close=False):
        self.pygame.view()
