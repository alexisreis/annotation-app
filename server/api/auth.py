from flask import Blueprint, jsonify, make_response, current_app, request, \
    session
from utils.extension import mysql, token_required, getUserId, admin
import jwt

auth = Blueprint('auth', __name__)

# $2a$10$w6pb68tKZnpNiR/U7kURfu7fyP1nITGqlkp4sS4roCK7rWWsDzaVi (admin admin)


@auth.route('/login', methods=['POST'])
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
            key=current_app.config['SECRET_KEY'],
            algorithm="HS256")
        return jsonify({'token': token})
    else:
        return make_response('Password is incorrect', 403, {'WWW-Authenticate':
                                                                'Basic '
                                                                'realm:"Authentification Failed!"'})


@auth.route('/auth')
@token_required
def authenticate():
    return jsonify({"status": 'Verified'})


@auth.route('/createNewUser', methods=['POST'])
def createNewUser():
    name = request.values.get('name')
    mail = request.values.get('mail')
    password = request.values.get('password')

    if not name or not mail or not password:
        return jsonify({'blank': 'Blank name, type, mail or password'})

    cursor = mysql.connection.cursor()

    user = cursor.execute(f'''SELECT user_id FROM users WHERE user_mail='{mail}' ''')
    if user > 0:
        return jsonify({'exists': 'This email has already an account'})

    cursor.execute(f'''
    INSERT INTO users(user_name, user_type, user_mail, user_password) 
    VALUES ('{name}', 'W','{mail}','{password}')''')
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'Successful  insertion'})


@auth.route('/getUsersList')
@admin
def getUsers():
    cursor = mysql.connection.cursor()
    user = cursor.execute('''
        SELECT user_id, user_name, user_mail, user_type 
        FROM Users ''')
    if user > 0:
        userDetails = cursor.fetchall()
        return jsonify(userDetails)

    return jsonify({'no_users': 'what ?'})


@auth.route('/editUserType', methods=['POST'])
@admin
def editUserType():
    user_type = request.values.get('user_type')
    user_id = request.values.get('user_id')
    cursor = mysql.connection.cursor()
    cursor.execute(f'''
        UPDATE users 
        SET user_type = '{user_type}' 
        WHERE user_id = '{user_id}' ''')
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'Successful update'})


@auth.route('/deleteUser', methods=['POST'])
@admin
def deleteUser():
    user_id = request.values.get('user_id')
    cursor = mysql.connection.cursor()
    cursor.execute(f'''
        DELETE FROM users 
        WHERE user_id = '{user_id}' ''')
    mysql.connection.commit()
    cursor.close()
    return jsonify({'success': 'Successful delete'})


