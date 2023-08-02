from flask import Blueprint, jsonify, request, make_response
from utils.extension import mysql, token_required, admin

documents = Blueprint('documents', __name__)


@documents.route('/addDocument', methods=['POST'])
@admin
def addDocument():
    cote = request.values.get('cote')
    nom = request.values.get('nom')
    date = request.values.get('date')

    cursor = mysql.connection.cursor()
    cursor.execute("""
        INSERT INTO documents(document_cote, document_name, document_date) 
        VALUES (%(cote)s,%(nom)s, %(date)s)""",
                   {
                       'cote': cote,
                       'nom': nom,
                       'date': date,
                   })
    mysql.connection.commit()
    cursor.close()
    return make_response(jsonify({'success': 'Successful insertion'}), 201)


@documents.route('/getDocuments', methods=['GET'])
@token_required
def getDocuments():
    cursor = mysql.connection.cursor()
    doc = cursor.execute("SELECT * FROM documents")
    if doc > 0:
        documentsDetails = cursor.fetchall();
        cursor.close()
        return make_response(jsonify(documentsDetails), 200)
    cursor.close()
    return make_response(jsonify({'storage': 'No documents stored'}), 200)


@documents.route('/getDocument/<cote>', methods=['GET'])
@token_required
def getImagesFromDocument(cote):
    response = {'images': {}, 'stats': {}}
    cursor = mysql.connection.cursor()

    images = cursor.execute("""
        SELECT i.image_id, count(s.sound_id), count(v.view_id), 
        count(sm.smell_id), count(t.touch_id), count(ta.taste_id)
        FROM (SELECT im.image_id FROM images im WHERE im.document_cote = %(cote)s) i
        LEFT JOIN annotations a on i.image_id = a.image_id 
        LEFT JOIN sense_view v ON a.annotation_id = v.annotation_id
        LEFT JOIN sense_sound s ON a.annotation_id = s.annotation_id
        LEFT JOIN sense_smell sm ON a.annotation_id = sm.annotation_id
        LEFT JOIN sense_touch t ON a.annotation_id = t.annotation_id
        LEFT JOIN sense_taste ta ON a.annotation_id = ta.annotation_id
        GROUP BY i.image_id; """,
                            {
                                'cote': cote
                            })

    if images > 0:
        imagesDetails = cursor.fetchall();
        response.update({'images': imagesDetails});

        stats = cursor.execute("""
        SELECT count(s.sound_id), count(v.view_id), 
        count(sm.smell_id), count(t.touch_id), count(ta.taste_id)
        FROM (SELECT im.image_id FROM images im WHERE im.document_cote = %(cote)s) i
        LEFT JOIN annotations a on i.image_id = a.image_id 
        LEFT JOIN sense_view v ON a.annotation_id = v.annotation_id
        LEFT JOIN sense_sound s ON a.annotation_id = s.annotation_id
        LEFT JOIN sense_smell sm ON a.annotation_id = sm.annotation_id
        LEFT JOIN sense_touch t ON a.annotation_id = t.annotation_id
        LEFT JOIN sense_taste ta ON a.annotation_id = ta.annotation_id; """,
                               {
                                   'cote': cote
                               })

        if stats > 0:
            statsDetails = cursor.fetchall()
            response.update({'stats': statsDetails[0]});


        # transcriptions = cursor.execute("""
        #     SELECT t1.transcription, count(t2.transcription_id)+1
        #     FROM (SELECT im.image_id FROM images im WHERE im.document_cote = %(cote)s) i
        #     JOIN annotations a ON i.image_id = a.image_id
        #     JOIN transcription t1 ON a.annotation_id = t1.annotation_id
        #     JOIN transcription t2 ON t1.transcription = t2.transcription
        #     AND t1.transcription_id < t2.transcription_id
        #     GROUP BY t1.transcription_id
        #     LIMIT 5; """,
        #                                 {'cote': cote})

        transcriptions = cursor.execute("""
            SELECT t1, count(*)
            FROM (
                SELECT t1.transcription as t1, t2.transcription as t2
                FROM (SELECT im.image_id FROM images im WHERE im.document_cote = %(cote)s) i
                JOIN annotations a ON i.image_id = a.image_id 
                JOIN transcription t1 ON a.annotation_id = t1.annotation_id
                JOIN transcription t2 ON t1.transcription_id = t2.transcription_id
                WHERE t1.transcription = t2.transcription
            ) x
            GROUP BY t1, t2
            HAVING count(*) > 1
            ORDER BY 2 desc
            LIMIT 5; """,
                                        {'cote': cote})

        if transcriptions > 0:
            transcriptionsDetails = cursor.fetchall()
            response.update({'transcriptions': transcriptionsDetails})

        cursor.close()
        return make_response(jsonify(response), 200)
    cursor.close()
    return make_response(jsonify({'storage': 'No images stored'}), 200)


@documents.route('/addImageToDocument/<cote>', methods=['POST'])
@admin
def addImageToDocument(cote):
    image_id = request.values.get('image_id')
    cursor = mysql.connection.cursor()
    cursor.execute("""
        INSERT INTO images (image_id, document_cote) 
        VALUES (%(image_id)s, %(cote)s)""",
                   {'image_id': image_id, 'cote': cote})
    mysql.connection.commit()
    cursor.close()
    return make_response(jsonify({'success': 'success'}), 201)
