from flask import Flask, send_from_directory
from utils.extension import mysql
from flask_cors import CORS
# Blueprints import
from api.images import images
from api.auth import auth
from api.documents import documents
from api.annotations.annotations import annotations
from api.annotations.transcription import transcription
from api.annotations.senses import senses
from api.init_database import init_db
# To read .env file
from dotenv import load_dotenv
from os import getenv
load_dotenv()

app = Flask(__name__, static_url_path='', static_folder='../client/build')

app.config['SECRET_KEY'] = getenv('SECRET_KEY')

app.config['MYSQL_HOST'] = getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = getenv('MYSQL_DB')
mysql.init_app(app)
CORS(app)

app.register_blueprint(images)
app.register_blueprint(auth)
app.register_blueprint(documents)
app.register_blueprint(annotations)
app.register_blueprint(transcription)
app.register_blueprint(senses)
app.register_blueprint(init_db)


@app.route("/", defaults={'path':''})
def serve(path):
    return send_from_directory(app.static_folder, 'index.html')


@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == "__main__":
    app.run(debug=True, threaded=True, host='0.0.0.0')