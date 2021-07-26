import cv2
import numpy as np
import math
import operator


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
        oldBiggest = squarify(biggest)
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
    return myPointsNew


def rotateCW(myPoints):
    myPointsNew = np.zeros((4, 2))
    myPointsNew[0] = myPoints[1]
    myPointsNew[1] = myPoints[2]
    myPointsNew[2] = myPoints[3]
    myPointsNew[3] = myPoints[0]
    return myPointsNew[::-1]


def squarify(myPoints):
    myPointsNew = np.zeros((4, 2))

    # distanzen + winkel = reihung

    zero = [0, 0]
    pt_A = myPoints[0]
    pt_B = myPoints[1]
    pt_C = myPoints[2]
    pt_D = myPoints[3]

    lenA = np.sqrt((pt_A[0] ** 2) + (pt_A[1] ** 2))
    lenB = np.sqrt((pt_B[0] ** 2) + (pt_B[1] ** 2))
    lenC = np.sqrt((pt_C[0] ** 2) + (pt_C[1] ** 2))
    lenD = np.sqrt((pt_D[0] ** 2) + (pt_D[1] ** 2))

    lineZA = np.array([zero, pt_A])
    lineZB = np.array([zero, pt_B])
    lineZC = np.array([zero, pt_C])
    lineZD = np.array([zero, pt_D])

    angleZA = ang(lineZA, np.array([zero, [1, 0]]))
    angleZB = ang(lineZB, np.array([zero, [1, 0]]))
    angleZC = ang(lineZC, np.array([zero, [1, 0]]))
    angleZD = ang(lineZD, np.array([zero, [1, 0]]))

    lenAngPt = np.array([[lenA, angleZA, pt_A], [lenB, angleZB, pt_B],
                         [lenC, angleZC, pt_C], [lenD, angleZD, pt_D]])

    list1 = sorted(lenAngPt, key=lambda x: x[0])
    print(list1)

    myPointsNew[0] = list1[0][2]
    myPointsNew[2] = list1[len(list1) - 1][2]

    list2 = sorted(lenAngPt, key=lambda x: x[1])
    print(list2[0][2] in myPointsNew)
    print(list2[0][2])
    print(myPoints)

    if list2[0][2] not in myPointsNew:
        myPointsNew[1] = list2[0][2]
    else:
        myPointsNew[1] = list2[1][2]

    if list2[len(list2) - 1][2] not in myPointsNew:
        myPointsNew[3] = list2[len(list2) - 1][2]
    else:
        myPointsNew[3] = list2[len(list2) - 2][2]

    print(myPointsNew)

    return myPointsNew


def dot(vA, vB):
    return vA[0]*vB[0]+vA[1]*vB[1]


def ang(lineA, lineB):
    # Get nicer vector form
    vA = [(lineA[0][0]-lineA[1][0]), (lineA[0][1]-lineA[1][1])]
    vB = [(lineB[0][0]-lineB[1][0]), (lineB[0][1]-lineB[1][1])]
    # Get dot prod
    dot_prod = dot(vA, vB)
    # Get magnitudes
    magA = dot(vA, vA)**0.5
    magB = dot(vB, vB)**0.5
    # Get cosine value
    cos_ = dot_prod/magA/magB
    # Get angle in radians and then convert to degrees
    angle = math.acos(dot_prod/magB/magA)
    # Basically doing angle <- angle mod 360
    ang_deg = math.degrees(angle) % 360

    if ang_deg-180 >= 0:
        # As in if statement
        return 360 - ang_deg
    else:
        return ang_deg
