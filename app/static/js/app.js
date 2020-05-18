/* Add your Application JavaScript */
var jwt;
let successMessage;
let displaySuccessMessage = false;

Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="/explore"><img id="icon" src="../static/images/photogram.png" alt="Logo"/> <b>Photogram</b></a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/explore">Explore<span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/myprofile">My Profile<span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/logout">Logout<span class="sr-only">(current)</span></router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});

Vue.component('app-footer', {
    template: `
    <footer>
        <br><br>
        <div class="container">
            <p>Copyright &copy; Photogram Inc.</p>
        </div>
    </footer>
    `
});


const postForm = Vue.component('post-form', {
  template: `
      <div id="centerDiv">
          <div id="postFormDiv">
              <div id = "message">
                  <ul class="alert alert-danger" v-if="outcome === 'failure'" id = "errors">
                      <li v-for="error in errors" class="news__item"> {{ error }}</li>
                  </ul> 
              </div>
              <h1><b>New Post</b></h1><br>
              <form id="uploadForm" @submit.prevent="uploadPhoto" method="POST" enctype="multipart/form-data">
                  
                  <div class="form-group">
                      <label for="photo"><b>Photo</b></label>
                      <input class="form-control" id="photo" name="photo" type="file">
                  </div>

                  <div class="form-group">
                      <label for="description"><b>Description</b></label> <textarea class="form-control" id="description" name="description"></textarea>
                  </div>

                  <button type="submit" name="submit" class="btn btn-primary btn-block"><b>UPLOAD</b></button>

              </form>
          </div>
      </div>
  `,
  data: function() {
    return {
      outcome: '',
      errors: []
    }
  },
  methods: {
    uploadPhoto: function() {

      let uploadForm = document.getElementById('uploadForm');
      let form_data = new FormData(uploadForm);
      let self = this;
      fetch("/api/users/"+ current_userid +"/posts", {
        method: 'POST',
        body: form_data,
        headers: {
          'X-CSRFToken': token
        },
        credentials: 'same-origin'
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (jsonResponse) {
          // display a success message
          console.log(jsonResponse);
          if(jsonResponse.hasOwnProperty('errordata')) {
            self.errors = jsonResponse.errordata.errors;
            self.outcome = 'failure';
          } else {
            successMessage = jsonResponse.successMessage.message;
            displaySuccessMessage = true;
            router.go(-1)
            router.push('explore');
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
});


const registerForm = Vue.component('register-form', {
  template: `          
  <div class="container">
      <div id="centerDiv">
          <div class="register-form center-block">
              <div id = "message">
                  <p class="alert alert-success" v-if="success" id = "success"> {{ message }} </p>
                  <ul class="alert alert-danger" v-if="outcome === 'failure'" id = "errors">
                      <li v-for="error in errors" class="news__item"> {{ error }}</li>
                  </ul> 
              </div>
              <h1><img id="loginLogo" src="../static/images/photogram.png" alt="Logo"/> <b>Photogram User Registration</b></h1><br>
              <form id="registerForm" @submit.prevent="registerUser" method="post" enctype="multipart/form-data">
                  <div class="form-group">
                      <label for="username"><b>Username</b></label> <input class="form-control" id="username" name="username" type="text" value="">
                  </div>
                  <div class="form-group">
                      <label for="password"><b>Password</b></label> <input class="form-control" id="password" name="password" type="password" value="">
                  </div>
                  <div class="form-group">
                      <label for="firstName"><b>First Name</b></label> <input class="form-control" id="firstName" name="firstName" type="text" value="">
                  </div>
                  <div class="form-group">
                      <label for="lastName"><b>Last Name</b></label> <input class="form-control" id="lastName" name="lastName" type="text" value="">
                  </div>
                  <div class="form-group">
                      <label for="email"><b>E-mail</b></label> <input class="form-control" id="email" name="email" type="text" value="">
                  </div>
                  <div class="form-group">
                      <label for="location"><b>Location</b></label> <input class="form-control" id="location" name="location" type="text" value="">
                  </div>
                  <div class="form-group">
                      <label for="gender"><b>Gender</b></label> <select class="form-control" id="gender" name="gender"><option value="Male">Male</option><option value="Female">Female</option></select>
                  </div>
                  <div class="form-group">
                      <label for="biography"><b>Biography</b></label> <textarea class="form-control" id="biography" name="biography"></textarea>
                  </div>
                  <div class="form-group">
                      <label for="photo">Profile Photo</label>
                      <input class="form-control"  id="photo" name="photo" type="file">
                  </div>
                
                  <button type="submit" name="submit" class="btn btn-primary btn-block"><b>REGISTER</b></button>
              </form>
        </div>
      </div>
  </div>
  `,
  data: function() {
      return {
        outcome: '',
        errors: [],
        message: '',
        success: false
      }
  },
  methods: {
    registerUser: function() {
      let router = this.$router;
      let registerForm = document.getElementById('registerForm');
      let form_data = new FormData(registerForm);
      // let formDataJSON = JSON.stringify(Object.fromEntries(form_data));
      let self = this;
      fetch("/api/users/register", {
        method: 'POST',
        body: form_data,
        headers: {
          'X-CSRFToken': token
        },
        credentials: 'same-origin'
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (jsonResponse) {
          // display a success message
          console.log(jsonResponse);
          if(jsonResponse.hasOwnProperty('registerError')) {
            self.errors = jsonResponse.registerError.errors;
            self.outcome = 'failure';
          } else {
            successMessage = jsonResponse.successMessage.message;
            displaySuccessMessage = true;
            router.push('login')
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
});

const loginForm = Vue.component('login-form', {
    template: `
    <div class="container">
            
        <div id="centerDiv">
            <div class="login-form center-block">
                <div id = "message">
                    <p class="alert alert-success" v-if="success" id = "success"> {{ message }} </p>
                    <p class="alert alert-danger" v-if="outcome === 'singleError'" id = "error"> {{ errorMessage }} </p>
                    <ul class="alert alert-danger" v-if="outcome === 'multipleErrors'" id = "errors">
                        <li v-for="error in errors" class="news__item"> {{ error }}</li>
                    </ul> 
                </div>

                <h1><img id="loginLogo" src="../static/images/photogram.png" alt="Logo"/> <b>Photogram Login</b></h1><br>
                
                <form id="loginForm"  @submit.prevent="loginUser" method="post">
                    <div class="form-group">
                        <label for="username"><b>Username</b></label>
                        <input class="form-control" id="username" name="username" placeholder="Enter your username" type="text" value="">
                    </div>
                    <div class="form-group">
                        <label for="password"><b>Password</b></label>
                        <input class="form-control" id="password" name="password" type="password" placeholder="Enter your password" value="">
                    </div>
                    <button type="submit" name="submit" class="btn btn-primary btn-block"><b>LOG IN</b></button>
                </form>
            </div>
        </div>
  
    </div>
    `,
    data: function() {
        return {
          outcome: '',
          errors: [],
          errorMessage: '',
          message: '',
          success: false
        }
    },
    mounted: function() {
  
      let self = this;
      if(displaySuccessMessage) {
        displaySuccessMessage = false;
        self.success = true;
        self.message = successMessage;
      }
          
    },
    methods: {
      loginUser: function() {
        let router = this.$router;
        let loginForm = document.getElementById('loginForm');
        let form_data = new FormData(loginForm);
        // let formDataJSON = JSON.stringify(Object.fromEntries(form_data));
        let self = this;
        fetch("/api/auth/login", {
          method: 'POST',
          body: form_data,
          headers: {
            'X-CSRFToken': token
          },
          credentials: 'same-origin'
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (jsonResponse) {
            // display a success message
            console.log(jsonResponse);

            if(jsonResponse.hasOwnProperty('loginError')) {

              self.errorMessage = jsonResponse.loginError.error;
              self.outcome = 'singleError';
              self.success = false;

            } else if(jsonResponse.hasOwnProperty('loginErrors')) {

              self.errors = jsonResponse.loginErrors.errors;
              self.outcome = 'multipleErrors'
              self.success = false;

            } else {

              successMessage = jsonResponse.successMessage.message;
              displaySuccessMessage = true;
              jwt = jsonResponse.successMessage.token;
              router.push('explore')

            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
  });


const explore = Vue.component('explore', {
    template: `          
    <div class="allPostsContainer">
        <div id = "message">
            <p class="alert alert-success" v-if="success" id = "success"> {{ message }} </p>
        </div>
        <div id="allPostsGrid">
            <div id="allPosts">
                <div v-for="post in posts" class="explorePost">
                    <button @click="$router.push({ name: 'user', params: { user_id: post.user_id } })" id="blackText" type="button" class="btn btn-link explorePostHead"><h5 ><img v-bind:src="post.profile_picture" class="explorePostProfilePhoto" alt="photo"/><b>{{ post.username }}</b></h5></button>
                    <img v-bind:src="post.photo" class="explorePostPhoto" alt="photo"/>
                    <div class="explorePostBody">
                        <p class="explorePostText text-muted">{{ post.caption }}</p> 
                        <div id="likesdate">
                            <button v-if="!post.liked" @click="addLike(post.id)" id="blackText" class="btn btn-light" type="submit"><img id="likesicon" src="../static/images/heart.png" /> {{ post.likes }} Likes</button>
                            <button v-if="post.liked" @click="removeLike(post.id)" id="blackText" class="btn btn-danger" type="submit"><img id="likesicon" src="../static/images/heart.png" /> {{ post.likes }} Likes</button>
                            <p class="explorePostText text-muted"><b><i>{{ post.created_on }}</i></b></p>
                        </div>
                    </div>
                </div> 
            </div>
            <div id="newPostBtnDiv">
                <button id="newPostBtn" class="btn btn-primary" @click="$router.push('/posts/new')" type="submit">New Post</button>
            </div>
        </div>
    </div>
    `,
    data: function() {
        return {
          posts: [],
          message: '',
          success: false
        }
    },
    mounted: function() {
  
      let self = this;
      fetch("/api/posts", {
          method: 'GET',
          headers: {
            "Content-type": "application/json",
            "Authorization" :"Bearer " + jwt
          },
        })
        .then(function (response) {
          return response.json();
        })
        .then(function (jsonResponse) {
          console.log(jsonResponse);
          self.posts = jsonResponse.posts.posts;
          self.likes = jsonResponse.posts.likes;
          if(displaySuccessMessage) {
            displaySuccessMessage = false;
            self.success = true;
            self.message = successMessage;
          }
          
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    methods: {
      addLike: function(post_id) {
        let like = {
          "user_id": current_userid,
          "post_id": post_id
        }
        let self = this;
        fetch("/api/posts/"+post_id+"/like", {
          method: 'POST',
          body: like,
          headers: {
            "Content-Type": "application/json",
            "Authorization" :"Bearer " + jwt,
            'X-CSRFToken': token
          },
          credentials: 'same-origin'
        })
          .then(function (response) {
            return fetch("/api/posts", {
              method: 'GET',
              headers: {
                "Content-type": "application/json",
                "Authorization" :"Bearer " + jwt
              },
            })
            .then(function (response) {
              return response.json();
            });
          })
          .then(function (jsonResponse) {
            // display a success message
            console.log(jsonResponse);
            self.posts = jsonResponse.posts.posts;
            self.likes = jsonResponse.posts.likes;
            self.success = true;
            self.message = 'Post liked!';

          })
          .catch(function (error) {
            console.log(error);
          });

      },
      removeLike: function(post_id) {
        let like = {
          "user_id": current_userid,
          "post_id": post_id
        }
        let self = this;
        fetch("/api/posts/"+post_id+"/like", {
          method: 'POST',
          body: like,
          headers: {
            "Content-Type": "application/json",
            "Authorization" :"Bearer " + jwt,
            'X-CSRFToken': token
          },
          credentials: 'same-origin'
        })
          .then(function (response) {
            return fetch("/api/posts", {
              method: 'GET',
              headers: {
                "Content-type": "application/json",
                "Authorization" :"Bearer " + jwt
              },
            })
            .then(function (response) {
              return response.json();
            });
          })
          .then(function (jsonResponse) {
            // display a success message
            console.log(jsonResponse);
            self.posts = jsonResponse.posts.posts;
            self.likes = jsonResponse.posts.likes;
            self.success = true;
            self.message = 'Post unliked!';

          })
          .catch(function (error) {
            console.log(error);
          });

      }
    }
  });

const logout = Vue.component('logout', {
    template: `
    `,
    mounted: function() {
  
      let self = this;
      fetch("/api/auth/logout", {
          method: 'GET',
          headers: {
            "Content-type": "application/json"
          },
        })
        .then(function (response) {
          return response.json();
        })
        .then(function (jsonResponse) {
          console.log(jsonResponse);
          successMessage = jsonResponse.successMessage.message;
          displaySuccessMessage = true;
          router.push('/login')
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    methods: {}
  });


const userProfile = Vue.component('userProfile', {
    template: `          
    <div id="profileMainContainer" class="container">
      <div id = "message">
          <p class="alert alert-success" v-if="success" id = "success"> {{ message }} </p>
      </div>
      <div  class="profileSubContainer">
          <div id="profile">
              <div id="profilePictureDiv">
                  <img id="profilePicture" v-bind:src="info.photo" alt="profile picture"/>
              </div>
              <div id="profileDetailsDiv">
                  <h4><b>{{ info.firstname }} {{ info.lastname }}</b></h4>
                  <p class="text-muted">{{ info.location }}<br>Member since {{ info.joined_on }}</p> 
                  <p class="text-muted"><i>{{ info.biography }}</i></p>
              </div>
              <div id="profileButtonDiv">
                  <div id="numbers">
                      <div id="postsNum">
                          <p>{{ info.posts }}<br><b>Posts</b></p>
                      </div>
                      <div id="followersNum">
                          <p>{{ info.followers }}<br><b>Followers</b></p>
                      </div>
                  </div>
                  <div v-if="!isCurrentUser" id="followBtnDiv">
                      <button v-if="info.followed" id="followBtn" class="btn btn-success" @click="removeFollow(info.id)" type="submit">Following</button>
                      <button v-if="!info.followed" id="followBtn" class="btn btn-primary" @click="addFollow(info.id)" type="submit">Follow</button>
                  </div>
              </div>
          </div>
      </div>
      <br><br>
      <div class="profileSubContainer">
          <div id="userPostsDiv">
              <ul id="postsList">
                  <li v-for="post in posts" id="postItem">
                      <img class="posts" v-bind:src="post.photo" alt="picture"/>
                  </li>
              </ul>
          </div>
      </div>
            
  </div>
    `,
    data: function() {
        return {
          posts: [],
          info: {},
          isCurrentUser: false,
          message: '',
          success: false
        }
    },
    mounted: function() {
  
      let self = this;
      let user_id = this.$route.params.user_id;

      fetch("/api/users/"+user_id+"/posts", {
          method: 'GET',
          headers: {
            "Content-type": "application/json",
            "Authorization" :"Bearer " + jwt
          },
        })
        .then(function (response) {
          return response.json();
        })
        .then(function (jsonResponse) {
          console.log(jsonResponse);
          self.posts = jsonResponse.details.posts;
          self.info = jsonResponse.details.info;
          if(current_userid==user_id) {
            self.isCurrentUser = true;
          }
          
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    methods: {
      removeFollow: function(user_id) {
        let follow = {
          "user_id": current_userid,
          "follower_id": user_id
        }
        let self = this;
        fetch("/api/users/"+user_id+"/follow", {
          method: 'POST',
          body: follow,
          headers: {
            "Content-Type": "application/json",
            "Authorization" :"Bearer " + jwt,
            'X-CSRFToken': token
          },
          credentials: 'same-origin'
        })
          .then(function (response) {
            self.response = response.json()
            return fetch("/api/users/"+user_id+"/posts", {
              method: 'GET',
              headers: {
                "Content-type": "application/json",
                "Authorization" :"Bearer " + jwt
              },
            })
            .then(function (response) {
              return response.json();
            })
          })
          .then(function (jsonResponse) {
            // display a success message
            console.log(jsonResponse);
            self.posts = jsonResponse.details.posts;
            self.info = jsonResponse.details.info;
            if(current_userid==user_id) {
              self.isCurrentUser = true;
            }
            self.success = true;
            self.message = 'You are no longer following this user';

          })
          .catch(function (error) {
            console.log(error);
          });

      },
      addFollow: function(user_id) {
        let follow = {
          "user_id": current_userid,
          "follower_id": user_id
        }
        let self = this;
        fetch("/api/users/"+user_id+"/follow", {
          method: 'POST',
          body: follow,
          headers: {
            "Content-Type": "application/json",
            "Authorization" :"Bearer " + jwt,
            'X-CSRFToken': token
          },
          credentials: 'same-origin'
        })
          .then(function (response) {
            self.response = response.json()
            return fetch("/api/users/"+user_id+"/posts", {
              method: 'GET',
              headers: {
                "Content-type": "application/json",
                "Authorization" :"Bearer " + jwt
              },
            })
            .then(function (response) {
              return response.json();
            })
          })
          .then(function (jsonResponse) {
            // display a success message
            console.log(jsonResponse);
            self.posts = jsonResponse.details.posts;
            self.info = jsonResponse.details.info;
            if(current_userid==user_id) {
              self.isCurrentUser = true;
            }
            self.success = true;
            self.message = 'You are now following this user';

          })
          .catch(function (error) {
            console.log(error);
          });

      }
    }
});


const myProfile = Vue.component('myProfile', {
  template: `          
  <div id="profileMainContainer" class="container">
      <div  class="profileSubContainer">
          <div id="profile">
              <div id="profilePictureDiv">
                  <img id="profilePicture" v-bind:src="info.photo" alt="profile picture"/>
              </div>
              <div id="profileDetailsDiv">
                  <h4><b>{{ info.firstname }} {{ info.lastname }}</b></h4>
                  <p class="text-muted">{{ info.location }}<br>Member since {{ info.joined_on }}</p> 
                  <p class="text-muted"><i>{{ info.biography }}</i></p>
              </div>
              <div id="profileButtonDiv">
                  <div id="numbers">
                      <div id="postsNum">
                          <p>{{ info.posts }}<br><b>Posts</b></p>
                      </div>
                      <div id="followersNum">
                          <p>{{ info.followers }}<br><b>Followers</b></p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <br><br>
      <div class="profileSubContainer">
          <div id="userPostsDiv">
              <ul id="postsList">
                  <li v-for="post in posts" id="postItem">
                      <img class="posts" v-bind:src="post.photo" alt="picture"/>
                  </li>
              </ul>
          </div>
      </div>
            
  </div>
  `,
  data: function() {
      return {
        posts: [],
        info: {}
      }
  },
  mounted: function() {

    let self = this;

    //fetches the user's posts
    fetch("/api/users/"+current_userid+"/posts", {
        method: 'GET',
        headers: {
          "Content-type": "application/json",
          "Authorization" :"Bearer " + jwt
        },
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (jsonResponse) {
        console.log(jsonResponse);  
        self.posts = jsonResponse.details.posts;
        self.info = jsonResponse.details.info;
        
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  methods: {}
});
  


const Home = Vue.component('home', {
   template: `
    <div id="homeDiv">
        <div id="homeImageDiv">
            <img id="homeImage" src="../static/images/home.jpg" alt="Home Image"/>
        </div>

        <div id="homeIntroDiv">
            <div id="homeHeadingDiv">
                <h1><img id="loginLogo" src="../static/images/photogram.png" alt="Logo"/> <b>Photogram</b></h1>
            </div>
            <p class="lead">Share photos of your favorite moments with your family, friends and the world. </p>
            <div id="homeBtnsDiv">
                <button id="homebtn_register" class="btn btn-success" @click="$router.push('register')" type="submit" name="submit"><b>REGISTER</b></button>
                <button id="homebtn_login" class="btn btn-primary" @click="$router.push('login')" type="submit" name="submit"><b>LOGIN</b></button>
            </div>
        </div>
        
    </div>
   `,
    data: function() {
       return {}
    }
});

const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {}
    }
})

// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", component: Home},

        // Put other routes here
        {path: "/posts/new", component: postForm},
        {path: "/login", component: loginForm},
        {path: "/register", component: registerForm},
        {path: "/explore", component: explore},
        {path: "/users/:user_id", name: 'user' ,component: userProfile},
        {path: "/myprofile", component: myProfile},
        {path: "/logout", component: logout},
        
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});
