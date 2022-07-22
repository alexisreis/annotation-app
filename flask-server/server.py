from flask import Flask, send_file, request, jsonify, render_template, \
    session, make_response
import jwt
# from datetime import datetime, timedelta
from functools import wraps
from flask_mysqldb import MySQL
from flask_cors import CORS
from imageProcessing import process_image
from word_spotting import word_spotting

app = Flask(__name__)

app.config['SECRET_KEY'] = "holaquetal"

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'test_flask'
mysql = MySQL(app)
CORS(app)


def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'x-access-tokens' in request.headers:
            token = request.headers['x-access-tokens']

        if not token:
            return jsonify({'message': 'a valid token is missing'})
        try:
            data = jwt.decode(token, key=app.config['SECRET_KEY'], algorithms=[
                "HS256"])
        except:
            return jsonify({'message': 'token is invalid'})

        # Returns to the function that needs the authentication
        return f(*args, **kwargs)
    return decorator


@app.route('/login', methods=['POST'])
def login():
    # TODO : try / except
    mail = request.values.get('mail')
    password = request.values.get('password')

    cursor = mysql.connection.cursor()
    user = cursor.execute(f'''SELECT * FROM Users WHERE user_mail='{mail}'  ''')
    if user > 0:
        userDetails = cursor.fetchall()
        cursor.close()
        user_id = userDetails[0][0]
        user_name = userDetails[0][1]
        user_type = userDetails[0][2]
        user_password = userDetails[0][4]
    else:
        cursor.close()
        return make_response('User not found', 403, {'WWW-Authenticate':
                                                           'Basic '
                                                           'realm:"Authentification Failed!"'})

    if password == user_password:
        session['logged_in'] = True
        token = jwt.encode({
            'user_id': user_id,
            'user_name': user_name,
            'user_mail': mail,
            'user_type': user_type,
            # 'expiration': str(datetime.utcnow() + timedelta(seconds=30))
            },
            key=app.config['SECRET_KEY'],
            algorithm="HS256")
        return jsonify({'token': token})
    else:
        return make_response('Password is incorrect', 403, {'WWW-Authenticate':
                                                           'Basic '
                                                           'realm:"Authentification Failed!"'})


@app.route('/auth')
@token_required
def auth():
    return jsonify({"status": 'Verified'})


@app.route('/addDocument', methods=['POST'])
@token_required
def addDocument():
    nom = request.values.get('nom')
    date = request.values.get('date')

    cursor = mysql.connection.cursor()
    cursor.execute(f'''INSERT INTO documents(document_name, document_date)
    VALUES ('{nom}', {date}) 
    ''')
    mysql.connection.commit()
    cursor.close()
    return 'Successful insertion'


@app.route('/getDocuments', methods=['GET'])
@token_required
def getDocuments():
    cursor = mysql.connection.cursor()
    doc = cursor.execute(f'''SELECT * FROM documents''')
    if doc > 0:
        documentsDetails = cursor.fetchall();
        cursor.close()
        return jsonify(documentsDetails)
    cursor.close()
    return 'No documents stored'


