var http = require("http");
var path = require("path");
var fs = require("fs"); 	

function getMainPage(res)
{
    var now = new Date();

    var filename = '/../../HtmlProject/MainPage.html';
    var ext = path.extname(filename);
    var localPath = __dirname;
    var validExtensions = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".txt": "text/plain",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".png": "image/png"
    };
    var isValidExt = validExtensions[ext];

    if (isValidExt) {

        localPath += filename;
        fs.exists(localPath, function (exists) {
            if (exists) {
                console.log("Serving file: " + localPath);
                getFile(localPath, res, isValidExt);
            } else {
                console.log("File not found: " + localPath);
                res.writeHead(404);
                res.end();
            }
        });

    } else {
        console.log("Invalid file extension detected: " + ext)
    }
}

function getFile(localPath, res, mimeType) {
    fs.readFile(localPath, function (err, contents) {
        if (!err) {
            res.setHeader("Content-Length", contents.length);
            res.setHeader("Content-Type", mimeType);
            res.statusCode = 200;
            res.end(contents);
        } else {
            res.writeHead(500);
            res.end();
        }
    });
}

exports.getMainPage = getMainPage;