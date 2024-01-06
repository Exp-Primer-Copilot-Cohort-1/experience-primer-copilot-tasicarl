// Create web server application

var http = require('http');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');
var comments = require('./comments');

// Create server
http.createServer(function (req, res) {
    // Get URL path
    var path = url.parse(req.url).pathname;

    // Get query string
    var query = url.parse(req.url).query;
    var params = querystring.parse(query);

    // Route
    if (path == '/comments') {
        if (req.method == 'GET') {
            // Get comments
            var data = comments.getComments();
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(data));
        } else if (req.method == 'POST') {
            // Create comment
            var data = '';
            req.on('data', function (chunk) {
                data += chunk;
            });
            req.on('end', function () {
                data = JSON.parse(data);
                comments.createComment(data);
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(data));
            });
        }
    } else {
        // Serve static files
        if (path == '/') {
            path = '/index.html';
        }
        fs.readFile(__dirname + path, function (err, data) {
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify(err));
                return;
            }
            res.writeHead(200);
            res.end(data);
        });
    }
}).listen(8080, 'localhost');