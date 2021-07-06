'''from time import sleep
import imutils
import utlis
import numpy as np
import cv2
import time
from threading import Thread


class Smth:
    def __init__(self, a):
        self.a = a

    def test(self):
        time.sleep(1)
        self.a += 1
        self.test()

    def start(self):
        Thread(target=self.test).start()
        while(1):
            print(self.a)
            time.sleep(0.2)


Smth(1).start()
'''

from PIL import Image
import sys
import numpy as np
np.set_printoptions(threshold=sys.maxsize)

i = Image.open('Unbenannt_map.png')
iar = np.asarray(i).tolist()

with open('readme.txt', 'w') as f:
    f.writelines(repr(iar))
