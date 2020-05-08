from . import db
from datetime import datetime
# from werkzeug.security import generate_password_hash


class Profile(db.Model):
    # You can use this to change the table name. The default convention is to use
    # the class name. In this case a class name of UserProfile would create a
    # user_profile (singular) table, but if we specify __tablename__ we can change it
    # to `user_profiles` (plural) or some other name.
    __tablename__ = 'userprofiles'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80))
    last_name = db.Column(db.String(80))
    gender = db.Column(db.String(10))
    email = db.Column(db.String(80), unique=True)
    location = db.Column(db.String(80))
    biography = db.Column(db.String(255))
    profile_picture = db.Column(db.String(80))
    date_joined = db.Column(db.String(80))


    def __init__(self, first_name, last_name, gender, email, location, biography, profile_picture):
        self.first_name = first_name
        self.last_name = last_name
        self.gender = gender
        self.email = email
        self.location = location
        self.biography = biography
        self.profile_picture = profile_picture
        self.date_joined = datetime.now().strftime("%B %d, %Y")
        

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<User %r>' % (self.username)
