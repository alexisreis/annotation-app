from flask import Blueprint, jsonify, make_response, current_app, request, \
    session
from utils.extension import mysql, token_required, getUserId, admin
import jwt

auth = Blueprint('auth', __name__)


@auth.route('/login', methods=['POST'])
def login():
    mail = request.values.get('mail')
    password = request.values.get('password')

    cursor = mysql.connection.cursor()
    user = cursor.execute("""
        SELECT * 
        FROM Users 
        WHERE user_mail=%(mail)s  """,
                          {
                              'mail': mail
                          })
    if user == 0:
        cursor.close()
        return make_response(jsonify({'not_found': 'User not found'}), 403)

    userDetails = cursor.fetchall()
    cursor.close()
    user_id = userDetails[0][0]
    user_name = userDetails[0][1]
    user_type = userDetails[0][2]
    user_password = userDetails[0][4]

    if password != user_password:
        return make_response(jsonify({'password': 'Incorrect'}), 403)

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
    return make_response(jsonify({'token': token}), 200)


@auth.route('/auth')
@token_required
def authenticate():
    return make_response(jsonify({"status": 'Verified'}), 200)


@auth.route('/createNewUser', methods=['POST'])
def createNewUser():
    name = request.values.get('name')
    mail = request.values.get('mail')
    password = request.values.get('password')

    if not name or not mail or not password:
        return make_response(jsonify({'blank': 'Blank name, type, mail or '
                                               'password'}), 400)

    cursor = mysql.connection.cursor()

    user = cursor.execute("""
        SELECT user_id 
        FROM users 
        WHERE user_mail=%(mail)s """, {'mail': mail})
    if user > 0:
        return make_response(jsonify({'exists': 'This email has already an '
                                                'account'}), 418)

    cursor.execute("""
    INSERT INTO users(user_name, user_type, user_mail, user_password) 
    VALUES (%(name)s, 'W', %(mail)s, %(password)s)""",
                   {
                       'name': name,
                       'mail': mail,
                       'password': password,
                   })
    mysql.connection.commit()
    cursor.close()
    return make_response(jsonify({'success': 'Successful  insertion'}), 201)


@auth.route('/getUsersList')
@admin
def getUsers():
    cursor = mysql.connection.cursor()
    user = cursor.execute("""
        SELECT user_id, user_name, user_mail, user_type 
        FROM Users """)

    if user == 0:
        return make_response(jsonify({'error': 'what ?'}), 500)

    userDetails = cursor.fetchall()
    return make_response(jsonify(userDetails), 200)




@auth.route('/editUserType', methods=['POST'])
@admin
def editUserType():
    user_type = request.values.get('user_type')
    user_id = request.values.get('user_id')

    cursor = mysql.connection.cursor()
    cursor.execute("""
        UPDATE users 
        SET user_type = %(user_type)s
        WHERE user_id = %(user_id)s """,
                   {
                       'user_type': user_type,
                       'user_id': user_id
                   })
    mysql.connection.commit()
    cursor.close()
    return make_response(jsonify({'success': 'Successful update'}), 200)


@auth.route('/deleteUser', methods=['POST'])
@admin
def deleteUser():
    user_id = request.values.get('user_id')

    cursor = mysql.connection.cursor()
    cursor.execute("""
        DELETE FROM users 
        WHERE user_id = %(user_id)s """,
                   {
                       'user_id': user_id
                   })
    mysql.connection.commit()
    cursor.close()
    return make_response(jsonify({'success': 'Successful delete'}), 200)


