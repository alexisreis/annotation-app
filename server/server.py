from flask import Flask
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

app = Flask(__name__)

# TODO : put SECRET_KET in a .env file
app.config['SECRET_KEY'] = 'your_secret_key'

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'annotation_app'
mysql.init_app(app)
CORS(app)

app.register_blueprint(images)
app.register_blueprint(auth)
app.register_blueprint(documents)
app.register_blueprint(annotations)
app.register_blueprint(transcription)
app.register_blueprint(senses)
app.register_blueprint(init_db)

if __name__ == "__main__":
    app.run(debug=True)