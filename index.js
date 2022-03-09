var express = require('express');
var app = express();
app.get('/', function (req, res) {  
    res.send('Hello World')  
  }); 
app.get('/dodaj', function (req, res) {
    let a =Number(req.query.num1);
    let b =Number(req.query.num2);
    a=2;
    b=3;
    let result = a+b;
    res.send(`Wynik dodawania ${result}`);
    
});
app.get('/usun', function (req, res) {
    let a =Number(req.query.num1);
    let b =Number(req.query.num2);
    a=4;
    b=2;
    let result = a-b;
    res.send(`Wynik odejmowania ${result}`);
    
});
app.get('/mnozenie', function (req, res) {
    let a =Number(req.query.num1);
    let b =Number(req.query.num2);

    a=4;
    b=5;
    let result = a*b;
    res.send(`Wynik mnożenia ${result}`);
    
});
app.get('/dzielenie', function (req, res) {
    let a =Number(req.query.num1);
    let b =Number(req.query.num2);
    a=6;
    b=2;
    let result = a/b;
    res.send(`Wynik dzielenia ${result}`);
    
});

app.listen(3000);
