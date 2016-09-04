
var dummyData = [
  {
    'id':1,
    'title': 'Kitchen',
    'electric': 20,
    'co2': 40,
    'costs': 100,
    'water': 300,
    'gas': 120,
  },
  {
    'id':2,
    'title': 'WC',
    'electric': 25,
    'co2': 42,
    'costs': 102,
    'water': 200,
    'gas': 100,
  },
  {
    'id':3,
    'title': 'bedroom 1',
    'electric': 20,
    'co2': 40,
    'costs': 100,
    'water': 300,
    'gas': 120,
  },
  {
    'id':4,
    'title': 'bedroom 2',
    'electric': 20,
    'co2': 40,
    'costs': 100,
    'water': 300,
    'gas': 120,
  },
  {
    'id':5,
    'title': 'Living room',
    'electric': 20,
    'co2': 40,
    'costs': 100,
    'water': 300,
    'gas': 120,
  }
];

var overallConsumption = [
  {
    "name": "Box-Developers",
    "value": 50,
    "type": "overall"
  },
  {
    "name": "Box-WC1",
    "value": 5,
    "type": "overall"
  },
  {
    "name": "Box-WC2",
    "value": 0,
    "type": "overall"
  },
  {
    "name": "Box-WC3",
    "value": 5,
    "type": "overall"
  },
  {
    "name": "Box-Designers",
    "value": 30,
    "type": "overall",
  },
  {
    "name": "Box-Meeting",
    "value": 10,
    "type": "overall"
  }
];

var fs = require('fs');
var jsonData = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'));

var http = require('http'),
     express = require('express');

var app = express();

var index = fs.readFileSync('../index.html');

 app.set('port', process.env.PORT || 3000);

 app.get('/', function (req, res) {
   res.writeHead(200, {'Content-Type': 'text/html'});
   res.end(index);
 });

 app.get('/measures', function (req, res) {
   res.send(JSON.stringify(dummyData));
 });

 app.get('/overall-consumption', function (req, res) {
   res.send(JSON.stringify(overallConsumption));
 });

 app.get('/year-comsumption/:year', function (req, res){
   var year = req.params.year;
   var data;
   for (var i = 0; i < jsonData.years.length; i++) {
     if(jsonData.years[i].year == year){
       data = jsonData.years[i].data;
       break;
     }
   }
   res.send(JSON.stringify(data));
 });

 app.get('/all-consumption', function (req, res) {
   res.send(jsonData);
 });

 app.get('/measure/:id', function (req, res) {
  var id = req.params.id;
  var element = null;
  for(var i = 0; i < dummyData.length; i++){
    if(dummyData[i].id == id){
      element = dummyData[i];
      break;
    }
  }

  if(element != null)
    res.send(JSON.stringify(element));
  else
    res.send('Element not found');
 });

 http.createServer(app).listen(app.get('port'), function(){
   console.log('Express server listening on port ' + app.get('port'));
 });
