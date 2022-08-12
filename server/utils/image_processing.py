# Functions for image processing using OPENCV library

# Imports
import cv2 as cv
import numpy as np

path_to_processed_image = "ret.jpg"


# Returns path to processed image
def process_image(path_to_image):
    image = cv.imread(path_to_image)
    image = cv.cvtColor(image, cv.COLOR_BGR2RGB)

    pixel_values = image.reshape((-1, 3))
    pixel_values = np.float32(pixel_values)

    criteria = (cv.TERM_CRITERIA_EPS + cv.TERM_CRITERIA_MAX_ITER, 100, 0.2)
    k = 3
    _, labels, (centers) = cv.kmeans(pixel_values, k, None, criteria, 10,
                                     cv.KMEANS_RANDOM_CENTERS)
    centers = np.uint8(centers)
    labels = labels.flatten()

    segmented_image = centers[labels.flatten()]
    segmented_image = segmented_image.reshape(image.shape)
    cv.imwrite(path_to_processed_image, segmented_image)

    return path_to_processed_image
