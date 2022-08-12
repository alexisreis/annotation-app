from flask import Blueprint, jsonify, request, make_response
from utils.extension import mysql, token_required, getUserId, creator, editor

transcription = Blueprint('transcription', __name__)


@transcription.route("/createTranscription", methods=['POST'])
@creator
def createTranscription():
    transcription = request.values.get('transcription')
    id = request.values.get('id')

    user_id, _ = getUserId(request.headers['x-access-tokens'])

    cursor = mysql.connection.cursor()
    cursor.execute("""
        INSERT INTO transcription (annotation_id, transcription, user_id)
        VALUES (%(id)s, %(transcription)s, %(user_id)s) """,
                   {
                       'id': id,
                       'transcription': transcription,
                       'user_id': user_id,
                   })
    mysql.connection.commit()
    cursor.close()
    return make_response(jsonify({'success': 'success'}), 201)


@transcription.route("/deleteTranscription", methods=['POST'])
@editor
def deleteTranscription():
    annoId = request.values.get('id')
    cursor = mysql.connection.cursor()
    cursor.execute("""
        DELETE FROM transcription 
        WHERE annotation_id = %(annotation_id)s """,
                   {
                       'annotation_id': annoId,
                   })
    mysql.connection.commit()
    cursor.close()
    return make_response(jsonify({'success': 'success'}), 200)


@transcription.route("/updateTranscription", methods=['POST'])
@editor
def updateAnnotationTranscription():
    editor_id, _ = getUserId(request.headers['x-access-tokens'])

    transcription = request.values.get('transcription')
    annotation_id = request.values.get('id')

    cursor = mysql.connection.cursor()
    cursor.execute("""
        UPDATE transcription 
        SET transcription = %(transcription)s, editor_id = %(editor_id)s
        WHERE annotation_id = %(annotation_id)s """,
                   {
                       'transcription': transcription,
                       'editor_id': editor_id,
                       'annotation_id': annotation_id
                   })

    mysql.connection.commit()
    cursor.close()
    return make_response(jsonify({'success': 'success'}), 200)