// save environment variables in dotenv
require("dotenv").config();
const Gists = require("gists");
const fs = require("fs");

// express set up, handles request, response easily
const express = require("express");
const app = express();

// express session
const session = require("express-session");

// makes sending requests easy
const request = require("request");

// node core module, construct query string
const qs = require("querystring");

// node core module, parses url string into components
const url = require("url");

// generates a random string for the
const randomString = require("randomstring");

// random string, will be used in the workflow later
const csrfString = randomString.generate();

// setting up port and redirect url from process.env
// makes it easier to deploy later
const port = process.env.PORT || 3000;
const redirect_uri = process.env.HOST + "/redirect";

console.log("redirect uri", redirect_uri);
// const CLIENT_ID = "92bfb1aa190ee8615b78";
// const CLIENT_SECRET = "abf2ddacc8fcd671aa93c12f99dcb6145bf5edf5";

// serves up the contents of the /views folder as static
app.use(express.static("views"));
app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// initializes session
app.use(
  session({
    secret: randomString.generate(),
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

app.get("/", (req, res, next) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/login", (req, res, next) => {
  // generate that csrf_string for your "state" parameter
  req.session.csrf_string = randomString.generate();
  // construct the GitHub URL you redirect your user to.
  // qs.stringify is a method that creates foo=bar&bar=baz
  // type of string for you.
  const githubAuthUrl =
    "https://github.com/login/oauth/authorize?" +
    qs.stringify({
      client_id: process.env.CLIENT_ID,
      redirect_uri: redirect_uri,
      state: req.session.csrf_string,
      scope: "gist"
    });
  // redirect user with express
  res.redirect(githubAuthUrl);
});

app.listen(port, () => {
  console.log("Server listening at port " + port);
});

// Handle the response your application gets.
// Using app.all make sures no matter the provider sent you
// get or post request, they will all be handled
app.all("/redirect", (req, res) => {
  // Here, the req is request object sent by GitHub
  console.log("Request sent by GitHub: ");
  console.log(req.query);

  // req.query should look like this:
  // {
  //   code: '3502d45d9fed81286eba',
  //   state: 'RCr5KXq8GwDyVILFA6Dk7j0LbFNTzJHs'
  // }
  const code = req.query.code;
  const returnedState = req.query.state;

  if (req.session.csrf_string === returnedState) {
    // Remember from step 5 that we initialized
    // If state matches up, send request to get access token
    // the request module is used here to send the post request
    request.post(
      {
        url:
          "https://github.com/login/oauth/access_token?" +
          qs.stringify({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: code,
            redirect_uri: redirect_uri,
            state: req.session.csrf_string
          })
      },
      (error, response, body) => {
        // The response will contain your new access token
        // this is where you store the token somewhere safe
        // for this example we're just storing it in session
        console.log("Your Access Token: ");
        console.log(qs.parse(body));
        req.session.access_token = qs.parse(body).access_token;

        // Redirects user to /user page so we can use
        // the token to get some data.
        console.log("Rediecting");
        return res.redirect("http://localhost:3001/user");
        // res.send({ status: "success", value: "loggedin" });
      }
    );
  } else {
    // if state doesn't match up, something is wrong
    // just redirect to homepage
    // res.redirect("/");
    res.send({ status: "error", value: "loggedin" });
  }
});
app.get("/getAllGists", (req, res) => {
  fs.readFile("data.json", (err, data) => {
    if (err) {
      console.log("Error while reading access_token from json file.");
      return;
    }
    let result = JSON.parse(data);
    const gists = new Gists({
      token: result.access_token
    });
    // GET /gists/
    gists
      .list("nida-munir")
      .then(response => {
        // console.log("Successfully", response.body);
        let allGists = [];
        response.body.map(response => {
          const gist = new Object();
          const files = [];
          for (var member in response.files) {
            // console.log("Name: ", member);
            //console.log("Value: ", response.files[member]);
            files.push(member);
          }
          gist.id = response.id;
          gist.files = files;

          allGists.push(gist);
          //console.log(response.id);
        });
        return res.send({ status: "Success", gists: allGists });
      })
      .catch(console.error);
  });
});
app.post("/addGist", (req, res) => {
  // get gist name from body of the request
  const {
    body: { name }
  } = req;

  // read access token from json file
  fs.readFile("data.json", (err, data) => {
    if (err) {
      console.log("Error while reading access_token from json file.");
      return;
    }
    let result = JSON.parse(data);
    const gists = new Gists({
      token: result.access_token
    });
    const options = {
      description: "",
      public: true,
      files: {
        name: {
          content: "new gits created"
        }
      }
    };
    console.log(options);
    gists
      .create(options)
      .then(r => {
        console.log("Successfully created a new gist.");
        return res.send({ status: "Success" });
      })
      .catch(console.error);
  });
});
