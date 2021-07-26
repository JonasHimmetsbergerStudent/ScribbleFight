# TODO
# Remove stuff tat is sourrounded with contour  https://www.programmersought.com/article/58794301085/

from .utlis import *
import cv2
import numpy as np
import imutils
import math
import scipy.spatial.distance


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

    pt_A = snipset[0]
    pt_B = snipset[1]
    pt_C = snipset[2]
    pt_D = snipset[3]

    width_AD = np.sqrt(((pt_A[0] - pt_D[0]) ** 2) + ((pt_A[1] - pt_D[1]) ** 2))
    width_BC = np.sqrt(((pt_B[0] - pt_C[0]) ** 2) + ((pt_B[1] - pt_C[1]) ** 2))
    # die maxHeight * 90 / abs(90-winkel zwischen zwei größten linien)

    lineA = np.array([pt_A, pt_B])
    lineB = np.array([pt_B, pt_C])
    lineC = np.array([pt_C, pt_D])
    lineD = np.array([pt_D, pt_A])

    distLineA = ((((lineA[0][0] - lineA[0][1])**2) +
                 ((lineA[1][0] - lineA[1][1])**2))**0.5)
    distLineB = ((((lineB[0][0] - lineB[1][0])**2) +
                 ((lineB[1][1] - lineB[0][1])**2))**0.5)
    distLineC = ((((lineC[1][1] - lineC[0][1])**2) +
                 ((lineC[0][0] - lineC[1][0])**2))**0.5)
    distLineD = ((((lineD[0][0] - lineD[0][1])**2) +
                 ((lineD[1][0] - lineD[1][1])**2))**0.5)

    lineA = np.array([lineA, distLineA])
    lineB = np.array([lineB, distLineB])
    lineC = np.array([lineC, distLineC])
    lineD = np.array([lineD, distLineD])

    lines = [lineA, lineB, lineC, lineD]
    orderedLines = sorted(lines, key=lambda x: x[1], reverse=True)

    lineA, lineB, lineC = orderedLines[:3]
    if lineA == lineB:
        lineB = lineC

    lineA = lineA[0]
    lineB = lineB[0]

    print(lineA)
    print(lineB)

    # TODO winkel zwischen linien
    angle = ang(lineA, lineB)
    print(angle)
    if angle == 90:
        factor = 1
    else:
        factor = 90 / abs(90 - angle)
    maxWidth = max(int(width_AD), int(width_BC)) * factor

    height_AB = np.sqrt(((pt_A[0] - pt_B[0]) ** 2) +
                        ((pt_A[1] - pt_B[1]) ** 2))
    height_CD = np.sqrt(((pt_C[0] - pt_D[0]) ** 2) +
                        ((pt_C[1] - pt_D[1]) ** 2))
    maxHeight = max(int(height_AB), int(height_CD))

    input_pts = np.float32([pt_A, pt_B, pt_C, pt_D])
    output_pts = np.float32([[0, 0],
                            [0, maxHeight - 1],
                            [maxWidth - 1, maxHeight - 1],
                            [maxWidth - 1, 0]])

    M = cv2.getPerspectiveTransform(input_pts, output_pts)
    dst = cv2.warpPerspective(img, M, (maxWidth, maxHeight))

    return dst


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
