var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();
var config = {
    user: 'rosmirose',
    database: 'rosmirose',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
  secret: 'someRandomValue',
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}
}));
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
                ${date.toDateString()}
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

function hash(input, salt) {
  var hashed = crypto.pbkdf2Sync(input, salt, 10, 512, 'sha512');
  return ["pbkdf2", 10, salt, hashed.toString('hex')].join('$');
}
app.get('/hash/:input', function(req, res) {
  var hashedString = hash(req.params.input, 'this-is-some-random-string');
  res.send(hashedString);
});

app.post('/create-user', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var salt = crypto.randomBytes(128).toString('hex');
  var dbString = hash(password, salt);
  pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function(err, result) {
     if(err) {
        res.status(500).send(err.toString());
      } else {
        res.send(JSON.stringify(result.rows)); 
      } 
  });
});

app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
 
  pool.query('SELECT * FROM "user"  WHERE username = $1', [username], function(err, result) {
     if(err) {
        res.status(500).send(err.toString());
      } else {
          if(result.rows.length === 0) {
             res.status(403).send("username/password is incorrect");
          } else {
            var dbString = result.rows[0].password;
            var salt = dbString.split('$')[2];
            var hashedPassword = hash(password, salt);
            if (hashedPassword === dbString) {
                
              req.session.auth = {userId: result.rows[0].id};
              console.log(req.session.auth)
              //session middle ware set a cookie with session id - {auth: {userId}}
              res.status(200).send("user succesfully logged in");
            } else {
              res.status(403).send("username/password is incorrect");
            }
          }
      } 
  });  
});

app.get('/check-login', function(req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       res.send("You are logged in");
   } else {
       res.send("Not logged in");
   }
});

app.get('/logout', function(req,res) {
  delete req.session.auth;
  res.send("Logged Out");
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var counter = 0;
app.get('/counter', function(req,res) {
    counter = counter+1;
    res.send(counter.toString());
});

var names = [];

var pool = new Pool(config);

app.get('/test-db', function (req, res) {
  // make a select request
  pool.query('SELECT * FROM test', function(err, result) {
      if(err) {
        res.status(500).send(err.toString());
      } else {
        res.send(JSON.stringify(result.rows)); 
      }
  });
      
  
  // return response with the results
});

app.get('/submit-name', function(req, res) { 
  //get name from req object
  var name = req.query.name;
  names.push(name);
  res.send(JSON.stringify(names));
});

app.get('/articles/:articleName', function(req, res) {
    // var articleName = req.params.articleName;
    // res.send(createTemplate(articles[articleName]));
    
    pool.query("SELECT * FROM article where title = $1",[req.params.articleName], function(err, result) {
      if(err) {
        res.status(500).send(err.toString(err));
      } else {
        if (result.rows.length === 0) {
          res.status(404).send("Article Not Found"); 
        } else {
            var articleData = result.rows[0];
            res.send(createTemplate(articleData));
        }
      }
    });
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
//   console.log(`IMAD course app listening on port ${port}!`);
});
