import cv2
import numpy as np


def reorder(myPoints):  # THE GIVEN ARRAY FROM OPEN-CV NEEDS TO BE REARRANGED

    myPoints = myPoints.reshape((4, 2))
    myPointsNew = np.zeros((4, 1, 2), dtype=np.int32)
    add = myPoints.sum(1)

    myPointsNew[0] = myPoints[np.argmin(add)]
    myPointsNew[3] = myPoints[np.argmax(add)]
    diff = np.diff(myPoints, axis=1)
    myPointsNew[1] = myPoints[np.argmin(diff)]
    myPointsNew[2] = myPoints[np.argmax(diff)]

    return myPointsNew


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
