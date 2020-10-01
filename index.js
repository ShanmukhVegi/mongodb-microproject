var express=require("express");
const bodyParser = require("body-parser");
var app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
var collection;
const MongoClient=require('mongodb').MongoClient;

const url='mongodb://127.0.0.1:27017';

const dbName='myhospital';
let server=require('./server');
let middleware=require('./middleware');
const { request, response } = require("express");
let db,db1
app.listen(3000,()=>{
MongoClient.connect(url,{useNewUrlParser: true},(err,client)=>{
    if(err) return console.log(err);

    db=client.db(dbName);
    collection=db.collection("myhospital");
    db1=client.db("myventilators");
    collection1=db1.collection("myventilaors");
    console.log(`connected database: ${url}`);
    console.log(`Database: ${dbName}`);
});
});

app.get("/myhospital",middleware.checkToken,(request,response)=>{
    collection.find({}).toArray((error,result)=>{
        if(error){return response.send("An error occured");}
        response.send(result);
    });

});

app.get("/myventilators",middleware.checkToken,(request,response)=>{
    collection1.find({}).toArray((error,result)=>{
        if(error){return response.send("An error occured");}
        response.send(result);
    });

});

app.post("/myhospital",middleware.checkToken,(request, response) => {
    collection.insert(request.body, (error, result) => {
        if(error) {
            return response.send(error);
        }
        response.send(result.result);
    });
});

app.post("/myventilators",middleware.checkToken,(request, response) => {
    collection1.insert(request.body, (error, result) => {
        if(error) {
            return response.send(error);
        }
        response.send(result.result);
    });
});

app.get("/myhospital/hname",middleware.checkToken,(request,response)=>{ //name
    collection.find({name:new RegExp(request.body.name,"i")}).toArray(function(err,result){
        if(err) throw err;
        response.send(result);
    });
});


app.get("/myventilators/hname",middleware.checkToken,(request,response)=>{ //name
    collection1.findOne({"name":request.body.name},(error,result)=>{
        if(error) return response.send(error);
        response.send(result);
    });
});

app.get("/myventilators/",middleware.checkToken,(request,response)=>{ //stat
    collection1.find({"status":request.body.stat}).toArray(function(error,result){
        if(error) throw error;

        response.send(result);
    });
});

app.put("/myventilators/",middleware.checkToken,(request,response)=>{ //vid,status
    collection1.updateOne({"vid":request.body.vid},{$set:{"status":request.params.status}},function(err,result){
        if(err) throw err;
        response.send("Updated the record");
    });
});


app.delete("/myventilators",middleware.checkToken,(request,response)=>{ //vid
    collection1.remove({"vid":request.body.vid},function(err,result){
        if(err) response.send("cannot find "+request.params.vid);
        response.send("deleted successfully");
    });
});

app.delete("/myhospital",middleware.checkToken,(request,response)=>{ //name
    collection.remove({"name":request.body.name},function(err,result){
        if(err) response.send("cannot find "+request.params.vid);
        response.send("deleted successfully");
    });
});
