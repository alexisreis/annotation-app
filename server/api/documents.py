from flask import Blueprint, jsonify, request
from utils.extension import mysql, token_required, admin


documents = Blueprint('documents', __name__)


@documents.route('/addDocument', methods=['POST'])
@admin
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


@documents.route('/getDocuments', methods=['GET'])
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


@documents.route('/getDocument/<cote>', methods=['GET'])
@token_required
def getImagesFromDocument(cote):
    response = {'images': {}, 'stats': {}}
    cursor = mysql.connection.cursor()

    images = cursor.execute(f'''
        SELECT i.image_id, count(s.sound_id), count(v.view_id), 
        count(sm.smell_id), count(t.touch_id), count(ta.taste_id)
        FROM images i LEFT JOIN annotations a on i.image_id = a.image_id 
        LEFT JOIN sense_view v ON a.annotation_id = v.annotation_id
        LEFT JOIN sense_sound s ON a.annotation_id = s.annotation_id
        LEFT JOIN sense_smell sm ON a.annotation_id = sm.annotation_id
        LEFT JOIN sense_touch t ON a.annotation_id = t.annotation_id
        LEFT JOIN sense_taste ta ON a.annotation_id = ta.annotation_id
        WHERE i.document_cote = '{cote}'
        GROUP BY i.image_id; ''')

    if images > 0:
        imagesDetails = cursor.fetchall();
        response.update({'images': imagesDetails});

        stats = cursor.execute(f'''
        SELECT count(s.sound_id), count(v.view_id), 
        count(sm.smell_id), count(t.touch_id), count(ta.taste_id)
        FROM (SELECT im.image_id FROM images im WHERE im.document_cote = '{cote}') i
        LEFT JOIN annotations a on i.image_id = a.image_id 
        LEFT JOIN sense_view v ON a.annotation_id = v.annotation_id
        LEFT JOIN sense_sound s ON a.annotation_id = s.annotation_id
        LEFT JOIN sense_smell sm ON a.annotation_id = sm.annotation_id
        LEFT JOIN sense_touch t ON a.annotation_id = t.annotation_id
        LEFT JOIN sense_taste ta ON a.annotation_id = ta.annotation_id; ''')

        if stats > 0:
            statsDetails = cursor.fetchall()
            response.update({'stats': statsDetails[0]});

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
            transcriptionsDetails = cursor.fetchall()
            response.update({'transcriptions': transcriptionsDetails})

        cursor.close()
        return jsonify(response)
    cursor.close()
    return jsonify({'storage': 'No images stored'})


@documents.route('/addImageToDocument/<cote>', methods=['POST'])
@admin
def addImageToDocument(cote):
    image_id = request.values.get('image_id')
    cursor = mysql.connection.cursor()
    cursor.execute(f'''INSERT INTO images (image_id, document_cote) VALUES ('{image_id}', '{cote}')''')
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})