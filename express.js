const express = require('express');
const { ObjectId } = require('mongodb');
const mongo = require('mongodb').MongoClient;

const app=express();
const url="mongodb://localhost:27017/anime";
let db;

app.use(express.json());

mongo.connect(url,(err,client)=>{
    if(err)
        console.error(err);
    db=client.db('anime');

});

app.get("/anime/hype",(req,res)=>{
    sales=db.collection("Anime").find({"hype":10518}).toArray((err,doc)=>{
        if(err)
            console.error(err);
        res.status(200);
        res.send(JSON.stringify(doc))
    });
});
app.get("/anime",(req,res)=>{
    sales=db.collection("Anime").find({}).toArray((err,doc)=>{
        if(err)
            console.error(err);
        res.status(200);
        res.send(JSON.stringify(doc))
    });
});

app.get("/anime/:id",(req,res)=>{
    const id=req.params.id;
    sale=db.collection("Anime").findOne({studio:"Bones"})
    .then(data=>{
        if(!data)
            res.status(404).send({message: "movies details with id "+id+" not found"});
        else    
            res.send(data);
    })
    .catch(err=>{
        res.status(500);
        res.send({message: "Error reading movies details...."})

    })
});

app.post("/anime",(req,res)=>{
    const sale=req.body;
    sales=db.collection("Anime");
    sales.insertOne(sale,(err,result)=>{
        if(err)
        {
            console.error(err);
            res.status(500).json({err:err});
            return
        }
        console.log(result);
        res.status(200).json({ok:true})

    });

});

app.put("/Anime/:id",(req,res)=>{
    
    if(!req.body)
    {
        return res.status(400).send({message:"new Data to be update can not be blank.."});
    }
    const id=req.params.id;

    const studio=req.body.studio;
    const genres=req.body.genres;
    const hype=req.body.hype;
    const start_date=req.body.start_date;
    db.collection("Anime").updateOne({"_id":id},{$set: {"studio":studio,"genres":genres,"hype":hype,"start_date":start_date}})
    .then(data=>{
        res.status(200).send({message: "Record update successfully.."});
    }); 
});

app.delete("/Anime/:id",(req,res)=>{
    const id=req.params.id;
    db.collection("Anime").remove({"_id":id})
    .then((data)=>{

        if(!data)
           res.status().send({message: "Can not fine record with id : "+id+" to be deleted.."});
        else
            res.status(200).send({message:"Record with id "+id+" deleted successfully.."});
    });
});

app.listen(3000,()=>{
    console.log("Server Listening on 3000");
});