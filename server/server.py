from flask import Flask
from utils.extension import mysql
from flask_cors import CORS
# Blueprints import
from images import images
from api.auth import auth
from api.documents import documents
from api.annotations import annotations
from api.transcription import transcription
from api.senses import senses
from init_database import init_db

app = Flask(__name__)

app.config['SECRET_KEY'] = "holaquetal"

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'test_flask'
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