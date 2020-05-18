"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

import os
import jwt
import psycopg2 
from app import app, db, login_manager
from flask import request, jsonify, render_template
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
        # username = registrationForm.username.data
        username = request.form['username']
        # password = registrationForm.password.data
        password = request.form['password']
        # firstName = registrationForm.firstName.data
        firstName = request.form['firstName']
        # lastName = registrationForm.lastName.data
        lastName = request.form['lastName']
        # gender = registrationForm.gender.data
        gender = request.form['gender']
        # email = registrationForm.email.data
        email = request.form['email']
        # location = registrationForm.location.data
        location = request.form['location']
        # biography = registrationForm.biography.data
        biography = request.form['biography']
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
        registerError = {
            "errors": form_errors(registrationForm)
        }
        return jsonify(registerError=registerError)


@app.route('/api/auth/login', methods=['POST'])
def login():
    loginform = LoginForm()
    # print(request.form['username'])
    if loginform.validate_on_submit:
        # username=loginform.username.data
        # password=loginform.password.data
        username=request.form['username']
        password=request.form['password']

        user=Users.query.filter_by(username=username).first()

        if user is not None and check_password_hash(user.password, password):
            # remember_me=False2
            # if 'remember_me' in request.form:
            #     remember_me=True

            # login_user(user, remember=remember_me)

            login_user(user)
            payload = {
                "username": user.username,
                "password": user.password
            }
            encoded_jwt = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256').decode('utf-8')
            successMessage = {
                "token": encoded_jwt,
                "message": "User successfully logged in."
            }

            return jsonify(successMessage=successMessage)

        else:
            loginError = {
            "error": "Username or Password is incorrect."
            }
            return jsonify(loginError=loginError)
    
    else:
        loginErrors = {
            "errors": form_errors(loginform)
        }
        return jsonify(loginError=loginError)


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
        
        post = Posts(user_id=user_id, photo=filename, caption=description)
        db.session.add(post)
        db.session.commit()
        
        successMessage = {
            "message": "Successfully created a new post"
        }
        return jsonify(successMessage=successMessage)
    
    elif request.method == 'GET':
        
        user = Users.query.filter_by(id=user_id).first()
        userPosts = Posts.query.filter_by(user_id=user_id).all()
        followersCount = Follows.query.filter_by(user_id=user_id).count()
        postsCount = Posts.query.filter_by(user_id=user_id).count()
        findFollow = Follows.query.filter_by(user_id=current_user.id, follower_id=user_id).first()
        followFlag = False
        if findFollow is not None:
            followFlag = True
        userInfo = {
            "id": user.id,
            "username": user.username,
            "firstname": user.firstname,
            "lastname": user.lastname,
            "gender": user.gender,
            "email": user.email,
            "location": user.location,
            "biography": user.biography,
            "photo": user.profile_picture,
            "joined_on": user.joined_on,
            "followers": followersCount,
            "posts": postsCount,
            "followed": followFlag
        }

        postsList = []
        for post in userPosts:
            likeCount = Likes.query.filter_by(post_id=post.id).count()
            currentPost = {
                "id": post.id,
                "user_id": post.user_id,
                "photo": post.photo,
                "caption": post.caption,
                "created_on": post.created_on,
                "likes": likeCount
            }
            postsList.append(currentPost)

            details = {
                "posts": postsList,
                "info": userInfo
            }           
        return jsonify(details=details)


@app.route('/api/users/<user_id>/follow', methods=['POST'])
@login_required
def follow(user_id):
    findFollow = Follows.query.filter_by(user_id=current_user.id, follower_id=user_id).first()
    if findFollow is None:
        follow = Follows(user_id=current_user.user_id, follower_id=user_id)
        db.session.add(follow)
        db.session.commit()
        succesMessage = {
            "message": "You are now following this user"
        }
        return jsonify(succesMessage=succesMessage)
    else:
        Follows.query.filter_by(user_id=current_user.id, follower_id=user_id).delete()
        db.session.commit()
        succesMessage = {
            "message": "You are no longer following this user"
        }
        return jsonify(succesMessage=succesMessage)


@app.route('/api/posts', methods=['GET'])
@login_required
def allposts():
    allPosts = Posts.query.order_by(Posts.id.desc()).all()
    postsList = []
    for post in allPosts:
        likeFlag = False
        likeCount = Likes.query.filter_by(post_id=post.id).count()
        user = Users.query.filter_by(id=post.user_id).first()
        findLike = Likes.query.filter_by(user_id=current_user.id, post_id=post.id).first()
        if findLike is not None:
            likeFlag = True
        currentPost = {
            "id": post.id,
            "user_id": post.user_id,
            "photo": post.photo,
            "caption": post.caption,
            "created_on": post.created_on,
            "likes": likeCount,
            "username": user.username,
            "profile_picture": user.profile_picture,
            "liked": likeFlag
        }
        postsList.append(currentPost)
    posts = {
        "posts": postsList
    }
    return jsonify(posts=posts)


@app.route('/api/posts/<post_id>/like', methods=['POST'])
@login_required
def like(post_id):
    findLike = Likes.query.filter_by(user_id=current_user.id, post_id=post_id).first()
    if findLike is None:
        like = Likes(user_id=current_user.id, post_id=post_id)
        db.session.add(like)
        db.session.commit()
        numberOfLikes = Likes.query.filter_by(post_id=post_id).count()
        succesMessage = {
            "message": "Post liked!",
            "likes": numberOfLikes
        }
        return jsonify(succesMessage=succesMessage)
    else:
        Likes.query.filter_by(user_id=current_user.id, post_id=post_id).delete()
        db.session.commit()
        numberOfLikes = Likes.query.filter_by(post_id=post_id).count()
        succesMessage = {
            "message": "Post unliked!",
            "likes": numberOfLikes
        }
        return jsonify(succesMessage=succesMessage)

###
# The functions below should be applicable to all Flask apps.
###

@login_manager.user_loader
def load_user(id):
    return Users.query.get(int(id))


# Please create all new routes and view functions above this route.
# This route is now our catch all route for our VueJS single page
# application.
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".

    Also we will render the initial webpage and then let VueJS take control.
    """
    return render_template('index.html')

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


# @app.errorhandler(404)
# def page_not_found(error):
#     """Custom 404 page."""
#     return render_template('404.html'), 404

# def flash_errors(form):
#     for field, errors in form.errors.items():
#         for error in errors:
#             flash(u"Error in the %s field - %s" % (
#                 getattr(form, field).label.text,
#                 error
# ), 'danger')

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
