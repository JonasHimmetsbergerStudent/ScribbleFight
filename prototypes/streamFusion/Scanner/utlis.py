import cv2
import numpy as np


def biggestContour(contours, accuracy, areaVal):  # FIND THE BIGGEST CONTOUR
    biggest = np.array([])
    max_area = 0

    for i in contours:
        area = cv2.contourArea(i)
        if area > areaVal:
            peri = cv2.arcLength(i, True)
            # ACCURACY IS A DYNAMIC SLIDER VALUE
            approx = cv2.approxPolyDP(i, accuracy * peri, True)
            if area > max_area and len(approx) == 4:  # IF == 4 THEN SQUARE
                biggest = approx
                max_area = area
    return biggest, max_area


def getEdges(oldBiggest, biggest, contours, img, biggestChanged):
    # SECTION determine biggest contour
    # SECTION evaluate contours and draw biggest + flip image into perspective
    if biggest.size != 0 and (biggestChanged >= 0.5 or biggestChanged is None) and biggest.tolist() != oldBiggest.tolist():
        oldBiggest = biggest
    else:
        margin = 10
        height, width, chanel = img.shape
        width -= margin
        height -= margin
        windowPoints = np.array([[[margin, margin]], [[width, margin]],
                                 [[width, height]], [[margin, height]]])

        if (biggest.size == 0 and oldBiggest.size == 0) or len(contours) == 0:
            oldBiggest = windowPoints

    return oldBiggest


def reorder(myPoints):  # THE GIVEN ARRAY FROM OPEN-CV NEEDS TO BE REARRANGED

    myPointsNew = np.zeros((4, 2))
    myPointsNew[0] = myPoints[1]
    myPointsNew[1] = myPoints[0]
    myPointsNew[2] = myPoints[2]
    myPointsNew[3] = myPoints[3]

    myPointsNewNew = myPointsNew  # [::1]

    return myPointsNewNew
