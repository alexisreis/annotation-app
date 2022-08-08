from flask import Blueprint, jsonify, send_file, request
from image_processing import process_image
from word_spotting import word_spotting

images = Blueprint('images', __name__)


@images.route("/getResizedImage/<cote>/<img>")
def getResizedImage(cote, img):
    path_to_processed_image = f'''images\\resized\\{cote}\\{img}.jpg'''
    return send_file(path_to_processed_image, mimetype='image/jpg')\


@images.route("/getOriginalImage/<cote>/<img>")
def getOriginalImage(cote, img):
    path_to_processed_image = f'''images\\original\\{cote}\\{img}.jpg'''
    return send_file(path_to_processed_image, mimetype='image/jpg')


@images.route("/getImageTest")
def getImageTest():
    path_to_processed_image = process_image(
        "../client/public/wallpaper.jpg")
    return send_file(path_to_processed_image, mimetype='image/jpg')


@images.route('/uploadImage', methods=['POST'])
def uploadImage():
    """
    POST route handler that accepts an image, manipulates it and returns a JSON containing a possibly different image with more fields
    """
    # Read image from request and write to server's file system
    data = request.files['file']
    data.save('save_pic.jpg')

    path_to_processed_image = process_image('save_pic.jpg')
    return send_file(path_to_processed_image, mimetype='image/jpg')


@images.route('/findWordInImage', methods=['POST'])
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
    return jsonify(best_potential)

