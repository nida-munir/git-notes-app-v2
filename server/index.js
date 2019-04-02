const axios = require("axios");
const Gists = require("gists");
// save environment variables in dotenv
require("dotenv").config();

const express = require("express");
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
// add headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.listen(port, () => {
  console.log(">>> 🌎 Node Server is running at http://localhost:" + port);
});

// get all gists by username
app.post("/api/gists", (req, res) => {
  const {
    body: { token, username }
  } = req;
  const gists = new Gists({
    token: token
  });

  gists
    .list(username)
    .then(response => {
      let gists = [];

      response.body.map(response => {
        const gist = new Object();
        // const files = [];
        // get files count, member == filename
        // for (var member in response.files) {
        //   files.push(member);
        // }
        gist.id = response.id;
        gist.filesCount = Object.keys(response.files).length;
        gist.description = response.description;
        gist.public = response.public;
        gist.createdAt = response.created_at;
        gist.html_url = response.html_url;
        gists.push(gist);
      });
      return res.send(gists);
    })
    .catch(function(err) {
      console.log("Couldn't fetch gists.", err);
      return res.status(400).json({ error: "Gists not found" });
    });
});
app.post("/api/files", (req, res) => {
  // get gist name from body of the request
  const {
    body: { token, id }
  } = req;

  const gists = new Gists({
    token: token
  });

  gists
    .get(id)
    .then(data => {
      let gist = new Object();
      gist.id = id;
      gist.html_url = data.body.html_url;
      gist.description = data.body.description;
      let files = [];
      for (var member in data.body.files) {
        let file = new Object();
        file.name = member;
        file.content = data.body.files[member].content;
        file.raw_url = data.body.files[member].raw_url;
        files.push(file);
      }
      gist.files = files;
      // console.log("gist", gist);
      return res.send(gist);
    })
    .catch(err => {
      return res.status(400).json({ error: "Not found" });
      console.log("Not Found");
    });
});

app.post("/api/deleteGist", (req, res) => {
  const {
    body: { token, id }
  } = req;
  const gists = new Gists({
    token: token
  });

  gists
    .delete(id)
    .then(r => {
      return res.send(id);
    })
    .catch(console.error);
});

app.post("/api/deleteFile", (req, res) => {
  const {
    body: { token, id, fileName }
  } = req;
  const gists = new Gists({
    token: token
  });
  console.log("body", req.body);
  const options = {
    files: { [fileName]: null }
  };
  console.log("options:", options);
  gists
    .edit(id, options)
    .then(res => {
      console.log("RESPONSE:", res.body);
    })
    .then(r => {
      console.log("Successfully deleted a gist.");
      return res.send(fileName);
    })
    .catch(console.error);
});
app.post("/api/editFiles", (req, res) => {
  const {
    body: { token, id, updatedFileName, fileContent, oldFileName }
  } = req;
  const gists = new Gists({
    token: token
  });
  console.log("req body...", req.body);
  const options = {
    files: {
      [oldFileName]: {
        content: fileContent,
        filename: updatedFileName
      }
    }
  };
  console.log("options: ", options);
  gists
    .edit(id, options)
    .then(response => {
      console.log("Successfully edited a gist.");
      const file = {
        name: updatedFileName,
        content: fileContent,
        raw_url: ""
      };
      return res.send(file);
    })
    .catch(console.error);
});

app.post("/api/editGist", (req, res) => {
  const {
    body: { token, id, description }
  } = req;
  const gists = new Gists({
    token: token
  });
  const options = {
    // files: { [fileName]: null }
    description
  };
  gists
    .edit(id, options)
    .then(r => {
      console.log("Successfully updated gist.");
      return res.send(id);
    })
    .catch(console.error);
});

app.post("/api/createGist", (req, res) => {
  // get gist name from body of the request
  const {
    body: { token, name }
  } = req;
  console.log("token: ", token);
  const gists = new Gists({
    token: token
  });
  const options = {
    description: name,
    public: true,
    files: {
      [name]: {
        content: name
      }
    }
  };
  console.log(options);
  gists
    .create(options)
    .then(response => {
      const {
        body: { id, description, public, created_at, html_url, files }
      } = response;
      console.log("Successfully created a new gist.");
      const gist = new Object();
      gist.id = id;
      gist.description = description;
      gist.public = public;
      gist.createdAt = created_at;
      gist.html_url = html_url;
      gist.filesCount = Object.keys(files).length;
      // ramda
      return res.send(gist);
    })
    .catch(console.error);
});

app.post("/api/getUser", (req, res) => {
  const {
    body: { token = "" }
  } = req;
  const url = `https://api.github.com/user?access_token=${token}`;
  axios
    .get(url)
    .then(function(response) {
      const { login, avatar_url } = response.data;
      return res.send({
        username: login,
        avatar_url
      });
    })
    .catch(function(err) {
      console.log("Couldn't fetch user profile.", err);
    });
});
