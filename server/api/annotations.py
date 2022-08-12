from flask import Blueprint, jsonify, request
from utils.extension import mysql, token_required, getUserId, creator, editor
from json import loads

annotations = Blueprint('annotations', __name__)


@annotations.route("/getImageAnnotations/<id>")
@token_required
def getImageAnnotations(id):
    returnAnno = []
    cursor = mysql.connection.cursor()
    image_annotations = \
        cursor.execute("""  SELECT annotation_id, zone_type, zone_coord 
                            FROM annotations a
                            WHERE a.image_id = %(id)s """,
                       {'id': id})
    if image_annotations > 0:
        image_annotations = cursor.fetchall()
        for annotation in image_annotations:
            body = []
            # TRANSCRIPTION
            transcription_body = {}
            transcription = \
                cursor.execute("""  SELECT transcription, user_id, editor_id
                                    FROM transcription t 
                                    WHERE t.annotation_id = %(annotation_id)s; """,
                               {'annotation_id': annotation[0]})
            if transcription > 0:
                transcription = cursor.fetchall()
                transcription_body = {"value": transcription[0][0], "purpose":
                    "transcription"}
            # SENSE
            sense_body = {"value": {}, "purpose": "sense"}

            # SOUND
            sound = \
                cursor.execute("""  
                    SELECT sound_type, sound_volume, 
                                user_id, editor_id
                    FROM sense_sound s 
                    WHERE s.annotation_id = %(annotation_id)s; """,
                               {'annotation_id': annotation[0]})
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
            view = \
                cursor.execute(""" 
                    SELECT user_id, editor_id
                    FROM sense_view s 
                    WHERE s.annotation_id = %(annotation_id)s; """,
                               {'annotation_id': annotation[0]})
            if view > 0:
                view = cursor.fetchall()
                sense_body.get("value").update(
                    {"view":
                         {"user_id": view[0][0],
                          "editor_id": view[0][1]
                          }
                     })

            # TASTE
            taste = \
                cursor.execute(""" 
                    SELECT user_id, editor_id
                    FROM sense_taste s 
                    WHERE s.annotation_id = %(annotation_id)s; """,
                               {'annotation_id': annotation[0]})
            if taste > 0:
                taste = cursor.fetchall()
                sense_body.get("value").update(
                    {"taste":
                         {"user_id": taste[0][0],
                          "editor_id": taste[0][1]
                          }
                     })

            # SMELL
            smell = \
                cursor.execute(""" 
                    SELECT user_id, editor_id
                    FROM sense_smell s 
                    WHERE s.annotation_id = %(annotation_id)s; """,
                               {'annotation_id': annotation[0]})
            if smell > 0:
                smell = cursor.fetchall()
                sense_body.get("value").update(
                    {"smell":
                         {"user_id": smell[0][0],
                          "editor_id": smell[0][1]
                          }
                     })

            # TOUCH
            touch = \
                cursor.execute(""" 
                    SELECT user_id, editor_id
                    FROM sense_touch s 
                    WHERE s.annotation_id = %(annotation_id)s; """,
                               {'annotation_id': annotation[0]})
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


@annotations.route("/createAnnotation/<imageId>", methods=['POST'])
@creator
def createAnnotation(imageId):
    body = loads(request.values.get('body'))
    zone_type = request.values.get('zone_type')
    zone_coord = request.values.get('zone_coord')
    id = request.values.get('id')

    # Find user id with token
    user_id, _ = getUserId(request.headers['x-access-tokens'])

    cursor = mysql.connection.cursor()
    cursor.execute("""
        INSERT INTO annotations (annotation_id, image_id, zone_type, zone_coord)
        VALUES (%(id)s, %(imageId)s, %(zone_type)s, %(zone_coord)s) """,
                   {'id': id,
                    'imageId': imageId,
                    'zone_type': zone_type,
                    'zone_coord': zone_coord})

    for object in body:
        if object.get('purpose') == 'sense':
            sense_body = object.get('value')

            if sense_body.get('sound'):
                sound_type = str(sense_body.get('sound').get('type')).replace(
                    '\'', '"')
                print(sound_type)
                sound_volume = sense_body.get('sound').get('volume')
                cursor.execute("""
                    INSERT INTO sense_sound (annotation_id, sound_type, sound_volume, user_id)
                    VALUES (%(id)s, %(sound_type)s, %(sound_volume)s, %(user_id)s)""",
                               {
                                   'id': id,
                                   'sound_type': sound_type,
                                   'sound_volume': sound_volume,
                                   'user_id': user_id
                               })

            if sense_body.get('view'):
                cursor.execute("""
                    INSERT INTO sense_view(annotation_id, user_id)
                    VALUES (%(id)s, %(user_id)s)""",
                               {
                                   'id': id,
                                   'user_id': user_id
                               })

            if sense_body.get('touch'):
                cursor.execute("""
                    INSERT INTO sense_touch(annotation_id, user_id)
                    VALUES (%(id)s, %(user_id)s)""",
                               {
                                   'id': id,
                                   'user_id': user_id
                               })

            if sense_body.get('taste'):
                cursor.execute("""
                    INSERT INTO sense_taste(annotation_id, user_id)
                    VALUES (%(id)s, %(user_id)s)""",
                               {
                                   'id': id,
                                   'user_id': user_id
                               })

            if sense_body.get('smell'):
                cursor.execute("""
                    INSERT INTO sense_smell(annotation_id, user_id)
                    VALUES (%(id)s, %(user_id)s)""",
                               {
                                   'id': id,
                                   'user_id': user_id
                               })

        elif object.get('purpose') == 'transcription':
            cursor.execute("""
                INSERT INTO transcription(annotation_id, transcription, 
                user_id)
                VALUES (%(id)s, %(transcription)s, %(user_id)s)""",
                           {
                               'id': id,
                               'transcription': object.get('value'),
                               'user_id': user_id
                           })

    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})


@annotations.route("/deleteAnnotation", methods=['POST'])
@editor
def deleteAnnotation():
    annoId = request.values.get('id')
    cursor = mysql.connection.cursor()
    cursor.execute("""
        DELETE FROM annotations 
        WHERE annotation_id = %(annotation_id)s """,
                   {
                        'annotation_id': annoId,
                   })
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})


@annotations.route("/updateAnnotationCoord", methods=['POST'])
@editor
def updateAnnotationCoord():
    zone_coord = request.values.get('zone_coord')
    annoId = request.values.get('id')

    cursor = mysql.connection.cursor()
    cursor.execute("""
        UPDATE annotations 
        SET zone_coord = %(zone_coord)s 
        WHERE annotation_id = %(annotation_id)s """,
                   {
                       'zone_coord': zone_coord,
                       'annotation_id': annoId,
                   })
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})
