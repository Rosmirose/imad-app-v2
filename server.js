var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var articles = {
  article1: {
    title: "Article 1| Rosmi Rehman",
    heading: "Article 1",
    date : 'Feb 9, 2017',
    content: `<p>
                Hello, paragraph 1 This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1
            </p>
            <p>
                Hello, paragraph 2  This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.
            </p>
            <p>
                Hello, paragraph 3 This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1
            </p>`
    },
  article2: {
    title: "Article 2| Rosmi Rehman",
    heading: "Article 2",
    date : 'Feb 9, 2017',
    content: `
    <p>
    Hello, paragraph 1 This is my content for artcile 2.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1
    </p>
    <p>
        Hello, paragraph 2  This is my content for artcile 2.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.
    </p>
    <p>
        Hello, paragraph 3 This is my content for artcile 2.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1
    </p>`
  },
  article3: {
    title: "Article 3| Rosmi Rehman",
    heading: "Article 3",
    date : 'Feb 9, 2017',
    content:
    `<p>
        Hello, paragraph 1 This is my content for artcile 3.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1
    </p>
    <p>
        Hello, paragraph 2  This is my content for artcile 3.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.
    </p>
    <p>
        Hello, paragraph 3 This is my content for artcile 3.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1.Hello This is my content for artcile 1
    </p>`
  }
};

function createTemplate(data) {
var title = data.title;
var date = data.date;
var heading = data.heading;
var content = data.content;
var htmlTemplate = `
    <html>
        <head>
            <title>
                ${title}
            </title>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link href="/ui/style.css" rel="stylesheet" />
        </head>
        <body>
          <div class="container">
            <div>
                <a href="/">Home</a>
            </div>
            <hr/>
            <h3>
                ${heading}
            </h3>
            <div>
                ${date}
            </div>
            <div>
               ${content}
            </div>
          </div>
        </body>
    </html>
    `;
 return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var counter = 0;
app.get('/counter', function(req,res) {
    counter = counter+1;
    res.send(counter.toString());
});

var names = [];
app.get('/submit-name?name', function(req, res){ 
  //get name from req object
  var name = req.query.name;
  names.push(name);
  res.send(JSON.stringify(names));
});

app.get('/:articleName', function(req, res) {
    var articleName = req.params.articleName;
    res.send(createTemplate(articles[articleName]));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
