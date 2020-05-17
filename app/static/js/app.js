/* Add your Application JavaScript */
var jwt;

Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#"><b>Photogram</b></a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/upload">Upload Form <span class="sr-only">(current)</span></router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});


const postForm = Vue.component('post-form', {
  template: `
      <div id="postFormDiv">
          <div id = "message">
              <p class="alert alert-success" v-if="outcome === 'success'" id = "success">Submitted Successfully!</p>
              <ul class="alert alert-danger" v-if="outcome === 'failure'" id = "errors">
                  <li v-for="error in errors" class="news__item"> {{ error }}</li>
              </ul> 
          </div>
          <form id="uploadForm" @submit.prevent="uploadPhoto" method="POST" enctype="multipart/form-data">

              <div class="form-group">
                  <label for="description">Description</label> <textarea class="form-control" id="description" name="description"></textarea>
              </div>
              
              <div class="form-group">
                  <label for="photo">Profile Photo</label>
                  <input class="form-control" id="photo" name="photo" type="file">
              </div>

              <button type="submit" name="submit">Upload</button>

          </form>
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
            self.outcome = 'success';
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
          
      <div class="register-form center-block">
          <h2>User Registration</h2>
          <div id = "message">
              <p class="alert alert-success" v-if="outcome === 'success'" id = "success"> {{ success }} </p>
              <ul class="alert alert-danger" v-if="outcome === 'failure'" id = "errors">
                  <li v-for="error in errors" class="news__item"> {{ error }}</li>
              </ul> 
          </div>
          <form id="registerForm" @submit.prevent="registerUser" method="post" enctype="multipart/form-data">
              <div class="form-group">
                  <label for="username">Username</label> <input class="form-control" id="username" name="username" type="text" value="">
              </div>
              <div class="form-group">
                  <label for="password">Password</label> <input class="form-control" id="password" name="password" type="text" value="">
              </div>
              <div class="form-group">
                  <label for="firstName">First Name</label> <input class="form-control" id="firstName" name="firstName" type="text" value="">
              </div>
              <div class="form-group">
                  <label for="lastName">Last Name</label> <input class="form-control" id="lastName" name="lastName" type="text" value="">
              </div>
              <div class="form-group">
                  <label for="email">E-mail</label> <input class="form-control" id="email" name="email" type="text" value="">
              </div>
              <div class="form-group">
                  <label for="location">Location</label> <input class="form-control" id="location" name="location" type="text" value="">
              </div>
              <div class="form-group">
                  <label for="gender">Gender</label> <select class="form-control" id="gender" name="gender"><option value="Male">Male</option><option value="Female">Female</option></select>
              </div>
              <div class="form-group">
                  <label for="biography">Biography</label> <textarea class="form-control" id="biography" name="biography"></textarea>
              </div>
              <div class="form-group">
                  <label for="photo">Profile Photo</label>
                  <input class="form-control" id="photo" name="photo" type="file">
              </div>
            
              <button type="submit" name="submit">Register</button>
          </form>
    </div>


  </div>
  `,
  data: function() {
      return {
        outcome: '',
        errors: [],
        success: ''
      }
  },
  methods: {
    registerUser: function() {

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
            // this.$router.push('upload')
            self.outcome = 'success';
            self.success = jsonResponse.successMessage.message
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
            
        <div class="login-form center-block">
            <h2>Please Log in</h2>
            <div id = "message">
                <p class="alert alert-success" v-if="outcome === 'success'" id = "success"> {{ success }} </p>
                <ul class="alert alert-danger" v-if="outcome === 'failure'" id = "errors">
                    <li v-for="error in errors" class="news__item"> {{ error }}</li>
                </ul> 
            </div>
            <form id="loginForm"  @submit.prevent="loginUser" method="post">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input class="form-control" id="username" name="username" placeholder="Enter your username" type="text" value="">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input class="form-control" id="password" name="password" type="password" value="">
                </div>
                <button type="submit" name="submit" class="btn btn-primary btn-block">Log in</button>
            </form>
        </div>
  
    </div>
    `,
    data: function() {
        return {
          outcome: '',
          errors: [],
          success: ''
        }
    },
    methods: {
      loginUser: function() {

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
              self.errors = jsonResponse.loginError.errors;
              self.outcome = 'failure';
            } else {
              // this.$router.push('upload')
              self.outcome = 'success';
              self.success = jsonResponse.successMessage.message;
              jwt = jsonResponse.successMessage.token;
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
    <div class="container">
        <ul>
            <li v-for="post in posts">{{ post.caption }}</li>
        </ul>      
    </div>
    `,
    data: function() {
        return {
          posts: []
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
          self.posts = jsonResponse.posts.posts
          
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    methods: {}
  });

const logout = Vue.component('logout', {
    template: `          
    <div>User successfully logged out!</div>
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
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    methods: {}
  });


const userProfile = Vue.component('userProfile', {
    template: `          
    <div class="container">
        <p>{{ info.username }}</p>
        <ul>
            <li v-for="post in posts">{{ post.caption }}</li>
        </ul>      
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
      let user_id = this.$route.params.user_id;
      // console.log(user_id);

      //fetches the user's posts
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
          
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    methods: {}
});
  


const Home = Vue.component('home', {
   template: `
    <div class="jumbotron">
        <h1>Lab 7</h1>
        <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
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
        {path: "/users/:user_id", component: userProfile},
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
