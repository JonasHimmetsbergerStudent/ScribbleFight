from gym.envs.registration import register

register(
    id='ScribbleFight-v0',
    entry_point='KI_v01.gym_env:CustomEnv',
    # max_episode_steps=2000,
)
