//backend

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const {
  displayImages,
  insertImageData,
  displayComments,
  imageModal,
  insertComments
} = require("./db");

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const s3 = require("./s3");

const config = require("./config.json");

const diskStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname + "/uploads");
  },
  filename: function(req, file, callback) {
    uidSafe(24).then(function(uid) {
      //24 is the number of bytes --> size of the string. You can change it to another number if you want it bigger or smaller
      callback(null, uid + path.extname(file.originalname)); //extname will give the extension name of the uploaded file, i.e. png, img...
    });
  }
});

var uploader = multer({
  storage: diskStorage,
  limits: {
    //you can limit the size of the file, size of the file-name
    fileSize: 2097152 //limiting the files to 2 megabytes
  }
});

app.use(bodyParser.json());

app.use(express.static("./public"));

app.get("/images", function(req, res) {
  displayImages().then(function(results) {
    res.json({ images: results.rows }); //sending the info from server to client
  });
});

app.get("/", function(req, res) {});

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
  //single is a function that returns the middleware
  //the name 'file' is dependent on the name of the field you appended to the form data
  // If nothing went wrong the file is already in the uploads directory
  console.log("req.body:", req.body, "req.file:", req.file);
  if (req.file) {
    console.log("success!", req.file, "req.body:", req.body);
    const imageUrl = config.s3Url + req.file.filename;
    insertImageData(
      imageUrl,
      req.body.title,
      req.body.username,
      req.body.description
    ).then(function(result) {
      console.log(result);
      res.json({
        success: true,
        images: result.rows
        // data: {
        //   url: myAmazonUrl +  req.file.filename,
        // title: req.body.title
        // }
      });
    });
  } else {
    console.log("boo!");
    res.json({
      success: false
    });
  }
});

// var r2 = new Dateresult.rows[i].created_at
// r2.toLocaleDateString();

app.get("/comments/:currentImgId", function(req, res) {
  const curImgId = req.params.currentImgId;
  imageModal(curImgId)
    .then(function(results) {
      console.log(results.rows);
      results.rows.forEach(item => {
          let date = new Date (item.created_at);
          console.log(date.toLocaleDateString());
            item.created_at = date.toLocaleDateString();
      });
      console.log(results);
      displayComments(curImgId)
      .then(function(result) {
        console.log(result);
        result.rows.forEach(item => {
            let date = new Date (item.created_at);
            console.log(date.toLocaleDateString());
              item.created_at = date.toLocaleDateString();
        });
          res.json({ images: results.rows[0], comments: result.rows });

      })
      .catch(e => {
        console.log(e);
      });
    })
    .catch(e => {
      console.log(e);
    });
});

app.post("/comment", function(req, res) {
const {comment, user, curImgId} = req.body;
console.log(comment, user, curImgId);
  if (comment, user) {
    insertComments(comment, user, curImgId)
    .then(function( results) {
        console.log(results);
      res.json({
        success: true,
        comments: results.rows[0]
      });
    }).catch(e => {
      console.log(e);
    });
  } else {
    console.log("boo!");
    res.json({
      success: false
    });

  }
});



app.listen(8080, () => console.log("listening to port 8080 ImageBoard"));
