from PIL import Image
import numpy as np
import ast
import cv2

f = open("./source/prototypes/testArray/test.txt", "r")
iar = ast.literal_eval(f.read())

rows = len(iar)
columns = len(iar[0])

newImg = []
# newImg = iar
x = 0
y = 0

while y < rows:
    newImg.append([])
    while x < columns:
        if iar[y][x] == 0:
            newImg[y].append([255, 255, 255, 255])
        if iar[y][x] == 1:
            newImg[y].append([255, 0, 0, 255])
        if iar[y][x] == 2:
            newImg[y].append([0, 255, 0, 255])
        if iar[y][x] == 3:
            newImg[y].append([0, 0, 255, 255])
        if iar[y][x] == 4:
            newImg[y].append([255, 255, 0, 255])
        if iar[y][x] == 5:
            newImg[y].append([0, 255, 255, 255])
        if iar[y][x] == 6:
            newImg[y].append([255, 100, 0, 255])
        if iar[y][x] == 7:
            newImg[y].append([0, 0, 0, 255])
        if iar[y][x] == 8:
            newImg[y].append([0, 100, 255, 255])
        if iar[y][x] == 9:
            newImg[y].append([100, 100, 255, 255])
        if iar[y][x] == 10:
            newImg[y].append([255, 100, 100, 255])

        x += 1
    x = 0
    y += 1

# print(newImg)

# pippoRGBA2 = Image.fromarray(np.array(newImg).astype('uint8'), mode='RGBA')
# pippoRGBA2.show()


iar = np.asarray(newImg).tolist()
cv2.imwrite('./source/prototypes/testArray/newImg.png', np.array(newImg))
