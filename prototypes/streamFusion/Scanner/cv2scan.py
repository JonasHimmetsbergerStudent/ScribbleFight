from .utlis import *
from PIL import Image

import cv2
import numpy as np
import imutils
import sys
import math


def check(img):
    contours = oldBiggest = biggest = np.array([])
    imgGray = imgThreshold = imgContours = imgBlank = None
    biggestChanged = 1

    if img is not None:
        heightImg, widthImg, chanel = img.shape

        # CREATE A BLANK IMAGE FOR TESTING DEBUGING IF REQUIRED
        imgBlank = np.zeros((heightImg, widthImg, 3), np.uint8)
        imgGray = imgThreshold = imgContours = imgBlank

        # CONVERT IMAGE TO GRAY SCALE
        imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        imgBlur = cv2.GaussianBlur(imgGray, (5, 5), 1)  # ADD GAUSSIAN BLUR
        upperThres = 40
        lowerThres = 40
        imgThreshold = cv2.Canny(
            imgBlur, upperThres, lowerThres)  # APPLY CANNY BLUR

        image_contours = np.zeros((heightImg, widthImg, 1), np.uint8)

        image_binary = np.zeros((heightImg, widthImg, 1), np.uint8)

        for channel in range(img.shape[2]):
            ret, image_thresh = cv2.threshold(
                img[:, :, channel],  200, 200, cv2.THRESH_BINARY)
            special_contours = cv2.findContours(image_thresh, 1, 1)[0]
            cv2.drawContours(image_contours, special_contours, -
                             1, (255, 255, 255), 3)

        special_contours = cv2.findContours(image_contours, cv2.RETR_LIST,
                                            cv2.CHAIN_APPROX_SIMPLE)[0]
        if len(special_contours) > 0:
            cv2.drawContours(image_binary, [max(special_contours, key=cv2.contourArea, default=0)],
                             -1, (255, 255, 255), -1)
            cv2.drawContours(image_binary, special_contours,
                             -1, (255, 255, 0), 2)

        imgGray = image_binary

        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2, 2))
        # kernel = None
        imgDial = cv2.dilate(imgThreshold, kernel,
                             iterations=3)  # APPLY DILATION
        imgThreshold = cv2.erode(
            imgDial, kernel, iterations=3)  # APPLY EROSION
        # !SECTION

        contours, hierarchy = cv2.findContours(
            imgThreshold, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)  # FIND ALL CONTOURS

        # SECTION find all contours + draw them
        imgContours = img.copy()  # COPY IMAGE FOR DISPLAY PURPOSES

        # FIND THE BIGGEST COUNTOUR
        accuracy = 25/1000
        area = 1000
        biggest, maxArea = biggestContour(
            contours, accuracy, area)  # FIND THE BIGGEST CONTOUR

        # SECTION draw enclosing yellow border
        cnts = cv2.findContours(imgThreshold.copy(), cv2.RETR_EXTERNAL,
                                cv2.CHAIN_APPROX_SIMPLE)
        cnts = imutils.grab_contours(cnts)
        if len(cnts) != 0 and cv2.contourArea:
            c = max(cnts, key=cv2.contourArea)
            cv2.drawContours(
                imgContours, [c], -1, (0, 255, 255), -1)
        # !SECTION

        if len(oldBiggest) == 0:
            oldBiggest = biggest

        # CALCULATE PERCENTAGE DIFFERENCE BETWEEN NEW AND OLD CONOURS
        a = np.array(biggest)
        b = np.array(oldBiggest)
        # RAISES NAN ERRORS THAT CAN BE IGNORED (CAN!!!)
        biggestChanged = np.mean(
            a != b) if a.size != 0 and b.size != 0 else 1

        #!SECTION

    edges = getEdges(oldBiggest, biggest, contours, img, biggestChanged)

    return edges


