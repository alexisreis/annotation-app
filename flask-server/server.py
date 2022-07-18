# cd flask-server
# .\venv\Scripts\activate
# python server.py

# pip install flask_mysqldb

from flask import Flask, send_file, request, jsonify, render_template
from flask_mysqldb import MySQL
from flask_cors import CORS
from imageProcessing import process_image
from word_spotting import word_spotting

app = Flask(__name__)

app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'test_flask'
mysql = MySQL(app)
CORS(app)


@app.route("/members")
def members():
    return {"members": ["Alexis", "Tom", "Florian", "Verlaine"]}


@app.route("/adduser/<user>")
def adduser(user):
    #Creating a connection cursor
    cursor = mysql.connection.cursor()

    #Executing SQL Statements
    cursor.execute(f''' INSERT INTO users (username) VALUES('{user}')''')

    #Saving the Actions performed on the DB
    mysql.connection.commit()

    #Closing the cursor
    cursor.close()
    return user


@app.route("/getusers")
def getusers():
    cursor = mysql.connection.cursor()
    users = cursor.execute('''SELECT username FROM users''')

    if users > 0:
        userDetails = cursor.fetchall()
        return jsonify(userDetails)
        # return render_template('users.html', userDetails=userDetails)
    return "No data in users"

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


if __name__ == "__main__":
    app.run(debug=True)
