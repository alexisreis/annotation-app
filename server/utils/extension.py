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


def admin(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'x-access-tokens' in request.headers:
            token = request.headers['x-access-tokens']

        if not token:
            return jsonify({'missing': 'a valid token is missing'})
        try:
            data = jwt.decode(token, key=current_app.config['SECRET_KEY'],
                        algorithms=[
                "HS256"])
            if data["user_type"] != 'A':
                return jsonify({'failure': 'user not administrator'})

        except:
            return jsonify({'invalid': 'token is invalid'})

        # Returns to the function that needs the authentication
        return f(*args, **kwargs)
    return decorator


def creator(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'x-access-tokens' in request.headers:
            token = request.headers['x-access-tokens']

        if not token:
            return jsonify({'missing': 'a valid token is missing'})
        try:
            data = jwt.decode(token, key=current_app.config['SECRET_KEY'],
                              algorithms=[
                                  "HS256"])
            if data["user_type"] == 'W':
                return jsonify({'failure': 'user cannot alter or create data'})

        except:
            return jsonify({'invalid': 'token is invalid'})

        # Returns to the function that needs the authentication
        return f(*args, **kwargs)
    return decorator


def editor(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'x-access-tokens' in request.headers:
            token = request.headers['x-access-tokens']

        if not token:
            return jsonify({'missing': 'a valid token is missing'})
        try:
            data = jwt.decode(token, key=current_app.config['SECRET_KEY'],
                              algorithms=[
                                  "HS256"])
            if data["user_type"] in ['W', 'S']:
                return jsonify({'failure': 'user cannot alter data'})

        except:
            return jsonify({'invalid': 'token is invalid'})

        # Returns to the function that needs the authentication
        return f(*args, **kwargs)
    return decorator
