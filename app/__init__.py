from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect 

# Config Values
UPLOAD_FOLDER = './app/static/uploads'
SECRET_KEY = '\x1d\xd8\xa8\xa7n\xfaZ\xe5-~\x03\xb0\x08/\x86\xf6H\xad\xc1\x82\xbe\x1e.\xc7'


app = Flask(__name__)
csrf = CSRFProtect(app)
app.config['SECRET_KEY'] = SECRET_KEY
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://photogram:photogram@localhost/photogram"
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://wesqvyndnmnwdh:a7b8e83d1b4d5bad3dc27ad9fdeff08d16561b0b2d841414bfa8f1d55b7d5692@ec2-35-171-31-33.compute-1.amazonaws.com:5432/deo04ed06l395i"
# app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://user:password@host/databasename"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True # added just to suppress a warning

db = SQLAlchemy(app)

# Flask-Login login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

app.config.from_object(__name__)
from app import views