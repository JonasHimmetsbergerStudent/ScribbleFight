# TODO
# ✓    ROUND EDGE DETECTION?
# FIXME CONOUR LASSEN; HINTERGRUND ZEICHNEN
# ANIMATION OF BOUNDS
# IF NO MAYOR CHANGES DONE THEN IGNORE https://stackoverflow.com/questions/6709693/calculating-the-similarity-of-two-lists
#   TIME DIALATION
# create a mask beforehand and then add the square? https://pmcg2k15.wordpress.com/2015/09/14/ball-tracking-with-opencv/
#   ERRODE
#   DILATE
# IGNORE TOUCHING EDGES? https://stackoverflow.com/questions/40615515/how-to-ignore-remove-contours-that-touch-the-image-boundaries/40620226
#   detect shapes with intersections
#       https://stackoverflow.com/questions/66977282/python-opencv-detect-shapes-with-intersections
#       https://stackoverflow.com/questions/65391880/how-to-detect-intersecting-shapes-with-opencv-findcontours
# STREAM TO WEBPAGE
# Fürn schriftlichen teil:
# https://stackoverflow.com/questions/8830619/difference-between-cv-retr-list-cv-retr-tree-cv-retr-external
# ERASE errors


import cv2
import numpy as np
import utlis
import imutils
from time import sleep
from threading import Thread

########################################################################
webCamFeed = True
pathImage = "1.jpg"
cap = cv2.VideoCapture(1)
cap.set(10, 160)
heightImg = 480
widthImg = 640
borderColor = (1, 59, 218)
########################################################################

utlis.initializeTrackbars()
count = 0
printed = False
oldBiggest = []


# def check():


