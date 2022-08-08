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

from os import listdir
from os.path import exists

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


def find_image(image_name):
    cursor = mysql.connection.cursor()
    image = cursor.execute(f''' SELECT * FROM images WHERE image_id='{image_name}' ''')
    cursor.close()

    if image > 0:
        return True
    return False


def add_images(path):
    cursor = mysql.connection.cursor()

    for f in listdir(path):
        if f[-4:] == '.jpg' and not find_image(f[:-4]):
            print(f'''Adding {f[:-4]}''')
            cursor.execute(f'''
                INSERT INTO images(image_id, document_cote) 
                VALUES ('{f[:-4]}', '1') ''')

    mysql.connection.commit()
    cursor.close()
    print('done')


@app.route('/setdata')
def setdata():
    add_images('images/original/1')
    return "DONE"


if __name__ == "__main__":
    app.run(debug=True)