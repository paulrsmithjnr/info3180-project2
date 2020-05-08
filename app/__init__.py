from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Config Values
UPLOAD_FOLDER = './app/static/uploads'


app = Flask(__name__)
app.config['SECRET_KEY'] = "random_key"
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://jrwagwsvveqdyq:d3b01edc599b779de8e660424263867202089a8783719506324e993913c68e69@ec2-23-22-156-110.compute-1.amazonaws.com:5432/datdia6j8gufho"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True # added just to suppress a warning

db = SQLAlchemy(app)

app.config.from_object(__name__)
from app import views
