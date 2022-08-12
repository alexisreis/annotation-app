from flask_mysqldb import MySQL
from functools import wraps
from flask import request, jsonify, current_app, make_response
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
            return make_response(jsonify({'missing': 'a valid token is '
                                                     'missing'}), 401)
        try:
            jwt.decode(token, key=current_app.config['SECRET_KEY'], algorithms=[
                "HS256"])
        except:
            return make_response(jsonify({'invalid': 'token is invalid'}), 401)

        # Returns to the function that needs the authentication
        return f(*args, **kwargs)
    return decorator


def getUserId(token):
    try:
        data = jwt.decode(token, key=current_app.config['SECRET_KEY'],
                          algorithms=["HS256"])
        return data['user_id'], data['user_type']
    except:
        return make_response(jsonify({'invalid': 'token is invalid'}), 401)


def admin(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'x-access-tokens' in request.headers:
            token = request.headers['x-access-tokens']

        if not token:
            return make_response(jsonify({'missing': 'a valid token is '
                                                     'missing'}), 401)
        try:
            data = jwt.decode(token, key=current_app.config['SECRET_KEY'],
                        algorithms=[
                "HS256"])
            if data["user_type"] != 'A':
                return make_response(jsonify({'failure': 'user not '
                                                         'administrator'}), 403)
        except:
            return make_response(jsonify({'invalid': 'token is invalid'}), 401)

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
            return make_response(jsonify({'missing': 'a valid token is '
                                                     'missing'}), 401)
        try:
            data = jwt.decode(token, key=current_app.config['SECRET_KEY'],
                              algorithms=[
                                  "HS256"])
            if data["user_type"] == 'W':
                return make_response(jsonify({'failure': 'user cannot alter or create '
                                             'data'}), 403)

        except:
            return make_response(jsonify({'invalid': 'token is invalid'}), 401)

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
            return make_response(jsonify({'missing': 'a valid token is '
                                                     'missing'}), 401)
        try:
            data = jwt.decode(token, key=current_app.config['SECRET_KEY'],
                              algorithms=[
                                  "HS256"])
            if data["user_type"] in ['W', 'S']:
                return make_response(jsonify({'failure': 'user cannot alter '
                                                         'data'}), 403)

        except:
            return make_response(jsonify({'invalid': 'token is invalid'}), 401)

        # Returns to the function that needs the authentication
        return f(*args, **kwargs)
    return decorator
