from flask import Blueprint, jsonify, request
from utils.extension import mysql, token_required, getUserId, edition_type

transcription = Blueprint('transcription', __name__)


@transcription.route("/createTranscription", methods=['POST'])
@token_required
def createTranscription():
    transcription = request.values.get('transcription')
    id = request.values.get('id')

    user_id, _ = getUserId(request.headers['x-access-tokens'])

    cursor = mysql.connection.cursor()
    cursor.execute(f'''
        INSERT INTO transcription (annotation_id, transcription, user_id)
        VALUES ('{id}', '{transcription}', {user_id}) ''')
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})


@transcription.route("/deleteTranscription", methods=['POST'])
@token_required
def deleteTranscription():
    _, user_type = getUserId(request.headers['x-access-tokens'])
    if user_type not in edition_type:
        return jsonify({'failure': 'user has no rights to delete annotation'})

    annoId = request.values.get('id')
    cursor = mysql.connection.cursor()
    cursor.execute(f'''
        DELETE FROM transcription WHERE annotation_id = '{annoId}' ''')
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})


@transcription.route("/updateTranscription", methods=['POST'])
@token_required
def updateAnnotationTranscription():
    editor_id, user_type = getUserId(request.headers['x-access-tokens'])
    if user_type not in edition_type:
        return jsonify({'failure': 'user has no rights to edit'})

    transcription = request.values.get('transcription')
    id = request.values.get('id')

    cursor = mysql.connection.cursor()
    cursor.execute(f'''
        UPDATE transcription 
        SET transcription = '{transcription}', editor_id = {editor_id} 
        WHERE annotation_id = '{id}' ''')

    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})


@transcription.route('/getMostTranscribed/<cote>', methods=['GET'])
@token_required
def getMostTranscribed(cote):
    cursor = mysql.connection.cursor()
    transcriptions = cursor.execute(f'''
        SELECT t1.transcription, count(t2.transcription_id)+1
        FROM images i 
        JOIN annotations a ON i.image_id = a.image_id 
        JOIN transcription t1 ON a.annotation_id = t1.annotation_id
        JOIN transcription t2 ON t1.transcription = t2.transcription
        WHERE i.document_cote = '{cote}'
        AND t1.transcription_id < t2.transcription_id
        GROUP BY t1.transcription_id, t2.transcription_id
        LIMIT 5; ''')

    if transcriptions > 0:
        transcriptions_infos = cursor.fetchall()
        cursor.close()
        return jsonify(transcriptions_infos)
    cursor.close()
    return jsonify({'storage': 'Not most used transcriptions'})