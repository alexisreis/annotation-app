from flask import Flask
from extension import mysql
from flask_cors import CORS
# Blueprints import
from images import images
from auth import auth
from documents import documents
from annotations import annotations
from transcription import transcription

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


if __name__ == "__main__":
    app.run(debug=True)