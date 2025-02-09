//importing dotenv
require('dotenv').config()

// now ab jaha bhi env file k andar  present jis bhi variable ko  yaha use  karna hai simply
// type process.env.variablename.
//in this  lec port variable is present in .env file so simply use process.env.port where port is used.

//using express or importing express here.
//in the terminal type npm i express or npm install express.
const express = require("express")

//now this app has become a very powerful variable.
const app = express();

//port number.this tells at which port to listen.
// const port = 3000


//by default '/' is route to home.

//this means app , listen karo at home route if we get any request there then give this callback and send hello world
app.get('/', (req, res) => {
  res.send("hello world");
})

//you know
app.get('/twitter', (req, res) => {
  res.send("this is twitter");
})

//if you get cannot get login please restart the server. because after every save we need to restart the server , issi problem ko solve karne k liye nodemon banaya hai.
app.get("/login", (req, res) => {
  //instead of string we can send these html tags and many other things as well.
  res.send('<h1>hello </h1>')
})

//listening at port 3000
//agar succesfully listen hoga to ye callback function run hoga.

app.listen(process.env.PORT, () => {
  console.log(`listening at port ${process.env.PORT}`)
})

//you can type localhost:3000 in your browser to check ki hello world aara hai ya nahi. aur wahi se localhost:3000/twitter route bhi check kar lo.("it must give twitter.")





