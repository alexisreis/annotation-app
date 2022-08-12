from flask import Blueprint, jsonify, send_file, request, make_response
from image_processing import process_image
from word_spotting import word_spotting
from utils.extension import token_required, admin
from utils.image_processing import process_image
from utils.word_spotting import word_spotting
from os.path import exists

images = Blueprint('images', __name__)


@images.route("/getResizedImage/<cote>/<img>")
@token_required
def getResizedImage(cote, img):
    path_to_resized_image = f'''images\\resized\\{cote}\\{img}.jpg'''
    if not exists(path_to_resized_image):
        return make_response(jsonify({'not_found': 'No files'}), 404)
    return make_response(send_file(path_to_resized_image,
                                   mimetype='image/jpg'), 200)


@images.route("/getOriginalImage/<cote>/<img>")
@token_required
def getOriginalImage(cote, img):
    path_to_original_image = f'''images\\original\\{cote}\\{img}.jpg'''
    if not exists(path_to_original_image):
        return make_response(jsonify({'not_found': 'No files'}), 404)
    return make_response(send_file(path_to_original_image,
                                   mimetype='image/jpg'), 200)


@images.route("/getImageTest")
@token_required
def getImageTest():
    path_to_image = "../client/public/wallpaper.jpg"
    if not exists(path_to_image):
        return make_response(jsonify({'not_found': 'No files'}), 404)
    return make_response(send_file(path_to_image,
                                   mimetype='image/jpg'), 200)


@images.route('/uploadImage', methods=['POST'])
@admin
def uploadImage():
    """
    POST route handler that accepts an image, manipulates it and returns a JSON containing a possibly different image with more fields
    """
    # Read image from request and write to server's file system
    data = request.files['file']
    data.save('save_pic.jpg')

    path_to_processed_image = process_image('save_pic.jpg')
    return make_response(send_file(path_to_processed_image,
                                   mimetype='image/jpg'), 200)


@images.route('/findWordInImage', methods=['POST'])
@token_required
def findWordInImage():
    """
    POST route handler that accepts an image, manipulates it and returns a JSON containing a possibly different image with more fields
    """

    # Read image from request and write to server's file system
    try:
        data = request.files['file']
        x = int(request.values.get('x'))
        y = int(request.values.get('y'))
        w = int(request.values.get('w'))
        h = int(request.values.get('h'))
    except request.exceptions.RequestException as e:
        return jsonify(e)

    # print(f'x: {x}, y: {y}, w: {w}, h:{h}')
    data.save('save_pic.jpg')

    best_potential = word_spotting('save_pic.jpg', x, y, w, h)

    # return send_file(best_potential, mimetype='image/jpg')
    return make_response(jsonify(best_potential), 200)

