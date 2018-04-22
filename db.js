const spicedPg = require("spiced-pg");
let db;

if (process.env.DATABASE_URL) {
  db = spicedPg(process.env.DATABASE_URL);
} else {
  db = spicedPg("postgres://postgres:postgres@localhost:5432/imageboard");
}

function displayImages(url, title) {
  return db
  .query(`SELECT * FROM images ORDER BY id DESC LIMIT 6`)
}

exports.displayImages = displayImages;

function displayMoreImages(lastImgId ) {
  return db
  .query(`SELECT * FROM images WHERE id<$1 ORDER BY id DESC LIMIT 6`, [lastImgId])
}

exports.displayMoreImages = displayMoreImages;

function insertImageData(url, title, username, description) {
  return db
  .query(`INSERT INTO images (url, title, username, description)
  VALUES ($1, $2, $3, $4) Returning *`, [url, title, username, description])
}

exports.insertImageData = insertImageData;


function insertComments(username, comment, image_id) {
  return db
  .query(`INSERT INTO comments (username, comment, image_id)
  VALUES ($1, $2, $3)
  Returning *`, [username, comment, image_id])
}

exports.insertComments = insertComments;


function displayComments(image_id) {
  return db
  .query(`SELECT *
    FROM comments
    WHERE image_id = $1
    ORDER BY created_at DESC`, [image_id])
}

exports.displayComments = displayComments;

function imageModal(id) {
  return db
  .query(`SELECT *
    FROM images
    WHERE id = $1`, [id])
}

exports.imageModal = imageModal;

function insertLikes(likes, image_id) {
  return db
  .query(`INSERT INTO likes (likes, image_id)
  VALUES ($1, $2)
  Returning *`, [likes, image_id])
}

exports.insertLikes = insertLikes;

function displayLikes(image_id) {
  return db
  .query(`SELECT SUM (likes) AS total
    FROM likes
    WHERE image_id = $1`, [image_id])
}

exports.displayLikes = displayLikes;
