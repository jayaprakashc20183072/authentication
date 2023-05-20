//jshint esversion:6
require("dotenv").config();
const express = require("express");
const md5 = require("md5");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
const saltRounds = 10;
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true});
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const User = mongoose.model("User",userSchema);


app.get("/",function(req,res){
    res.render("home");
});
app.get("/register",function(req,res){
    res.render("register");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/register",function(req,res){
    bcrypt.hash(req.body.password,saltRounds).then((hash)=>{
        const newUser = new User (
            {
                email: req.body.username,
                password: hash
            }
        );
        newUser.save().then(()=>{
            res.render("secrets");
            
        }).catch((err)=>{console.log(err)})
    })
   
});
app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}).then((user)=>{
        if(user){
           bcrypt.compare(password,user.password).then((result)=>{
            if(result===true){
                res.render("secrets");
               
            }
           })
        }
    }).catch((err)=>{console.log(err)})
});
app.listen(3000,function(){
    console.log("server started on port 3000");
});