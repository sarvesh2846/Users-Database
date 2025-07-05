const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const { request } = require("https");
const methodOverride = require('method-override');
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method')); 


// Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'Mysql@123'
});

app.get("/", (req, res)=>{
  let q = `SELECT count(*) FROM user`;
      try {
    connection.query( q, (err, result)=>{
        if(err) throw err;
        let count = result[0]["count(*)"];
        res.render("home.ejs", { count });
    });
    } catch(err) {
        console.log(err);
        res.send("Some Error in DATABASE!!!");
    }
});

//show Route 
app.get("/user", (req, res)=>{
  let q = `SELECT * FROM user`;
  try{
    connection.query(q, (err, users)=>{
      if(err) throw err;
      //console.log(result);
      res.render("showusers.ejs", { users });
    });
  }catch(err){
    res.send("Something Error!!!");
  }
});

//Edit Route
app.get("/user/:id/edit", (req, res)=>{
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
    try{
    connection.query(q, (err, result)=>{
      if(err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  }catch(err){
    res.send("Something Error!!!");
  }
});

app.patch("/user/:id", (req, res) => {
    let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  let { password: formPass, username: newUsername} = req.body;
    try{
    connection.query(q, (err, result)=>{
      if(err) throw err;
      let user = result[0];
      if(formPass != user.password){
        res.send("WRONG PASSWORD");
      } else{
        let q2 = `UPDATE user SET username = '${newUsername}' WHERE id = '${id}'`;
        connection.query(q2, (err, result)=>{
          if(err) throw err;
          res.redirect("/user");
        });
      }
    });
  }catch(err){
    res.send("Something Error!!!");
  }
});



//Delete User
app.get("/user/:id/delete",  (req, res)=>{
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
    try{
    connection.query(q, (err, result)=>{
      if(err) throw err;
      let user = result[0];
      res.render("delete.ejs", { user });
    });
  }catch(err){
    res.send("Something Error!!!");
  }
});


app.delete("/user/:id", (req, res) => {
    let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  let { password } = req.body;
    try{
    connection.query(q, (err, result)=>{
      if(err) throw err;
      let user = result[0];
      if(user.password != password){
        res.send("WRONG PASSWORD");
      } else{
        let q2 = `DELETE FROM user WHERE id='${id}'`;
        connection.query(q2, (err, result)=>{
          if(err) throw err;
          console.log(result);
          console.log("deleted!");
          res.redirect("/user");
        });
      }
    });
  }catch(err){
    res.send("Something Error!!!");
  }
});

app.listen(port ,()=> {
  console.log("server is listening to the port 8080");
});

// connection.end();

