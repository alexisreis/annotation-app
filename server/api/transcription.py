from flask import Blueprint, jsonify, request
from utils.extension import mysql, token_required, getUserId, creator, editor

transcription = Blueprint('transcription', __name__)


@transcription.route("/createTranscription", methods=['POST'])
@creator
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
@editor
def deleteTranscription():
    annoId = request.values.get('id')
    cursor = mysql.connection.cursor()
    cursor.execute(f'''
        DELETE FROM transcription WHERE annotation_id = '{annoId}' ''')
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})


@transcription.route("/updateTranscription", methods=['POST'])
@editor
def updateAnnotationTranscription():
    editor_id, _ = getUserId(request.headers['x-access-tokens'])

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