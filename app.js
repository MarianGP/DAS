const fs = require('fs');
const http = require('http');

const path = require('path');
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const port = 8080
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    var allPasswords;
    res.set('X-Frame-Options', 'DENY');
    res.render("index",
        { data: { pass_length: 0, numb_rows: 0 }, allPasswords }
        );
})

app.post('/', urlencodedParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);
    var setUp = req.body;

    if(req.body.pass_length > 30 || req.body.alphabet.length > 30) {
        res.status(500).send( { message : "Length of input exceeds allowed standard"});
        return;
    }

    var allPasswords = [];
    for (let i = 0; i < req.body.numb_rows; i++) {
        let newPass = generatePassword(setUp);
        allPasswords.push(newPass)
        console.log("new password: " + newPass);
    }

    res.set('X-Frame-Options', 'DENY');
    res.render("index",
        { data: { pass_length: req.body.pass_length, numb_rows: req.body.numb_rows }, allPasswords }
        );
})

app.get('*', function(req, res){
        res.sendFile(path.join(__dirname+'/public/404.ejs'));
    res.status(404).send('What?');
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

function generatePassword(setUp) {
    var length = setUp.pass_length,
        alphabet = setUp.alphabet,
        retVal = "";
    for (var i = 0, n = alphabet.length; i < length; ++i) {
        retVal += alphabet.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}


// const server = http.createServer((req, res) => {
//
//     let file_path = path.join(
//         __dirname,
//         "public",
//         req.url === "/" ? "index.ejs" : req.url
//     );
//     console.log(file_path);
//
//     let ext_name = path.extname(file_path);
//     let content_type = "text/html";
//
//     switch (ext_name) {
//         case ".jpg":
//             content_type = "image/jpg";
//             break;
//         case ".js":
//             content_type = "text/javascript";
//             break;
//         case ".json":
//             content_type = "application/json";
//             break;
//         case ".css":
//             content_type = "text/css";
//             break;
//         case ".png":
//             content_type = "image/png";
//             break;
//         case ".ico":
//             content_type = "image/x-icon";
//             break;
//     }
//
//
//     if (content_type === "text/html" && ext_name === "") file_path += ".ejs";
//
//     fs.readFile(file_path, (err, content) => {
//         if (err) {
//             if (err.code === "ENOENT") { // url not found
//                 fs.readFile(
//                     path.join(__dirname, "public", "404.ejs"),
//                     (err, content) => {
//                         res.writeHead(404, { "Content-Type": "text/html" });
//                         res.end(content, "utf8");
//                     }
//                 );
//             } else {
//                 res.writeHead(500);
//                 res.end(`Server Error: ${err.code}`);
//             }
//         } else {
//             res.writeHead(200, { "Content-Type": content_type });
//             res.end(content, "utf8");
//         }
//     });
// });
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// console.log("hello!");
// res.sendFile(path.join(__dirname+'/index.ejs'), { title: "Hey", message: "Hello there!" });


