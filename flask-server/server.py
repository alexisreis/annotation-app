# cd flask-server
# .\venv\Scripts\activate
# python server.py

from flask import Flask, send_file, request
from flask_cors import CORS
from imageProcessing import process_image

app = Flask(__name__)
CORS(app)


# MembersAPI
@app.route("/members")
def members():
    return {"members": ["Alexis", "Tom", "Florian", "Verlaine"]}


@app.route("/getImage")
def getImage():
    path_to_processed_image = process_image("wallpaper.jpg")
    return send_file(path_to_processed_image, mimetype='image/jpg')


@app.route('/uploadImage', methods=['POST'])
def uploadImage():
    """
    POST route handler that accepts an image, manipulates it and returns a JSON containing a possibly different image with more fields
    """
    # Read image from request and write to server's file system
    data = request.files['file']
    print(data)
    data.save('save_pic.jpg')

    path_to_processed_image = process_image('save_pic.jpg')
    return send_file(path_to_processed_image, mimetype='image/jpg')


if __name__ == "__main__":
    app.run(debug=True)
