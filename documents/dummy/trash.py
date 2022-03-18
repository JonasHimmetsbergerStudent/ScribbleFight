# import cv2
# import numpy

# # read image
# src = cv2.imread('C:/Users/Nonsas/Documents/Schule/Diplomarbeit/ScribbleFightViaLatex/DA_using_template/pics/bildverarbeitungsalgos/grayscaling_input.png', cv2.IMREAD_UNCHANGED)

# # apply guassian blur on src image
# # (10,10) is the Kernel size
# dst = cv2.GaussianBlur(src, (9, 9), cv2.BORDER_DEFAULT)

# # display input and output image
# cv2.imshow("Gaussian Smoothing", numpy.hstack((src, dst)))
# cv2.waitKey(0)  # waits until a key is pressed
# cv2.destroyAllWindows()  # destroys the window showing image


# Python program to illustrate
# adaptive thresholding type on an image

# # organizing imports
# import cv2
# import numpy as np

# # path to input image is specified and
# # image is loaded with imread command
# image1 = cv2.imread(
#     'C:/Users/Nonsas/Documents/Schule/Diplomarbeit/ScribbleFightViaLatex/DA_using_template/pics/bildverarbeitungsalgos/grayscaling_output.png')

# # cv2.cvtColor is applied over the
# # image input with applied parameters
# # to convert the image in grayscale
# img = cv2.cvtColor(image1, cv2.COLOR_BGR2GRAY)

# # applying gaussian thresholding
# # technique on the input image
# thresh = cv2.adaptiveThreshold(
#     img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 5, 4)

# cv2.imshow('Adaptive Gaussian', thresh)


# # De-allocate any associated memory usage
# if cv2.waitKey(0) & 0xff == 27:
#     cv2.destroyAllWindows()


import cv2
import numpy as np

# Let's load a simple image with 3 black squares
image = cv2.imread(
    'C:/Users/Nonsas/Documents/Schule/Diplomarbeit/ScribbleFightViaLatex/DA_using_template/pics/bildverarbeitungsalgos/input.png')
cv2.waitKey(0)

# Grayscale
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Find Canny edges
edged = cv2.Canny(gray, 30, 200)
cv2.waitKey(0)

# Finding Contours
# Use a copy of the image e.g. edged.copy()
# since findContours alters the image
contours, hierarchy = cv2.cv2.findContours(
    edged, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)

cv2.imshow('Canny Edges After Contouring', edged)
cv2.waitKey(0)

print("Number of Contours found = " + str(len(contours)))

# Draw all contours
# -1 signifies drawing all contours
cv2.drawContours(image, contours, -1, (255, 255, 0), 1)

cv2.imshow('Contours', image)
cv2.waitKey(0)
cv2.destroyAllWindows()
