/* eslint-env node, es6 */
/*
{
  "name": "Simba",
  "id": 1,
  "age": 3,
  "pride": "the cool cats",
  "gender": "male",
  "lastUpdated": Date.now()
}*/
const express = require('express');
const bodyParser = require('body-parser');
var _ = require("lodash");
var port = process.env.PORT || 3000;
//var fs = require('fs');

let app = express();

//the client folder is the frontend, content is automatically served if no route is present
app.use(express.static("client"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//var cors = require("cors");//should do the same?
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");//OPTIONS
  next();
});

//var indexHTML = fs.readFileSync(__dirname+"/lions.html", "utf-8")

let lions = [{
  "name": "Simba",
  "id": 1,
  "age": 3,
  "pride": "the cool cats",
  "gender": "male",
  "lastUpdated":Date.now()
}];
let counter=lions.length;
/*
app.get('/', function(req, res){
    res.send(indexHTML); 
    
});*/

/*"GET /lions": {
    "desc": "returns all lions",
    "response": "200 application/json",
    "data": [{}, {}, {}]
  }*/
app.get('/lions', function(req, res) {
  // send back a json response
  res.json(lions);
});
/*"GET /lions/:id": {
    "desc": "returns one lion respresented by its id",
    "response": "200 application/json",
    "data": {}
  },*/
  
app.get('/lions/:id(\\d+)', function(req, res) {//(\\d+) not needed, but it's cool
  let lion = _.find(lions, {id: parseInt(req.params.id)});
  //res.json(req.params.id)
  res.json(lion);//TODO handle undefined?
});


//routes: http://expressjs.com/en/guide/routing.html
app.get('/lions/:key/:id(\\d+)', function(req, res) {
  console.log(req.params.key, req.params.id);//virker
  res.json(req.params);
});
app.get('/lions/gender/:gender', function(req,res){
  let result = lions.filter(l=>l.gender === req.params.gender);
  res.json(result);
});
/*"POST /lions": {
    "desc": "create and returns a new lion uisng the posted object as the lion",
    "response": "201 application/json",
    "data": {}
  },*/
app.post('/lions', function(req, res) {
  let lion = req.body;
  counter++;
  lion.id=counter+"";
  lion.lastUpdated=Date.now()
  lions.push(lion);
  // res.send converts to json as well
  // but req.json will convert things like null and undefined to json too although its not valid
  //http://expressjs.com/en/api.html#res.send
  res.send(lion);//seems like it accepts only one param [todos, todo]
});

/*"PUT /lions/:id": {
    "desc": "updates and returns the matching lion with the posted update object",
    "response": "200 application/json",
    "data": {}
  },*/
app.put('/lions/:id', function(req, res) {
  //const lion = _.find(lions, {id: parseInt(req.params.id)});
  const index = lions.findIndex(i => i.id == req.params.id);
  lions[index]=req.body;
  lions[index].lastUpdated=Date.now();
  lions[index].id=req.params.id;
  res.json(lions[index]);
});
/*"DELETE /lions/:id": {
    "desc": "deletes and returns the matching lion",
    "response": "200 application/json",
    "data": {}
  }*/
app.delete('/lions/:id', function(req, res) {
  const index = lions.findIndex(i => i.id == req.params.id);
  if(index===-1){
    res.send();//TODO unused og vil jeg hellere ha et objekt?
  }
  res.json(lions.splice(index,1)[0]);
});
// start server on port 3000 or env
app.listen(port);
