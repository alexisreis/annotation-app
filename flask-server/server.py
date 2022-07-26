from flask import Flask, send_file, request, jsonify, render_template, \
    session, make_response
import jwt
import json
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
            return jsonify({'missing': 'a valid token is missing'})
        try:
            data = jwt.decode(token, key=app.config['SECRET_KEY'], algorithms=[
                "HS256"])
        except:
            return jsonify({'invalid': 'token is invalid'})

        # Returns to the function that needs the authentication
        return f(*args, **kwargs)
    return decorator


def getUserId(token):
    data = jwt.decode(token, key=app.config['SECRET_KEY'], algorithms=[
        "HS256"])
    return data['user_id']


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
    cote = request.values.get('cote')
    nom = request.values.get('nom')
    date = request.values.get('date')

    cursor = mysql.connection.cursor()
    cursor.execute(f'''INSERT INTO documents(document_cote, document_name, 
    document_date)
    VALUES ('{cote}','{nom}', {date}) 
    ''')
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'Successful insertion'})


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
    return jsonify({'storage': 'No documents stored'})


@app.route('/getImagesFromDocument/<cote>', methods=['GET'])
@token_required
def getImagesFromDocument(cote):
    cursor = mysql.connection.cursor()
    images = cursor.execute(f'''SELECT image_id FROM Images WHERE 
    document_cote = '{cote}' ''')
    if images > 0:
        imagesDetails = cursor.fetchall();
        cursor.close()
        return jsonify(imagesDetails)
    cursor.close()
    return jsonify({'storage': 'No images stored'})


@app.route('/addImageToDocument/<cote>', methods=['POST'])
@token_required
def addImageToDocument(cote):
    image_id = request.values.get('image_id')
    cursor = mysql.connection.cursor()
    cursor.execute(f'''INSERT INTO images (image_id, document_cote) VALUES ('
    {image_id}', '{cote}')''')
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})



@app.route("/getImageAnnotations/<id>")
@token_required
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
                    {"sound":
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
                    {"view":
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
                    {"taste":
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
                    {"smell":
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
                    {"touch":
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


@app.route("/createAnnotation/<imageId>", methods=['POST'])
@token_required
def createAnnotation(imageId):
    body = json.loads(request.values.get('body'))
    zone_type = request.values.get('zone_type')
    zone_coord = request.values.get('zone_coord')
    id = request.values.get('id')

    # TODO : trouver l'id de l'utilsateur qui crée en déchiffrant token
    user_id = getUserId(request.headers['x-access-tokens'])

    cursor = mysql.connection.cursor()
    cursor.execute(f''' 
        INSERT INTO annotations (annotation_id, image_id, zone_type, zone_coord)
        VALUES ('{id}', '{imageId}', '{zone_type}', '{zone_coord}') ''')

    for object in body:
        if object.get('purpose') == 'sense':
            sense_body = object.get('value')

            if sense_body.get('sound'):
                # TODO : faire les multi type
                print(sense_body.get('sound').get('type'))
                print(sense_body.get('sound').get('volume'))

            if sense_body.get('view'):
                cursor.execute(f'''
                    INSERT INTO sense_view(annotation_id, user_id)
                    VALUES ('{id}', {user_id})''')

            if sense_body.get('touch'):
                cursor.execute(f'''
                    INSERT INTO sense_touch(annotation_id, user_id)
                    VALUES ('{id}', {user_id})''')

            if sense_body.get('taste'):
                cursor.execute(f'''
                    INSERT INTO sense_taste(annotation_id, user_id)
                    VALUES ('{id}', {user_id})''')

            if sense_body.get('smell'):
                cursor.execute(f'''
                    INSERT INTO sense_smell(annotation_id, user_id)
                    VALUES ('{id}', {user_id})''')

        elif object.get('purpose') == 'transcription':
            cursor.execute(f'''
                INSERT INTO transcription(annotation_id, transcription, 
                user_id)
                VALUES ('{id}', '{object.get('value')}', '{1}') ''')

    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})


@app.route("/deleteAnnotation", methods=['POST'])
@token_required
def deleteAnnotation():
    annoId = request.values.get('id')
    cursor = mysql.connection.cursor()
    cursor.execute(f'''
        DELETE FROM annotations WHERE annotation_id = '{annoId}' ''')
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})


@app.route("/updateAnnotationCoord", methods=['POST'])
@token_required
def updateAnnotationCoord():
    zone_coord = request.values.get('zone_coord')
    id = request.values.get('id')

    cursor = mysql.connection.cursor()
    cursor.execute(f'''
        UPDATE annotations 
        SET zone_coord = '{zone_coord}' 
        WHERE annotation_id = '{id}' ''')
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})