while True:

    # SECTION webcam to open-cv
    # NOTE checks webcam connection
    # converts webcam image to readable open-cv data
    # uses threshold values that can be set via slider
    if webCamFeed:
        success, img = cap.read()
        if success:
            if not printed:  # BOOLEAN WHICH DESCRIBES IF STARTING MESSAGE IS PRINTED OR NOT
                printed = True
                print("document scanner running\nTh1:40\nTh2:20\nAcc:20\nArea:4000")
        else:
            print("scanner failed")
    else:
        img = cv2.imread(pathImage)
        print("scanner failed")
    img = cv2.resize(img, (widthImg, heightImg))  # RESIZE IMAGE
    # CREATE A BLANK IMAGE FOR TESTING DEBUGING IF REQUIRED
    imgBlank = np.zeros((heightImg, widthImg, 3), np.uint8)
    # CONVERT IMAGE TO GRAY SCALE
    imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    imgBlur = cv2.GaussianBlur(imgGray, (5, 5), 1)  # ADD GAUSSIAN BLUR
    thres = utlis.valTrackbars()  # GET TRACK BAR VALUES FOR THRESHOLDS
    threshold1 = thres[0]
    threshold2 = thres[1]
    # threshold1 = 40
    # threshold2 = 20
    imgThreshold = cv2.Canny(
        imgBlur, threshold1, threshold2)  # APPLY CANNY BLUR
    # kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2, 2))
    kernel = None
    imgDial = cv2.dilate(imgThreshold, kernel, iterations=2)  # APPLY DILATION
    imgThreshold = cv2.erode(imgDial, kernel, iterations=1)  # APPLY EROSION
    # !SECTION

    # SECTION find all contours + draw them
    imgContours = img.copy()  # COPY IMAGE FOR DISPLAY PURPOSES
    imgBigContour = img.copy()  # COPY IMAGE FOR DISPLAY PURPOSES
    contours, hierarchy = cv2.findContours(
        imgThreshold, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)  # FIND ALL CONTOURS
    # if len(contours) >= 5:  # IF LESS THEN 5 CONTOURS WERE FOUND THE CODE THREW ERROR
    #     cnt = contours[4]  # ONLY CONTOURS WITH 4 POINTS
    #     cv2.drawContours(img, [cnt], 0, borderColor, 3)
    # else:
    #     cv2.drawContours(imgContours, contours, -1, borderColor,
    #                      3)  # DRAW ALL DETECTED CONTOURS
    # cv2.drawContours(imgContours, contours, -1, borderColor,
    #                  2)  # DRAW ALL DETECTED CONTOURS

    # FIND THE BIGGEST COUNTOUR
    accuracy = thres[2]/1000
    # accuracy = 20 / 1000
    area = thres[3]
    # area = 4000
    biggest, maxArea = utlis.biggestContour(
        contours, accuracy, area)  # FIND THE BIGGEST CONTOUR

    cnts = cv2.findContours(imgThreshold.copy(), cv2.RETR_EXTERNAL,
                            cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)
    if len(cnts) != 0 and cv2.contourArea:
        c = max(cnts, key=cv2.contourArea)
        cv2.drawContours(imgContours, [c], -1, (0, 255, 255), 2)

    if len(oldBiggest) == 0:
        oldBiggest = biggest

    a = np.array(biggest)
    b = np.array(oldBiggest)
    # RAISES NAN ERRORS THAT CAN BE IGNORED (CAN!!!)
    biggestChanged = np.mean(a != b)

    # BLUE BORDER WHICH WRAPS UP SMALL BORDERS
    hull = utlis.findHulls(biggest)
    for i in range(len(hull)):
        cv2.drawContours(imgContours, hull, i, (255, 0, 0), 1, 8)
    #!SECTION

    # SECTION evaluate contours and draw biggest + flip image into perspective
    if biggest.size != 0 and (biggestChanged >= 0.5 or biggestChanged is None) and biggest.tolist() != oldBiggest.tolist():
        biggest = utlis.reorder(biggest)
        oldBiggest = biggest

    else:
        # imageArray = ([img, imgGray, imgThreshold, imgContours],
        #               [imgBlank, imgBlank, imgBlank, imgBlank])
        margin = 10
        height, width, chanel = img.shape
        width -= margin
        height -= margin
        windowPoints = np.array([[[margin, margin]], [[width, margin]],
                                 [[margin, height]], [[width, height]]])

        if biggest.size == 0 and oldBiggest.tolist() != windowPoints.tolist():
            oldBiggest = biggest = windowPoints

    # cv2.drawContours(imgBigContour, biggest, -1,
    #                  (0, 255, 0), 10)  # DRAW CIRCLES
    # DRAW THE BIGGEST CONTOUR
    imgBigContour = utlis.drawRectangle(
        imgBigContour, oldBiggest, borderColor, 2)

    pts1 = np.float32(oldBiggest)  # PREPARE POINTS FOR WARP
    pts2 = np.float32([[0, 0], [widthImg, 0], [0, heightImg], [
        widthImg, heightImg]])  # PREPARE POINTS FOR WARP
    matrix = cv2.getPerspectiveTransform(pts1, pts2)
    imgWarpColored = cv2.warpPerspective(
        img, matrix, (widthImg, heightImg))

    # REMOVE 20 PIXELS FORM EACH SIDE
    imgWarpColored = imgWarpColored[20:imgWarpColored.shape[0] -
                                    20, 20:imgWarpColored.shape[1] - 20]
    imgWarpColored = cv2.resize(imgWarpColored, (widthImg, heightImg))

    # APPLY ADAPTIVE THRESHOLD
    imgWarpGray = cv2.cvtColor(imgWarpColored, cv2.COLOR_BGR2GRAY)
    imgAdaptiveThre = cv2.adaptiveThreshold(imgWarpGray, 255, 1, 1, 7, 2)
    imgAdaptiveThre = cv2.bitwise_not(imgAdaptiveThre)
    imgAdaptiveThre = cv2.medianBlur(imgAdaptiveThre, 3)

    # Image Array for Display
    # imageArray = ([img, imgGray, imgThreshold, imgContours],
    #               [imgBigContour, imgWarpColored, imgWarpGray, imgAdaptiveThre])
    imageArray = ([imgThreshold, imgContours],
                  [imgBigContour, imgWarpColored])

    # !SECTION

    # SECTION draw open-cv data
    # LABELS FOR DISPLAY
    # lables = [["Original", "Gray", "Threshold", "Contours"],
    #           ["Biggest Contour", "Warp Prespective", "Warp Gray", "Adaptive Threshold"]]
    lables = [["Threshold", "Contours"],
              ["Biggest Contour", "Warp Prespective"]]

    stackedImage = utlis.stackImages(imageArray, 0.75, lables)
    cv2.imshow("Result", stackedImage)
    # !SECTION

    # SAVE IMAGE WHEN 's' key is pressed
    if cv2.waitKey(1) & 0xFF == ord('s'):
        cv2.imwrite("Scanned/myImage"+str(count)+".jpg", imgWarpColored)
        cv2.rectangle(stackedImage, ((int(stackedImage.shape[1] / 2) - 230), int(stackedImage.shape[0] / 2) + 50),
                      (1100, 350), borderColor, cv2.FILLED)
        cv2.putText(stackedImage, "Scan Saved", (int(stackedImage.shape[1] / 2) - 200, int(stackedImage.shape[0] / 2)),
                    cv2.FONT_HERSHEY_DUPLEX, 3, (0, 0, 255), 5, cv2.LINE_AA)
        cv2.imshow('Result', stackedImage)
        cv2.waitKey(300)
        count += 1
        print("image saved")

    # sleep(0.25)
