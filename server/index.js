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
        const {
          id,
          description,
          public,
          createdAt,
          html_url,
          files
        } = response;
        const gist = {
          id,
          description,
          public,
          createdAt,
          html_url,
          filesCount: files.length
        };
        gists.push(gist);
      });
      return res.send(gists);
    })
    .catch(function(err) {
      console.log("Couldn't fetch gists.", err);
      return res.status(404).json({ error: "Gists not found" });
    });
});
// get all files of a gist by gist id
app.post("/api/files", (req, res) => {
  const {
    body: { token, id }
  } = req;
  const gists = new Gists({
    token: token
  });

  gists
    .get(id)
    .then(data => {
      const {
        body: { html_url, description, files: notes }
      } = data;
      let gist = { id, html_url, description };
      let files = [];
      for (var name in notes) {
        const { content, raw_url } = notes[name];
        let file = {
          name,
          content,
          raw_url
        };
        files.push(file);
      }
      gist.files = files;
      return res.send(gist);
    })
    .catch(err => {
      console.log("Not Found", err);
      return res.status(404).json({ error: "Not found" });
    });
});
// delete a gist by id
app.post("/api/deleteGist", (req, res) => {
  const {
    body: { token, id }
  } = req;
  const gists = new Gists({
    token: token
  });
  gists
    .delete(id)
    .then(response => {
      // send gist id back
      return res.send(id);
    })
    .catch(err => {
      return res.status(404).json({ error: "Gist couldn't be deleted." });
    });
});

app.post("/api/deleteFile", (req, res) => {
  const {
    body: { token, id, fileName }
  } = req;
  const gists = new Gists({
    token: token
  });
  // To delete a file, edit the gist and set filename to null
  const options = {
    files: { [fileName]: null }
  };
  gists
    .edit(id, options)
    .then(response => {
      // Send deleted file name
      return res.send(fileName);
    })
    .catch(err => {
      return res.status(404).json({ error: "File couldn't be deleted." });
    });
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
// Edit a gist name (description)
app.post("/api/editGist", (req, res) => {
  const {
    body: { token, id, description }
  } = req;
  const gists = new Gists({
    token: token
  });
  // Send updated description/name in options
  const options = {
    description
  };
  gists
    .edit(id, options)
    .then(response => {
      // Send updated gist id
      return res.send(id);
    })
    .catch(err => {
      return res.status(404).json({ error: "Gist name couldn't be updated." });
    });
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