@app.route("/createTranscription", methods=['POST'])
@token_required
def createTranscription():
    transcription = request.values.get('transcription')
    id = request.values.get('id')

    user_id = getUserId(request.headers['x-access-tokens'])

    cursor = mysql.connection.cursor()
    cursor.execute(f'''
        INSERT INTO transcription (annotation_id, transcription, user_id)
        VALUES ('{id}', '{transcription}', {user_id}) ''')
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})


@app.route("/deleteTranscription", methods=['POST'])
@token_required
def deleteTranscription():
    annoId = request.values.get('id')
    cursor = mysql.connection.cursor()
    cursor.execute(f'''
        DELETE FROM transcription WHERE annotation_id = '{annoId}' ''')
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})


@app.route("/updateTranscription", methods=['POST'])
@token_required
def updateAnnotationTranscription():
    transcription = request.values.get('transcription')
    id = request.values.get('id')

    editor_id = getUserId(request.headers['x-access-tokens'])

    cursor = mysql.connection.cursor()
    cursor.execute(f'''
        UPDATE transcription 
        SET transcription = '{transcription}', editor_id = {editor_id} 
        WHERE annotation_id = '{id}' ''')
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})


@app.route("/createSense/<sense>", methods=['POST'])
@token_required
def createSenseView(sense):
    if sense not in['view', 'sound', 'smell', 'touch', 'taste']:
        return jsonify({'no_tables': 'table sense_' + sense + ' does not '
                                                              'exists'})
    id = request.values.get('id')
    user_id = getUserId(request.headers['x-access-tokens'])

    cursor = mysql.connection.cursor()

    if sense == 'sound':
        sound_type = request.values.get('sound_type')
        sound_volume = request.values.get('sound_volume')
        cursor.execute(f'''
            INSERT INTO sense_sound (annotation_id, sound_type, sound_volume, user_id)
            VALUES ('{id}', '{sound_type}', '{sound_volume}', {user_id}) ''')
    else:
        cursor.execute(f'''
            INSERT INTO sense_{sense} (annotation_id, user_id)
            VALUES ('{id}', {user_id}) ''')
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})


@app.route("/deleteSense/<sense>", methods=['POST'])
@token_required
def deleteSenseView(sense):
    if sense not in['view', 'sound', 'smell', 'touch', 'taste']:
        return jsonify({'no_tables': 'table sense_' + sense + ' does not '
                                                              'exists'})

    annoId = request.values.get('id')
    cursor = mysql.connection.cursor()
    cursor.execute(f'''
        DELETE FROM sense_{sense} WHERE annotation_id = '{annoId}' ''')
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})


@app.route("/updateSense/<sense>", methods=['POST'])
@token_required
def updateSenseView(sense):
    if sense not in['view', 'sound', 'smell', 'touch', 'taste']:
        return jsonify({'no_tables': 'table sense_' + sense + ' does not '
                                                              'exists'})
    id = request.values.get('id')
    editor_id = getUserId(request.headers['x-access-tokens'])

    cursor = mysql.connection.cursor()

    if sense == 'sound':
        sound_type = request.values.get('sound_type')
        sound_volume = request.values.get('sound_volume')

        cursor.execute(f'''
            UPDATE sense_sound 
            SET editor_id = {editor_id}, sound_type='{sound_type}', 
            sound_volume='{sound_volume}'
            WHERE annotation_id = '{id}' ''')
    else:
        cursor.execute(f'''
            UPDATE sense_{sense} 
            SET editor_id = {editor_id} /*, ...*/
            WHERE annotation_id = '{id}' ''')
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})

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