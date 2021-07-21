# TODO
# Remove stuff tat is sourrounded with contour  https://www.programmersought.com/article/58794301085/

import cv2
import numpy as np
from .utlis import *
import imutils


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
        area = 2000
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


def getEdges(oldBiggest, biggest, contours, img, biggestChanged):
    # SECTION determine biggest contour
    # SECTION evaluate contours and draw biggest + flip image into perspective
    if biggest.size != 0 and (biggestChanged >= 0.5 or biggestChanged is None) and biggest.tolist() != oldBiggest.tolist():
        biggest = reorder(biggest)
        oldBiggest = biggest
    else:
        margin = 10
        height, width, chanel = img.shape
        width -= margin
        height -= margin
        windowPoints = np.array([[[margin, margin]], [[width, margin]],
                                 [[margin, height]], [[width, height]]])

        if (biggest.size == 0 and oldBiggest.size == 0) or len(contours) == 0:
            oldBiggest = windowPoints

    return oldBiggest
