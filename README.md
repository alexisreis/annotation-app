# annotation-app

Developed by @alexisreis  
June / July 2022

# Server side
A flask server is used to send images to the OpenCV library to enhanced them.
### \> Installation
You need a virtual environment to run Python with the libraries used.
```bash
cd server
python -m venv venv
.\venv\Scripts\activate
pip install flask flask_cors opencv-python flask_mysqldb PyJWT
```

### \> Run
Once the virtual environment is set up, and the libraries installed you can 
start the flask server like so :
- activate the virtual environment
- launch the server
```bash
.\venv\Scripts\activate
python server.py
```

# Client side
Just open the `index.html` file in `/client/dist`

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
You can now reopen `index.html` and your edits will normally appear.d