def getWrappedImg(img, snipset):
    snipset = squarify(snipset)

    pt_A = snipset[0]
    pt_B = snipset[1]
    pt_C = snipset[2]
    pt_D = snipset[3]

    lineAB = np.array([pt_A, pt_B])
    lineBC = np.array([pt_B, pt_C])
    lineCD = np.array([pt_C, pt_D])
    lineDA = np.array([pt_D, pt_A])

    width_AD = np.sqrt(((pt_A[0] - pt_D[0]) ** 2) + ((pt_A[1] - pt_D[1]) ** 2))
    width_BC = np.sqrt(((pt_B[0] - pt_C[0]) ** 2) + ((pt_B[1] - pt_C[1]) ** 2))
    maxHeight = max(int(width_AD), int(width_BC))
    if maxHeight == width_AD:
        lineA = lineDA
    else:
        lineA = lineBC

    height_AB = np.sqrt(((pt_A[0] - pt_B[0]) ** 2) +
                        ((pt_A[1] - pt_B[1]) ** 2))
    height_CD = np.sqrt(((pt_C[0] - pt_D[0]) ** 2) +
                        ((pt_C[1] - pt_D[1]) ** 2))
    maxWidth = max(int(height_AB), int(height_CD))
    if maxWidth == height_AB:
        lineB = lineAB
    else:
        lineB = lineCD

    angle = ang(lineA, lineB)
    if angle == 90:
        factor = 1
    if angle > 90:
        factor = 90 / (180-angle)
    if angle < 90:
        factor = 90 / angle

    maxHeight *= factor

    m = np.array([pt_A, pt_B, pt_C, pt_D])
    m = rotateCW(m)
    input_pts = np.float32(m)
    output_pts = np.float32([[0, 0],
                            [0, maxHeight - 1],
                            [maxWidth - 1, maxHeight - 1],
                            [maxWidth - 1, 0]])

    M = cv2.getPerspectiveTransform(input_pts, output_pts)

    dst = cv2.warpPerspective(
        img, M, (int(maxWidth), int(maxHeight)), flags=cv2.INTER_LINEAR)

    return dst


def getPlayableArray(img):
    np.set_printoptions(threshold=sys.maxsize)

    alpha_img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)  # rgba
    imgWarpGray = cv2.cvtColor(alpha_img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(imgWarpGray, (7, 7), 0)
    imgAdaptiveThre = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 7, 2)
    imgAdaptiveThre = cv2.bitwise_not(imgAdaptiveThre)
    imgAdaptiveThre = cv2.medianBlur(imgAdaptiveThre, 3)

    imgAdaptiveThre = np.array(makeSquare(
        cv2.cvtColor(imgAdaptiveThre, cv2.COLOR_BGR2BGRA)))

    img = cv2.cvtColor(imgAdaptiveThre, cv2.COLOR_BGR2BGRA)

    # pippoRGBA2 = Image.fromarray(np.array(img).astype('uint8'), mode='RGBA')
    # pippoRGBA2.show()
    cv2.imwrite(
        './prototypes/streamFusion/output/imgAdaptiveThre.png', imgAdaptiveThre)

    iar = np.asarray(img).tolist()

    rows = len(iar)
    columns = len(iar[0])

    meshes = 3025
    # percent = perc(rows * columns)
    percent = 95
    n = math.ceil(np.sqrt(rows * columns / meshes))

    x = 0
    y = 0

    newImg = []

    while y < rows:
        newImg.append([])
        while x < columns:

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

    iar = np.asarray(newImg).tolist()
    with open('./prototypes/streamFusion/output/mapArray.txt', 'w') as f:
        f.writelines(repr(iar))

    # pippoRGBA2 = Image.fromarray(np.array(newImg).astype('uint8'), mode='RGBA')
    # pippoRGBA2.show()
    cv2.imwrite(
        './prototypes/streamFusion/output/newImg.png', np.array(newImg))

    return newImg


def makeSquare(im, size=8, fill_color=(255, 255, 255, 1)):
    size = size * 55
    im = Image.fromarray(np.array(im).astype('uint8'),
                         mode='RGBA')  # cv2 img to PIL img
    x, y = im.size  # get mesurements
    new_im = Image.new('RGBA', (size, size), fill_color)
    new_im.paste(im, (int((size - x) / 2), int((size - y) / 2)))
    return new_im
