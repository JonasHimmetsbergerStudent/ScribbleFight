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





# get array of image pixels
from PIL import Image
import sys
import numpy as np
np.set_printoptions(threshold=sys.maxsize)

i = Image.open('Unbenannt_map.png')
iar = np.asarray(i).tolist()

with open('readme.txt', 'w') as f:
    f.writelines(repr(iar))
'''

# traverse each line
for i in range(1, h-1):
    for j in range(1, w-1):  # traverse each column
        if dst[i, j] == 255:  # judge whether the point is bai point, 0 means black point
            r = []
            for y in range(i - 1, i + 2):
                for x in range(j - 1, j + 2):
                    if y == i and x == j:
                        continue
                    if dst[y, x] == 255:
                        r.append((y, x))
        #
        rLen = len(r)
        if rLen > 0:
            # only one point, it is peak
            if rLen == 1:
                tool.logDebug('r = {}'.format(r))
                p.append((j, i))
            # there are two points and the distance is 1, it is also peak
            elif rLen == 2:
                dy = r[0][0] - r[1][0]
                dx = r[0][1] - r[1][1]
                t = dx * dx + dy * dy
                if t == 1:
                    tool.logDebug('r = {}'.format(r))
                    p.append((j, i))
    #
    pLen = len(p)
tool.logDebug('Vertex sequence: {}'.format(p))
