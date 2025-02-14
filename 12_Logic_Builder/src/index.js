//Always include dotenv at the top of your code so that all the env variables are loaded properly.
//we need to configure the dotenv by specifying the path of the env file.here file is outside this folder.
//To include the import of dotenv changes are made at package.json file i.e  "dev":"nodemon -r dotenv/config --experimental-json-modules src/index.js" is added to the file .
//Because dotenv hi aesa module hai jiske liye hume ye karna padta hai .Baki module directly import ho jate hai we don't need to edit package.json file in that case.

import dotenv from "dotenv"
import connectDB from "./db/index.js"
import {app} from "./app.js"
dotenv.config({
  path:'./env'
})


//calling the connect db function directly to connect with the database.
connectDB().then(() => {
  app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running at port :${process.env.PORT}`);
  })
}).catch((err) => {
  console.log("MongoDb connection failed", err);
})












