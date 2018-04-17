const spicedPg = require("spiced-pg");
let db;

if (process.env.DATABASE_URL) {
  db = spicedPg(process.env.DATABASE_URL);
} else {
  db = spicedPg("postgres://postgres:postgres@localhost:5432/imageboard");
}

function displayImages(url, title) {
  return db
  .query(`SELECT * FROM images ORDER BY id DESC`)
}

exports.displayImages = displayImages;


function insertImageData(url, title, username, description) {
  return db
  .query(`INSERT INTO images (url, title, username, description) VALUES ($1, $2, $3, $4) Returning *`, [url, title, username, description])
}

exports.insertImageData = insertImageData;
