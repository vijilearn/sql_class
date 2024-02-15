const express = require("express");
const app = express();
const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const port = 8080;
const path = require("path");
const methodoverride = require("method-override");
const { v4: uuidv4 } = require('uuid');

app.use(methodoverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const connection =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password:"root",
  });
 
 // Home Route 
app.get("/", (req,res) =>{
  let q = `SELECT count(*) FROM user`;
  try {
    connection.query(q, (e,result) =>{
        if (e)  throw e;
        let count = result[0]["count(*)"];
        res.render("home.ejs",{count});
      });
  } catch (e) {
    console.log(e);
    res.send("some Error in DB");
  }
})

//new route
app.get("/users/new", (req,res) => {
  res.render("new.ejs")
})

app.post("/users", (req,res) =>{
  let {username,email,password} = req.body;
  let id = uuidv4();
  let q = `INSERT INTO user (id,username,email,password) VALUES('${id}','${username}','${email}','${password}')`;
  try {
    connection.query(q, (e,newuser) =>{
      if(e) throw e;
      res.redirect("/users");
    })
  } catch(e) {
    res.send("Some error",e);
  }
 
})

//Show Route
app.get("/users",(req,res) =>{
  let q = `SELECT * FROM user `;
  try {
    connection.query(q, (e,users) =>{
        if (e)  throw e;
           res.render("show.ejs",{ users });
      });
  } catch (e) {
    console.log(e);
    res.send("some Error in DB");
  }
    
});

//edit route (got the form for edit)
app.get("/users/:id/edit", (req,res) => {
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (e,user) =>{
        if (e) throw e;
        res.render("edit.ejs",{user});
      });
  } catch (e) {
    console.log(e);
    res.send("some Error in DB");
  }
})

//update route(update in the database)
app.patch("/users/:id",(req,res) =>{
  let {id} = req.params;
  let {username:newusername,email:newemail,password:formpass} = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (e,user) =>{
        if (e) throw e;
        if (user[0].password == formpass) {
          let q2 = `update user set username='${newusername}',email='${newemail}' where id='${id}'`;
          connection.query(q2,(e,result) =>{
          if (e) throw e;  
          res.redirect("/users");
          })
         
         } else{
          res.send("wrong password");
         }    
    });
  } catch (e) {
    console.log(e);
    res.send("some Error in DB");
  }
})

//Delete Route
app.delete("/users/:id",(req,res) =>{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (e,user) =>{
        if (e) throw e;
        let q2=`DELETE FROM user WHERE id='${id}'`;
        connection.query(q2, (e,result) =>{
        res.redirect("/users");
      })
                    
    });
  } catch (e) {
    console.log(e);
    res.send("some Error in DB");
  }
})

app.listen(port,() => {
  console.log("App started listening port",port);
});


