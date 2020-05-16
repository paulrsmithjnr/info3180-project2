/* Add your Application JavaScript */
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
            <form id="loginForm"  action="/login" method="post">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input class="form-control" id="username" name="username" placeholder="Enter your username" required type="text" value="">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input class="form-control" id="password" name="password" required type="password" value="">
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

const uploadForm = Vue.component('upload-form', {
    template: `
        <div id="uploadFormDiv">
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

                  <button type="submit" name="submit" id="uploadButton">Upload</button>

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
        fetch("/api/upload", {
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
        {path: "/upload", component: uploadForm},
        {path: "/login", component: loginForm},
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});
