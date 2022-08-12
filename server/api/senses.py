from flask import Blueprint, jsonify, request
from utils.extension import mysql, token_required, getUserId, editor, admin, \
    creator

senses = Blueprint('senses', __name__)


@senses.route("/createSense/<sense>", methods=['POST'])
@creator
def createSenseView(sense):
    if sense not in['view', 'sound', 'smell', 'touch', 'taste']:
        return jsonify({'no_tables': 'table sense_' + sense + ' does not '
                                                              'exists'})
    annotation_id = request.values.get('id')
    user_id, _ = getUserId(request.headers['x-access-tokens'])

    cursor = mysql.connection.cursor()

    if sense == 'sound':
        sound_type = request.values.get('sound_type')
        sound_volume = request.values.get('sound_volume')
        cursor.execute("""
            INSERT INTO sense_sound (annotation_id, sound_type, sound_volume, user_id)
            VALUES (%(annotation_id)s, %(sound_type)s, %(sound_volume)s, %(user_id)s) """,
                       {
                           'annotation_id': annotation_id,
                           'sound_type': sound_type,
                           'sound_volume': sound_volume,
                           'user_id': user_id,
                       })
    else:
        cursor.execute("""
            INSERT INTO %(table)s (annotation_id, user_id)
            VALUES (%(annotation_id)s, %(user_id)s)""",
                       {
                           'table': 'sense_' + sense,
                           'annotation_id': annotation_id,
                           'user_id': user_id,
                       })
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})


@senses.route("/deleteSense/<sense>", methods=['POST'])
@editor
def deleteSenseView(sense):
    if sense not in['view', 'sound', 'smell', 'touch', 'taste']:
        return jsonify({'no_tables': 'table sense_' + sense + ' does not '
                                                              'exists'})

    annotation_id = request.values.get('id')
    cursor = mysql.connection.cursor()
    cursor.execute("""
        DELETE FROM %(table)s 
        WHERE annotation_id = %(annotation_id)s """,
                   {
                       'table': 'sense_' + sense,
                       'annotation_id': annotation_id,
                   })
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})


@senses.route("/updateSense/<sense>", methods=['POST'])
@editor
def updateSenseView(sense):
    if sense not in['view', 'sound', 'smell', 'touch', 'taste']:
        return jsonify({'no_tables': 'table sense_' + sense + ' does not '
                                                              'exists'})
    annotation_id = request.values.get('id')
    editor_id, _ = getUserId(request.headers['x-access-tokens'])

    cursor = mysql.connection.cursor()

    if sense == 'sound':
        sound_type = request.values.get('sound_type')
        sound_volume = request.values.get('sound_volume')

        cursor.execute("""
            UPDATE sense_sound 
            SET editor_id = %(editor_id)s, sound_type= %(sound_type)s, 
                sound_volume= %(sound_volume)s
            WHERE annotation_id = %(annotation_id)s """,
                       {
                           'editor_id': editor_id,
                           'sound_type': sound_type,
                           'sound_volume': sound_volume,
                           'annotation_id': annotation_id,
                       })
    else:
        cursor.execute("""
            UPDATE %(table)s 
            SET editor_id = %(editor_id)s 
            WHERE annotation_id = %(annotation_id)s """,
                       {
                           'table': 'sense_'+sense,
                           'editor_id': editor_id,
                           'annotation_id': annotation_id,
                       })
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})