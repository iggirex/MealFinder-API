var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var DISHES_COLLECTION = "dishes";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

var db;
console.log("this is connection url: ", process.env.MONGODB_URI);

mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  db = database;
  console.log("Database connection ready");

  var server = app.listen(process.env.PORT || 8080, function() {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/dishes", function(req, res) {
  db.collection(DISHES_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get contacts.");
    } else {
      res.status(200).json(docs);
    }
  });
});

//-------------CONSTRUSCTION-------
app.get("/postDishes/:restrictions", function(req, res, next) {
  // res.send(req.params.restrictions)
  var filteredResult = db.collection(DISHES_COLLECTION).find({ tags: "paleo" && "vegan"}).toArray(function(err, docs) {
    res.status(200).json(docs);
  })
})
//---------------------------------

app.post("/dishes/:restrictions", function(req, res) {
  var filterByRestrictions = req.body.restrictions;
  // newDish.createDate = new Date();

  if (!(req.body.name || req.body.photoUrl)) {
    handleError(res, "Invalid user inpput", "Must provide a first or last name.", 400);
  }

  db.collection(DISHES_COLLECTION).insertOne(newDish, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new dish");
    } else {
      res.status(201).json(doc.ops[0])
    }
  })

});
//
// app.get("/dishes/:id", function(req, res) {
//
// });
//
// app.put("/dishes/:id", function(req, res) {
//
// });
//
// app.delete("/dishes/:id", function(req, res) {
//
// });
