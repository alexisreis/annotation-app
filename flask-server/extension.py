from flask_mysqldb import MySQL
from functools import wraps
from flask import request, jsonify, current_app
import jwt

mysql = MySQL()
edition_type = ['A', 'M', 'E']


def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'x-access-tokens' in request.headers:
            token = request.headers['x-access-tokens']

        if not token:
            return jsonify({'missing': 'a valid token is missing'})
        try:
            jwt.decode(token, key=current_app.config['SECRET_KEY'], algorithms=[
                "HS256"])
        except:
            return jsonify({'invalid': 'token is invalid'})

        # Returns to the function that needs the authentication
        return f(*args, **kwargs)

    return decorator


def getUserId(token):
    data = jwt.decode(token, key=current_app.config['SECRET_KEY'],
                      algorithms=["HS256"])
    return data['user_id'], data['user_type']
