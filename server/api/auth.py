from flask import Blueprint, jsonify, make_response, current_app, request, \
    session
from utils.extension import mysql, token_required, getUserId
import jwt

auth = Blueprint('auth', __name__)


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


@auth.route('/addUser', methods=['POST'])
@token_required
def addUser():
    _, user_type = getUserId(request.headers['x-access-tokens'])
    if user_type != 'A':
        return jsonify({'failure': 'user is not admin and cannot add users'})

    name = request.values.get('name')
    type = request.values.get('type')
    mail = request.values.get('mail')
    password = request.values.get('password')

    if name and type and mail and password:
        cursor = mysql.connection.cursor()
        cursor.execute(f'''
        INSERT INTO users(user_name, user_type, user_mail, user_password) 
        VALUES ('{name}', '{type}','{mail}','{password}')''')
        mysql.connection.commit()
        cursor.close()
        return jsonify({'success': 'Successful  insertion'})
    else:
        return jsonify({'blank': 'Blank name, type, mail or password'})



