

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
import cv2
import numpy as np
np.set_printoptions(threshold=sys.maxsize)


from PIL import Image
import cv2
import numpy as np
import base64
import json
import math

i = Image.open('./prototypes/document scanner/1.jpg')
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
'''
import cv2
import numpy as np
import sys
import math
import base64
from PIL import Image

np.set_printoptions(threshold=sys.maxsize)


def perc(pixels):
    a = 1
    d = 50
    S = 95-d
    k = 0.00006

    return (a*S)/(a+(S-a)*math.exp((-k)*(pixels-10000)))+d


img_file = 'map.png'
alpha_img = cv2.imread(img_file, cv2.IMREAD_UNCHANGED)  # rgba
imgWarpGray = cv2.cvtColor(alpha_img, cv2.COLOR_BGR2GRAY)
imgAdaptiveThre = cv2.adaptiveThreshold(imgWarpGray, 255, 1, 1, 7, 2)
imgAdaptiveThre = cv2.bitwise_not(imgAdaptiveThre)
imgAdaptiveThre = cv2.medianBlur(imgAdaptiveThre, 3)
img = cv2.cvtColor(imgAdaptiveThre, cv2.COLOR_BGR2BGRA)
# cv2.imshow('image', imgAdaptiveThre)

iar = np.asarray(img).tolist()

rows = len(iar)
columns = len(iar[0])

meshes = 3000
percent = perc(rows * columns)
print(percent)
n = math.ceil(np.sqrt(rows * columns / meshes))

x = 0
y = 0

newImg = []


while y < rows:
    newImg.append([])
    while x < columns:
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
                    if np.all(iar[y + j][x + i][:3] == [255, 255, 255], 0):
                        bg += 1
                else:
                    bg += 1
                j += 1
            j = 0
            i += 1

        bgPercent = bg / (n**2)
        if (bgPercent < (percent / 100)):
            newImg[int(y / n)].append([0, 0, 0, 255])
        else:
            newImg[int(y / n)].append([255, 255, 255, 0])

        x += n
    x = 0
    y += n


pippoRGBA2 = Image.fromarray(np.array(newImg).astype('uint8'), mode='RGBA')
pippoRGBA2.show()
'''
