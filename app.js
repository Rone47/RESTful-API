const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true 
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/WikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
    title:String,
    content: String
};

const Article = mongoose.model('Article', articleSchema);

////Request Targeting All Articles////////////////////////////////////////////

app.route('/articles')
.get(async function (req, res) {
    try {
      const foundArticles = await Article.find();
      console.log(foundArticles);
      res.json(foundArticles);
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred.");
    }
  })
  
.post(async function (req, res) {
    console.log();
    console.log();
  
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
  
    try {
      await newArticle.save();
      res.send("Successfully added a new article.");
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred.");
    }
  })
  
.delete(async function (req, res) {
    try {
      const result = await Article.deleteMany();
      if (result.deletedCount > 0) { 
        res.send("Successfully deleted all articles.");
      } else {
        res.status(500).send("No articles found to delete.");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred.");
    }
});

////////////// Request Targeting Specific Articles ////////////////////////////////////////////

app.route('/articles/:articleTitle')

.get(async function (req, res) {
    try {
        const foundArticle = await Article.findOne({ title: req.params.articleTitle });
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No articles matching that title were found.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred.");
    }
})

.put(async function (req, res) {
    try {
        const filter = { title: req.params.articleTitle };
        const update = { title: req.body.title, content: req.body.content };

        const result = await Article.updateMany(filter, update);

        if (result.nModified > 0) {
            res.send("Successfully updated article.");
        } else {
            res.send("Successfully updated article."); 
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred.");
    }
})

.patch(async function (req, res) {
    try {
      const filter = { title: req.params.articleTitle };
      const update = { $set: req.body };

      const result = await Article.updateOne(filter, update);

      if (result.nModified > 0) {
        res.send("Successfully updated article.");
      } else {
        res.send("Article successfully updated.");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred.");
    }
})

.delete(async function (req, res) {
    try {
        const result = await Article.deleteOne({ title: req.params.articleTitle });
        if (result.deletedCount > 0) {
            res.send("Successfully deleted the corresponding article.");
        } else {
            res.status(404).send("No article matching that title was found.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred.");
    }
});



app.listen(5000, function () {
    console.log('listening on port 5000');
});