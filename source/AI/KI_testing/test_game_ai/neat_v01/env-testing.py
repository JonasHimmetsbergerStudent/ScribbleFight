import gym


env = gym.make("Pong-ram-v0")
# env = gym.make("Breakout-v0")

observation = env.reset()

print(observation)
print(env.action_space)

done = False
while not done:
    observation, reward, done, info = env.step(env.action_space.sample())
    print(env.action_space.sample())

    env.render()
env.close()
