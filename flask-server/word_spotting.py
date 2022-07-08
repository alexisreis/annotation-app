"""
Word spotting
Takes coordinates of a word in a base image
Place a grid on this word, calculates pixel density on the bilinearised word
Search for similarities in the rest of the image
"""

import cv2 as cv
import numpy as np
import math


# Matrices should be the same size
# Use of distance
def compareMatrices(mat1, mat2):
    somme = 0.0
    for i in range(len(mat1)):
        for j in range(len(mat1[0])):
            somme += pow(mat1[i][j] - mat2[i][j], 2);
    return math.sqrt(somme)


def word_spotting(img_path, x, y, w, h):
    potentials_words = []
    img = cv.imread(img_path)
    # cv.imshow('Image', img)

    # Threshold
    _, thresh_img = cv.threshold(img, 150, 255, cv.THRESH_BINARY)

    word = thresh_img[y:(y + h), x:(x + w)]
    # cv.imshow('Word', word)

    # cv.imshow('word', word)

    # Makes the grid
    square_size = 20  # pixels
    grid_c = int(w / square_size)
    grid_l = int(h / square_size)
    grid = np.zeros(shape=(grid_l, grid_c))

    for i in range(grid_l):
        for j in range(grid_c):
            grid[i][j] = (
                word[(i * square_size):((i + 1) * square_size),
                (j * square_size):((j + 1) * square_size)]).mean()

    # print(np.uint8(grid))

    # Look for similarities within the image
    step = 10  # step in pixels
    for l in range(0, len(img) - 1, step):
        for c in range(0, len(img[0]) - 1, step):
            if l not in range(x - 2 * step, x + 2 * step) and c not in range(
                    y - \
                                                                             2 * step,
                                                                             y + 2 * step):
                word_test = thresh_img[l:(l + h), c:(c + w)]
                grid_test = np.zeros(shape=(grid_l, grid_c))

                for i in range(grid_l):
                    for j in range(grid_c):
                        grid_test[i][j] = (
                            word_test[(i * square_size):((i + 1) * square_size),
                            (j * square_size):((j + 1) * square_size)]).mean()

                # if np.allclose(grid, grid_test, atol=30, rtol=0.05):
                #     print(f'x: {c} y: {l}')
                #     cv.imshow(f'Potentiel{c},{l}', word_test);

                score = compareMatrices(grid, grid_test)
                if score < 100.0:
                    # print(f'x: {c} y: {l} score: {score}')
                    # cv.imshow(f'Potentiel{c},{l}', word_test);
                    potentials_words.append([word_test, x, y, score])

    # Sort the potential with their score
    potentials_words.sort(key=lambda potential: potential[3])
    # Show only the best one
    # cv.imshow(f'Best Potential: x={potentials_words[0][1]} y={potentials_words[0][2]} score={potentials_words[0][3]}', potentials_words[0][0])
    # cv.waitKey(0)

    # Return the best potential
    file_name = 'best_potential.jpg'
    cv.imwrite(file_name, potentials_words[0][0])

    return file_name
