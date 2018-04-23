DROP TABLE IF EXISTS likes;

CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  likes INTEGER,
  image_id INTEGER REFERENCES images(id) NOT NULL
);