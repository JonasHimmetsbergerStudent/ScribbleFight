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

'''

import cv2
import numpy as np
import sys
from PIL import Image

np.set_printoptions(threshold=sys.maxsize)


img_file = 'Unbenannt_map.png'
alpha_img = cv2.imread(img_file, cv2.IMREAD_UNCHANGED)  # rgba
imgWarpGray = cv2.cvtColor(alpha_img, cv2.COLOR_BGR2GRAY)
imgAdaptiveThre = cv2.adaptiveThreshold(imgWarpGray, 255, 1, 1, 7, 2)
imgAdaptiveThre = cv2.bitwise_not(imgAdaptiveThre)
imgAdaptiveThre = cv2.medianBlur(imgAdaptiveThre, 3)
img = alpha_img

iar = np.asarray(img).tolist()

rows = len(iar)
columns = len(iar[0])
n = 5
x = 0
y = 0

newImg = []

while y < rows:
    while x < columns:
        # array be like pixel[y][x][0] = blau
        # array be like pixel[y][x][1] = grün
        # array be like pixel[y][x][2] = rot
        # array be like pixel[y][x][3] = opacity
        b = iar[y][x][0]
        g = iar[y][x][1]
        r = iar[y][x][2]
        a = iar[y][x][3]

        i = 0
        j = 0
        bg = 0
        while i < n:
            while j < n:
                if (y + j) < rows and (x + i) < columns:
                    if np.all(iar[y + j][x + i] == [255, 255, 255], 0):
                        bg += 1
                else:
                    bg += 1
                j += 1
            j = 0
            i += 1

        # noch richtig appenden und dann hot si de gschicht
        if (bg > 0):
            bgPercent = (n ** 2) / bg
            if (bgPercent < 1):
                newImg.append(iar[y][x])
            else:
                newImg.append([0, 0, 0, 0])
        else:
            newImg.append([0, 0, 0, 0])

        x += 5
    x = 0
    y += 5

pippoRGBA2 = Image.fromarray(np.array(iar).astype('uint8'), mode='RGBA')
pippoRGBA2.show()