@app.route("/getImageAnnotations/<id>")
def getImageAnnotations(id):
    returnAnno = []
    cursor = mysql.connection.cursor()
    image_annotations = cursor.execute(f''' SELECT annotation_id, 
                                                    zone_type, 
                                                    zone_coord 
                                            FROM annotations a
                                            WHERE a.image_id = '{id}' ''')
    if image_annotations > 0:
        image_annotations = cursor.fetchall()
        # print(image_annotations)
        for annotation in image_annotations:
            body = []
            # TRANSCRIPTION
            transcription_body = {}
            transcription = cursor.execute(f''' SELECT transcription
                                                user_id, editor_id
                                        FROM transcription t 
                                        WHERE t.annotation_id = 
                                        '{annotation[0]}'; ''')
            if transcription > 0:
                transcription = cursor.fetchall()
                transcription_body = {"value": transcription[0][0], "purpose":
                    "transcription"}
            # SENSE
            sense_body = {"value": {}, "purpose": "sense"}

            # SOUND
            sound = cursor.execute(f''' SELECT sound_type, sound_volume, 
                                                user_id, editor_id
                                        FROM sense_sound s 
                                        WHERE s.annotation_id = '{annotation[0]}'; ''')
            if sound > 0:
                sound = cursor.fetchall()
                sense_body.get("value").update(
                    {"Son":
                         {"type": sound[0][0],
                          "volume": sound[0][1],
                          "user_id": sound[0][2],
                          "editor_id": sound[0][3]
                          }
                     })

            # VIEW
            view = cursor.execute(f''' SELECT user_id, editor_id
                                        FROM sense_view s 
                                        WHERE s.annotation_id = '{annotation[0]}'; ''')
            if view > 0:
                view = cursor.fetchall()
                sense_body.get("value").update(
                    {"Vue":
                         {"user_id": view[0][0],
                          "editor_id": view[0][1]
                          }
                     })

            # TASTE
            taste = cursor.execute(f''' SELECT user_id, editor_id
                                        FROM sense_taste s 
                                        WHERE s.annotation_id = '{annotation[0]}'; ''')
            if taste > 0:
                taste = cursor.fetchall()
                sense_body.get("value").update(
                    {"Gout":
                         {"user_id": taste[0][0],
                          "editor_id": taste[0][1]
                          }
                     })

            # SMELL
            smell = cursor.execute(f''' SELECT user_id, editor_id
                                        FROM sense_smell s 
                                        WHERE s.annotation_id = '{annotation[0]}'; ''')
            if smell > 0:
                smell = cursor.fetchall()
                sense_body.get("value").update(
                    {"Odeur":
                         {"user_id": smell[0][0],
                          "editor_id": smell[0][1]
                          }
                     })

            # TOUCH
            touch = cursor.execute(f''' SELECT user_id, editor_id
                                        FROM sense_touch s 
                                        WHERE s.annotation_id = '{annotation[0]}'; ''')
            if touch > 0:
                touch = cursor.fetchall()
                sense_body.get("value").update(
                    {"Toucher":
                         {"user_id": touch[0][0],
                          "editor_id": touch[0][1]
                          }
                     })

            # Includes the bodies if they have a value
            if sense_body.get("value"):
                body.append(sense_body)

            if transcription_body.get("value"):
                body.append(transcription_body)

            annoObject = {
                "type": "Annotation",
                "body": body,
                "target": {
                    "source": id + '.jpg',
                },
                "@context": "http://www.w3.org/ns/anno.jsonld",
                "id": f"{annotation[0]}"
            }

            # Shape of the annotation (rectangle or polygon)
            if not annotation[1]:
                annoObject.get("target").update(
                    {"selector": {
                        "type": "FragmentSelector",
                        "conformsTo": "http://www.w3.org/TR/media-frags/",
                        "value": f"xywh=pixel:{annotation[2]}"
                    }}
                )
            else:
                annoObject.get("target").update(
                    {"selector": {
                        "type": "SvgSelector",
                        "value": f"<svg><polygon points=\"{annotation[2]}\"/></svg>"
                    }}
                )

            returnAnno.append(annoObject)
    cursor.close()
    return jsonify(returnAnno)


@app.route("/adduser/<user>")
def adduser(user):
    # Creating a connection cursor
    cursor = mysql.connection.cursor()

    # Executing SQL Statements
    cursor.execute(f''' INSERT INTO users (username) VALUES('{user}')''')

    # Saving the Actions performed on the DB
    mysql.connection.commit()

    # Closing the cursor
    cursor.close()
    return user


@app.route("/getusers")
def getusers():
    cursor = mysql.connection.cursor()
    users = cursor.execute('''SELECT username FROM users''')

    if users > 0:
        userDetails = cursor.fetchall()
        cursor.close()
        return jsonify(userDetails)
        # return render_template('users.html', userDetails=userDetails)
    cursor.close()
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