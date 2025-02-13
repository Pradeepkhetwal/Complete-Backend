import express from "express"
import cors from "cors"
import cookieparser from "cookieparser"

const app = express();

//configuring cors.
//Now inside the cors we can pass which origin to be allowed so in env file we have created a origin variable which has * means to accept all the origin.
//Agar simply cors() bhi rehne doge to it will accept all the origin.
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials:true
}))

//here we are configuring json with express means we are allowing to accept json file with limit 16kb.
app.use(express.json({ limit: "16kb" }));

//this configuration is to take data from url.Here extendended true is not necessary simply express.urlencoded() bhi theek hai .
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//this configuration is to store static files like image ,pdf file locally in a folder , here public is the folder name , as you can see it is in our directory as well it is the same folder.
//it can save favicon icons and all.
app.use(express.static("public"));

//configuring cookie parser
app.use(cookieparser);



//importing routes here.
import userRouter from './routes/user.routes.js'

//routes declaration.Here /api/v1 is a standard practise.Dekho ab jaise hi user localhost:8000/api/v1/users/ mein jayega to userRouter k pass control chala jayega now in user.routes.js file we have defined the route /register to agar localhost:8000/api/v1/users/register bhejega to regsiterUser wala controller envoke ho jayega . Samjhe
app.use("/api/v1/users",userRouter)

export{app}