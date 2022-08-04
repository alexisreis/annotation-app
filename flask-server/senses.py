from flask import Blueprint, jsonify, request
from extension import mysql, token_required, getUserId, edition_type

senses = Blueprint('senses', __name__)


@senses.route("/createSense/<sense>", methods=['POST'])
@token_required
def createSenseView(sense):
    if sense not in['view', 'sound', 'smell', 'touch', 'taste']:
        return jsonify({'no_tables': 'table sense_' + sense + ' does not '
                                                              'exists'})
    id = request.values.get('id')
    user_id, _ = getUserId(request.headers['x-access-tokens'])

    cursor = mysql.connection.cursor()

    if sense == 'sound':
        sound_type = request.values.get('sound_type')
        print(sound_type)
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


@senses.route("/deleteSense/<sense>", methods=['POST'])
@token_required
def deleteSenseView(sense):
    if sense not in['view', 'sound', 'smell', 'touch', 'taste']:
        return jsonify({'no_tables': 'table sense_' + sense + ' does not '
                                                              'exists'})

    _, user_type = getUserId(request.headers['x-access-tokens'])
    if user_type not in edition_type:
        return jsonify({'failure': 'user has no rights to delete annotation'})

    annoId = request.values.get('id')
    cursor = mysql.connection.cursor()
    cursor.execute(f'''
        DELETE FROM sense_{sense} WHERE annotation_id = '{annoId}' ''')
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})


@senses.route("/updateSense/<sense>", methods=['POST'])
@token_required
def updateSenseView(sense):
    if sense not in['view', 'sound', 'smell', 'touch', 'taste']:
        return jsonify({'no_tables': 'table sense_' + sense + ' does not '
                                                              'exists'})
    id = request.values.get('id')
    editor_id, user_type = getUserId(request.headers['x-access-tokens'])
    if user_type not in edition_type:
        return jsonify({'failure': 'user has no rights to edit'})

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
        # TODO : update les autres sens quand on les aura définis
        cursor.execute(f'''
            UPDATE sense_{sense} 
            SET editor_id = {editor_id} /*, ...*/
            WHERE annotation_id = '{id}' ''')
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'success'})