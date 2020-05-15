"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

import os
import jwt
import psycopg2 
from app import app, db
from flask import render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from app.forms import RegisterForm, LoginForm, PostForm
from app.models import Posts, Users, Likes, Follows
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash

###
# Routing for your application.
###

@app.route('/api/users/register', methods = ['POST'])
def register():
    registrationForm = RegisterForm()
    if registrationForm.validate_on_submit():
        username = registrationForm.username.data
        password = registrationForm.password.data
        firstName = registrationForm.firstName.data
        lastName = registrationForm.lastName.data
        gender = registrationForm.gender.data
        email = registrationForm.email.data
        location = registrationForm.location.data
        biography = registrationForm.biography.data
        photo = registrationForm.photo.data

        profile_picture = secure_filename(photo.filename)
        photo.save(os.path.join(
            app.config['UPLOAD_FOLDER'], profile_picture
        ))

        user = Users(username=username, password=password, firstname=firstName, lastname=lastName, gender=gender, email=email, location=location, biography=biography, profile_picture=profile_picture)
        db.session.add(user)
        db.session.commit()
        
        successMessage = {
            "message": "User successfully registered"
        }
        return jsonify(successMessage=successMessage)
    
    else:
        registrationFormErrorData = {
            "errors": form_errors(registrationForm)
        }
        return jsonify(registrationFormErrorData=registrationFormErrorData)


@app.route('/api/auth/login', methods=['POST'])
def login():
    loginform = LoginForm()
    if loginform.validate_on_submit:
        username=loginform.username.data
        password=loginform.password.data
        user=Users.query.filter_by(username=username).first()

        if user is not None and check_password_hash(user.password, password):
            remember_me=False
            if 'remember_me' in request.form:
                remember_me=True

            login_user(user, remember=remember_me)
            payload = {
                "username": user.username,
                "password": user.password
            }
            encoded_jwt = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256') 
            successMessage = {
                "token": encoded_jwt,
                "message": "User successfully logged in."
            }

            return jsonify(successMessage=successMessage)

        else:
            loginError = {
            "errors": "Username or Password is incorrect."
            }
            return jsonify(loginError=loginError)
    
    else:
        loginFormErrorData = {
            "errors": form_errors(loginform)
        }
        return jsonify(loginFormErrorData=loginFormErrorData)


@app.route('/api/auth/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    successMessage = {
        "message": "User successfully logged out."
    }
    return jsonify(successMessage=successMessage)

@app.route('/api/users/<user_id>/posts', methods=['GET', 'POST'])
@login_required
def posts(user_id):
    postForm = PostForm()
    if request.method == 'POST' and postForm.validate_on_submit():
        
        photo = postForm.photo.data
        filename = secure_filename(photo.filename)
        photo.save(os.path.join(
            app.config['UPLOAD_FOLDER'], filename
        ))
        
        description = postForm.description.data
        
        post = Posts(user_id=user_id, photo=filename)
        db.session.add(post)
        db.session.commit()
        
        successMessage = {
            "message": "Successfully created a new post"
        }
        return jsonify(successMessage=successMessage)
    
    elif request.method == 'GET':

        userPosts = Posts.query.filter_by(user_id=user_id).all()
        posts = {
            "posts": userPosts
        }           
        return jsonify(userPosts=userPosts)


@app.route('/api/users/<user_id>/follow', methods=['POST'])
@login_required
def follow(user_id):
    follow = Follows(user_id=current_user.user_id, follower_id=user_id)
    succesMessage = {
        "message": "You are now following that user"
    }
    return jsonify(succesMessage=succesMessage)


@app.route('/api/posts', methods=['GET'])
@login_required
def allposts():
    allPosts = Posts.query.order_by(Posts.id.desc()).all()
    posts = {
        "posts": allPosts
    }
    return jsonify(posts=posts)


@app.route('/api/posts/<post_id>/like',methods=['POST'])
@login_required
def like(post_id):
    like = Likes(user_id=current_user.userid, post_id=post_id)
    numberOfLikes = Likes.query.filter_by(post_id=post_id).count()
    succesMessage = {
        "message": "Post liked!",
        "likes": str(numberOfLikes)
    }
    return jsonify(succesMessage=succesMessage)

###
# The functions below should be applicable to all Flask apps.
###

def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages

@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404

def flash_errors(form):
    for field, errors in form.errors.items():
        for error in errors:
            flash(u"Error in the %s field - %s" % (
                getattr(form, field).label.text,
                error
), 'danger')

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
