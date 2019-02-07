var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");


var axios = require("axios");
var cheerio = require("cheerio");


var db = require("./models");

var PORT = 3000;


var app = express();




app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));


mongoose.connect("mongodb://localhost/baseballdb", { useNewUrlParser: true });




app.get("/scrape", function(req, res) {

  var url = "https://community.sportsengine.com/page/show/3539358?match_option=0&news_aggregator=1626264&tags=3598031";
//   var urlTwo = "https://community.sportsengine.com/page/show/3539358?match_option=0&news_aggregator=1626264&page=2&tags=3598031";
//   var urlThree = "https://community.sportsengine.com/page/show/3539358?match_option=0&news_aggregator=1626264&page=3&tags=3598031";
  
  axios.get(url).then(function(response) {
    
    var $ = cheerio.load(response.data);

    
    // $("h4").each(function(i, element) {
      
    //   var result = {};

    //   result.pic = $(this)
    //   result.title = $(this)
    //     .children("a")
    //     .text();
    //   result.link = $(this)
    //     .children("a")
    //     .attr("href");

    $("div.articleHasImage").each(function(i, element) {
      
        var result = {};
  
    
        result.image = $(this)
          .children("a")
          .children("img")
          .attr("src");

          result.title = $(this)
            .children("h4")
            .text();

          result.link = $(this)
            .children("h4")
            .children("a")
            .attr("href");

          console.log("---------------")
          console.log(result)
          console.log("---------------")

      
      db.Article.create(result)
        .then(function(dbArticle) {
          
          console.log(dbArticle);
        })
        .catch(function(err) {
          
          return res.json(err);
        });
    });

    
    res.send("Scrape Complete");
  });
});


app.get("/articles", function(req, res) {

  db.Article.find({})
    .then(function(dbArticle) {
      
      res.json(dbArticle);
    })
    .catch(function(err) {
      
      res.json(err);
    });
});


app.get("/articles/:id", function(req, res) {
 
  db.Article.findOne({ _id: req.params.id })
    
    .populate("note")
    .then(function(dbArticle) {
     
      res.json(dbArticle);
    })
    .catch(function(err) {
      
      res.json(err);
    });
});


app.post("/articles/:id", function(req, res) {
  
  db.Note.create(req.body)
    .then(function(dbNote) {
   
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      
      res.json(dbArticle);
    })
    .catch(function(err) {
     
      res.json(err);
    });
});


app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});