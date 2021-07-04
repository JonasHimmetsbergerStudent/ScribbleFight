from time import sleep
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
