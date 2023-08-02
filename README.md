# annotation-app

Developed by @alexisreis  
June - August 2022

# Documentation
Full documentation for this project is available here : [https://alexis-reis.gitbook.io/annotation-app/](https://alexis-reis.gitbook.io/annotation-app/)

# Setup
A flask server is used in order to :
- send data to MySQL DB
- send images to the OpenCV library to enhanced them

### \> Installation
You need a virtual environment to run Python with the libraries used.
In development `Python 3.10` was used.
```bash
cd server
python -m venv venv
.\venv\Scripts\activate
pip install flask flask_cors opencv-python flask_mysqldb PyJWT openpyxl 
pandas gunicorn python-dotenv
# Or you can just use the requirements.txt file
pip install -r requirements.txt
```

### \> Run
Once the virtual environment is set up, and the libraries installed you can 
start the server :
- activate the virtual environment (if it's not already done)
- launch the server
```bash
.\venv\Scripts\activate
python server.py
```

You can now have access to the builded version of the app via [http://localhost:5000/](http://localhost:5000/)
if you work in local.
# Client side
This section is useful if you wish to edit the frontend of the app.

## Development mode
You will need to install `NodeJS` on your system.   
To start the development server on localhost :
```bash
cd client
npm run start
```

To build it :
```bash
cd client
npm run build
```
It will create a `build` folder for your code.

# Annotorious widgets
To edit the custom annotorious widgets made with React just follow these 
steps :
```bash
cd client
npm install
```
### \> SenseWidget
// TODO
### \> TranscriptionWidget
// TODO  
Then build your edits
```bash
npm run build
```
You can now reopen `index.html` and your edits will normally appear.