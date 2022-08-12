from flask import Blueprint, make_response, jsonify
from utils.extension import admin, mysql
from os import listdir, mkdir
from os.path import exists, join
import pandas as pd
import cv2 as cv

init_db = Blueprint('init_db', __name__)

ORIGINAL_PATH = 'images/original/'
RESIZED_PATH = 'images/resized/'
PROJECT_NAME = "AM69123_"
WIDTH = 500


def is_image_in_db(image_id):
    cursor = mysql.connection.cursor()
    image = cursor.execute("""
        SELECT * 
        FROM images 
        WHERE image_id= %(image_id)s """,
                           {
                               'image_id': image_id
                           })
    cursor.close()

    if image > 0:
        return True
    return False


def is_document_in_db(document_cote):
    cursor = mysql.connection.cursor()
    document = cursor.execute("""
        SELECT * 
        FROM documents 
        WHERE document_cote= %(document_cote)s """,
                              {
                                'document_cote': document_cote
                              })
    cursor.close()

    if document > 0:
        return True
    return False


def add_document_to_db(cote, name, date):
    cursor = mysql.connection.cursor()
    cursor.execute("""
                INSERT INTO documents(document_cote, document_name, document_date) 
                VALUES (%(cote)s, %(name)s, %(date)s) """,
                   {
                       'cote': cote,
                       'name': name,
                       'date': date,
                   })
    mysql.connection.commit()
    cursor.close()
    print(f'''Document {cote} successfully added to DB''')


def add_image_to_db(image_id, document_cote):
    cursor = mysql.connection.cursor()
    cursor.execute("""
                INSERT INTO images(image_id, document_cote) 
                VALUES (%(image_id)s, %(document_cote)s) """,
                   {
                       'image_id': image_id,
                       'document_cote': document_cote,
                   })
    mysql.connection.commit()
    cursor.close()
    print(f'''Image {image_id} successfully added to DB''')


def minify(original_path, cote, image_name):
    img = cv.imread(original_path + cote + '/' + image_name)
    height = int(img.shape[0] * 500 / img.shape[1])
    resized = cv.resize(img, (WIDTH, height), interpolation=cv.INTER_CUBIC)
    cv.imwrite(RESIZED_PATH + cote + '/' + image_name, resized)
    print(f'''Image {image_name} successfully minified''')


def add_images_to_db(cote):
    if not exists(ORIGINAL_PATH + cote):
        print(f'''XXX --- Directory does not exists for {cote} --- XXX''')
        return

    path = join(RESIZED_PATH, cote)
    if not exists(path):
        mkdir(path)
    for f in listdir(ORIGINAL_PATH + cote):
        if f[-4:] == '.jpg':
            if not exists(RESIZED_PATH + cote + '/' + f):
                minify(ORIGINAL_PATH, cote, f)
            if not is_image_in_db(f[:-4]):
                add_image_to_db(f[:-4], cote)


def read_excel_data(excel_file):
    data = pd.read_excel(excel_file,
                         sheet_name='Feuil1')
    df = pd.DataFrame(data, columns=['Cote', 'Intitulé', 'dates'])
    print(df)

    for i in range(df.shape[0]):
        if not is_document_in_db(PROJECT_NAME + data.at[i, 'Cote']):
            print(f'''Adding {PROJECT_NAME + data.at[i, 'Cote']} to DB''')
            add_document_to_db(PROJECT_NAME + data.at[i, 'Cote'],
                               data.at[i, 'Intitulé'], data.at[i, 'dates'])
        add_images_to_db(PROJECT_NAME + data.at[i, 'Cote'])


@init_db.route('/initdb')
@admin
def initdb():
    read_excel_data('images/liste_documents.xlsx')
    return make_response(jsonify({'success': 'init db'}), 200)
