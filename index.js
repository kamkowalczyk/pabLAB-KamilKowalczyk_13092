var express = require('express');
var app = express();
app.get('/', function (req, res) {  
    res.send('Hello World')  
  }); 
app.get('/dodaj/:num1/:num2', function (req, res) {
    const a =Number(req.params.num1);
    const b =Number(req.params.num2);
    //a=2;
    //b=3;
    let result = a+b;
    res.send(`Wynik dodawania ${result}`);
    
});
//http://localhost:3000/dodaj?num1=5&num2=10operation=dodaj
app.get('/odejmowanie/:num1/:num2', function (req, res) {
    const a =Number(req.params.num1);
    const b =Number(req.params.num2);
   // a=4;
    //b=2;
    let result = a-b;
    res.send(`Wynik odejmowania ${result}`);
    
});
// app.get('/mnozenie', function (req, res) {
//     const a =Number(req.query.num1);
//     const b =Number(req.query.num2);

//    // a=4;
//    // b=5;
//     let result = a*b;
//     res.send(`Wynik mnożenia ${result}`);
    
// });
app.get('/mnozenie/:num1/:num2', function (req, res) {
    const a =Number(req.params.num1);
    const b =Number(req.params.num2);

   // a=4;
   // b=5;
    let result = a*b;
    res.send(`Wynik mnożenia ${result}`);
    
});
app.get('/dzielenie/:num1/:num2', function (req, res) {
    const a =Number(req.params.num1);
    const b =Number(req.params.num2);
   // a=6;
   // b=2;
    let result = a/b;
    res.send(`Wynik dzielenia ${result}`);
    
});

app.listen(3000);
