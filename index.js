const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const app = express();

const db= new sqlite3.Database("./movies.db", sqlite3.OPEN_READWRITE, (err)=>{
    if(err){return console.log("Error: "+ err)}
    console.log("Succesfull connection to data base");
    db.run("CREATE TABLE movie(name VARCHAR(255) NOT NULL PRIMARY KEY, rating FLOAT, review TEXT)",(err)=>{
        if(err){
            return console.log("Error Creating Table: "+ err);
        }
    });
});

app.use(express.json());

//A Error Handling Middleware
app.use('/addMovie', (error, request, response, next)=>{
    if(error instanceof SyntaxError){
        response.status(400).send({error:"Invalid Request Body"});
    }
    else{
        next();
    }
});

app.use('/addMovie', (request, response, next)=>{
    const {name=null, rating=0.0, review=""} = request.body;
    if(name===null){
        response.status(400).send({error:"Invalid Request Body: Movie Name should be Present"});
    } 
    else if(rating>10 || rating<0){
        response.status(400).send({error:"Invalid Request Body: rating should be in the bounds of 0 and 10"});
    }
    else{
        next();
    }
});

app.use('/update/movie/:name', (request, response, next)=>{
    const {rating} = request.body;
    if(rating>10 || rating<0){
        response.status(400).send({error:"Invalid Request Body: rating should be in the bounds of 0 and 10"});
    }
    else{
        next();
    }
});

app.post('/addMovie/', (request, response)=>{
    const {name, rating=0.0, review=""} = request.body;
    const query = "INSERT INTO movie(name, rating, review) VALUES(?,?,?)";
    db.run(query, [name, rating, review], (err)=>{
        if(err){
            response.status(400);
            let msg;
            if(err.code==="SQLITE_CONSTRAINT"){
                msg=`Movie name ${name} is already present`;
            }
            response.send({error:msg});
        }
        else{
            response.status(200).send("Successfully Added");
        }
    })
});

app.get('/movies', (request, response)=>{
    const {search="", review="", ratingGreaterThan=0, ratingLessThan=11}=request.query;
    const query = `SELECT * FROM movie WHERE name LIKE '%${search}%' AND review LIKE '%${review}%' AND rating>${ratingGreaterThan} AND rating<${ratingLessThan}`;
    db.all(query, (err, res)=>{
        if(err){
            return response.status(500).send();
        }
        response.status(200).send(res);
    });
    
});

app.get('/movie/:name', (request, response)=>{
    const { name } = request.params; 
    const query = "SELECT * FROM movie WHERE name=?";
    db.get(query, [name], (err, res)=>{
        if(err){
            return console.log(err);
        }
        if(res==null){
            return response.status(400).send({error:`No Movie with name ${name}`});
        }
        response.status(200).send(res);
    });
});

app.delete('/delete/movie/:name', (request, response)=>{
    const {name} = request.params;
    const query = "DELETE FROM movie WHERE name=?";
    db.run(query, [name], (err, res)=>{
        if(err){
            return console.log(err);
        }
        response.status(200).send("Successfully deleted");
    });
});

app.patch('/update/movie/:name', (request, response)=>{
    const {name} = request.params;
    db.get("SELECT * FROM movie WHERE name=?",[name], (err, res)=>{
        if(err){
            return response.status(500).send();
        }
        if(res===null){
            return response.status(400).send("Movie doesn't exist");
        }

        let currRating = res.rating;
        let currReview = res.review;
        const {rating=currRating, review=currReview}=request.body;

        db.run("UPDATE movie SET rating=?, review=? WHERE name=?",[rating, review, name], (err, res)=>{
            if(err){
                return response.status(500).send();
            }
            response.status(200).send("Successfully Updated");
        });
    });
});

app.listen(3001, (err)=>{
    if(err){
        return console.log("Error starting server: "+err);
    }
    console.log("server started successfully");
});