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
