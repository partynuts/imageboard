const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.use(express.static("./public"));

app.get("/cities", function(req, res) {
  res.json({
    data: {
      cities: [
        {
          name: "Berlin",
          country: "Germany"
        },
        {
          name: "Hamburg",
          country: "Germany"
        }
      ]
    }
  });
});

app.listen(8080, () => console.log("listening to port 8080"));
