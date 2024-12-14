//jshint esversion:6

//npm modeules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

//initial configurations
let posts = [];

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Server started on port ${3000}`);
});

//all tasks
app.get("/", function (req, res) {
  res.render("home", { posts: posts });
});

//finding task by id
app.get("/TaskById", function (req, res) {
  res.render("TaskById");
});
app.post("/findById", function (req, res) {
  let found = 0;
  const title = req.body.title;
  posts.forEach(function (i) {
    if (_.lowerCase(i.title) === _.lowerCase(title)) {
      found = 1;
    }
  });
  if (found == 1) {
    res.redirect(`/posts/${title}`);
  } else {
    res.redirect("/TaskById");
  }
});

//deleting task by id
app.get("/deleteById", function (req, res) {
  res.render("Delete");
});
app.post("/deleteById", function (req, res) {
  let found = 0;
  let index;
  const title = req.body.title;
  for (let i = 0; i < posts.length; i++) {
    if (_.lowerCase(posts[i].title) === _.lowerCase(title)) {
      found = 1;
      index = i;
    }
  }
  if (found == 1) {
    posts.splice(index, 1);
    res.redirect("/");
  } else {
    res.redirect("/deleteById");
  }
});

//creating new task
app.get("/compose", function (req, res) {
  res.render("compose");
});
app.post("/compose", function (req, res) {
  console.log(req.body);
  const post = {
    title: req.body.title,
    post: req.body.post,
    status: req.body.status,
  };
  posts.push(post);
  res.redirect("/");
});

//task template
app.get("/posts/:logs", function (req, res) {
  posts.forEach(function (i) {
    if (_.lowerCase(i.title) === _.lowerCase(req.params.logs)) {
      res.render("post", { title: i.title, body: i.post, status: i.status });
    }
  });
});

//updating status of task
app.post("/update", function (req, res) {
  posts.forEach(function (i) {
    if (i.title === req.body.submit) {
      i.status = req.body.status;
    }
  });
  res.redirect(`/posts/${req.body.submit}`);
});
