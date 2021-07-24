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
    (rows, cols, _) = img.shape

    # image center
    u0 = (cols)/2.0
    v0 = (rows)/2.0

    # detected corners on the original image
    p = reorder(snipset)

    # widths and heights of the projected image
    w1 = scipy.spatial.distance.euclidean(p[0], p[1])
    w2 = scipy.spatial.distance.euclidean(p[2], p[3])

    h1 = scipy.spatial.distance.euclidean(p[0], p[2])
    h2 = scipy.spatial.distance.euclidean(p[1], p[3])

    w = max(w1, w2)
    h = max(h1, h2)

    # visible aspect ratio
    ar_vis = float(w)/float(h)

    # make numpy arrays and append 1 for linear algebra
    m1 = np.array((p[0][0], p[0][1], 1)).astype('float32')
    m2 = np.array((p[1][0], p[1][1], 1)).astype('float32')
    m3 = np.array((p[2][0], p[2][1], 1)).astype('float32')
    m4 = np.array((p[3][0], p[3][1], 1)).astype('float32')

    # calculate the focal disrance
    k2 = np.dot(np.cross(m1, m4), m3) / np.dot(np.cross(m2, m4), m3)
    k3 = np.dot(np.cross(m1, m4), m2) / np.dot(np.cross(m3, m4), m2)

    n2 = k2 * m2 - m1
    n3 = k3 * m3 - m1

    n21 = n2[0]
    n22 = n2[1]
    n23 = n2[2]

    n31 = n3[0]
    n32 = n3[1]
    n33 = n3[2]

    f = math.sqrt(np.abs((1.0/(n23*n33)) * ((n21*n31 - (n21*n33 + n23*n31) *
                                             u0 + n23*n33*u0*u0) + (n22*n32 - (n22*n33+n23*n32)*v0 + n23*n33*v0*v0))))

    A = np.array([[f, 0, u0], [0, f, v0], [0, 0, 1]]).astype('float32')

    At = np.transpose(A)
    Ati = np.linalg.inv(At)
    Ai = np.linalg.inv(A)

    # calculate the real aspect ratio
    ar_real = math.sqrt(np.abs(np.dot(np.dot(np.dot(n2, Ati), Ai), n2) /
                        np.dot(np.dot(np.dot(n3, Ati), Ai), n3)))

    if ar_real < ar_vis:
        W = int(w)
        H = int(W / ar_real)
    else:
        H = int(h)
        W = int(ar_real * H)

    pts1 = np.array(p).astype('float32')
    pts2 = np.float32([[0, 0], [W, 0], [0, H], [W, H]])

    # project the image with the new w/h
    M = cv2.getPerspectiveTransform(pts1, pts2)

    dst = cv2.warpPerspective(img, M, (W, H))

    return dst
