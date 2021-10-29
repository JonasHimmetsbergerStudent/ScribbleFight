import gym
from gym.spaces import MultiDiscrete, Box
from KI_v01.env.game import Game


class CustomEnv(gym.Env):

    '''
    This is an environment in wich an AI learns to play ScribbleFight
    '''

    #metadata = {'render.modes' : ['human']}
    def __init__(self):
        self.pygame = Game()
        '''DISCRETE[0]: ANGLE+, ANGLE-, idle
        DISCRETE[1]: "SPACE", "E", "Q", "R", "C", "F", "LEFTCLICK", idle
        DISCRETE[2]: "A", "D", idle'''
        self.action_space = MultiDiscrete([3, 8, 3])
        '''random output when observation_space is sampled:
        [[0,0,0,...],
         [0,1,0,...],
              .....,
         [0,1,3,...],
         [0,1,5,...]]'''
        self.observation_space = Box(0, 10, (165, 165), int)

    def reset(self):
        self.pygame.reset()
        obs = self.pygame.observe()
        return obs

    def step(self, actions):
        self.pygame.action(actions)
        obs = self.pygame.observe()
        # comparison = obs == Box(0, 0, (165, 165), int).sample()
        # equal_arrays = comparison.all()
        # print(equal_arrays)
        # obs = self.observation_space.sample()
        reward = self.pygame.evaluate()
        done = self.pygame.is_done()
        # info = self.pygame.info()  # not really needed
        return obs, reward, done, {}

    def render(self, mode="human", close=False):
        self.pygame.view()
