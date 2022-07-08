# cd flask-server
# .\venv\Scripts\activate
# python server.py

from flask import Flask, send_file, request
from flask_cors import CORS
from imageProcessing import process_image
from word_spotting import word_spotting

app = Flask(__name__)
CORS(app)


# MembersAPI
@app.route("/members")
def members():
    return {"members": ["Alexis", "Tom", "Florian", "Verlaine"]}


@app.route("/getImage")
def getImage():
    path_to_processed_image = process_image(
        "../client/public/wallpaper.jpg")
    return send_file(path_to_processed_image, mimetype='image/jpg')


@app.route('/uploadImage', methods=['POST'])
def uploadImage():
    """
    POST route handler that accepts an image, manipulates it and returns a JSON containing a possibly different image with more fields
    """
    # Read image from request and write to server's file system
    data = request.files['file']
    data.save('save_pic.jpg')

    path_to_processed_image = process_image('save_pic.jpg')
    return send_file(path_to_processed_image, mimetype='image/jpg')


@app.route('/findWordInImage', methods=['POST'])
def findWordInImage():
    """
    POST route handler that accepts an image, manipulates it and returns a JSON containing a possibly different image with more fields
    """

    # Read image from request and write to server's file system
    try:
        # print(data)
        data = request.files['file']
        x = int(request.values.get('x'))
        y = int(request.values.get('y'))
        w = int(request.values.get('w'))
        h = int(request.values.get('h'))
    except request.exceptions.RequestException as e:
        pass

    # print(f'x: {x}, y: {y}, w: {w}, h:{h}')
    data.save('save_pic.jpg')

    best_potential = word_spotting('save_pic.jpg', x, y, w, h);
    return send_file(best_potential, mimetype='image/jpg')


if __name__ == "__main__":
    app.run(debug=True)
