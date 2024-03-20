const express= require("express");
const mongoose=require("mongoose");
const userModel = require("./userSchema");
const session= require("express-session");
const mongoDbSession=require("connect-mongodb-session");

// constants
const MONGO_URL="mongodb+srv://Dnyanesh9881:8766808592@cluster0.ojteqk9.mongodb.net";

const app=express();

// Middlewares
app.use(express.urlencoded({extended:true}));



 app.get("/register-form", (req, res)=>{
    return res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>User form</h1>
    <form action="/register_user" method="POST">
        <label for="name">Name</label>
        <input type="text" name="name">
        <br/>
        <label for="email">Email</label>
        <input type="text" name="email">
        <br/>
        <label for="password">Password</label>
        <input type="text" name="password">
        <br> 
        <button type="submit">submit</button>
    </form>
</body>
</html>`)
 })

 app.get("/login", (req, res)=>{
    return res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Login </h1>
    <form action="/login_user" method="POST">
        <label for="email">Email</label>
        <input type="text" name="email">
        <br/>
        <label for="password">Password</label>
        <input type="text" name="password">
        <br> 
        <button type="submit">submit</button>
    </form>
</body>
</html>`)
 })
 app.post("/login_user", async(req, res)=>{
       console.log(req.body);
      const {email, password}=req.body;
      try {
        let userDb=await userModel.findOne({email:email});
        if(!userDb)
        return res.status(400).json("user not found, pleas resister first");

        if(password!==userDb.password)
        return res.status(400).json("password doesn't match");

        return res.send("logged in successful");
      } catch (error) {
         return res.status(500).json("server Error")
      }
      
 })
 app.post("/register_user", async(req, res)=>{

 console.log(req.body);
 const nameC=req.body.name;
 const emailC=req.body.email;
 const passwordC=req.body.password;
 const userObject=userModel({
    name:nameC,
    email:emailC,
    password:passwordC
 })
console.log(userObject, "userobject"); 
 try {
    const userDB=await userObject.save();
    console.log(userDB);
    return res.send({
        status:201,
        messsage:"user created Successfully",
        data:userDB
    })
    
 } catch (error) {
    return res.send({
        status:500,
        error:error
    })
 }
//  return res.send("From submitted successfully");
 })
mongoose
.connect(MONGO_URL)
.then(res=>{
    console.log("DataBase Connected successfully");
}).catch(err=>{
    console.log(err);
})
app.listen(8000, ()=>{
    console.log("server is running on 8000 port");
})