import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      //kisi bhi field ko searchable bnana hai to make index as true
      index:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index:true
    },
    avatar: {
      //cloudinary ka url hoga ye
      type: String,
      requred: true,
      
    },
    coverImage: {
      type:String
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Video"
      }
    ],
    password: {
      type: String,
      //this is custom error message (password is required )
      required: [true, 'Password is required'], 
    },
    refreshToken: {
      type:String
    }
  },{timestamps:true}
)

//dekho direct password encrpytion to possible nahi hai so for that we need hooks present in mongoose.
// we have a pre hook
//pre hook ek middleware hai jo ki data k just save hone se pehle execute hota hai, to iske andar jo bhi code daale wo run ho jayega just before saving the data.So here we will use it to encrypt the password.

//here we have parameters as first parameter is event here event is save means callback will run just before the save.2nd parameter is callback function.

//next is flag that is must in a middleware
userSchema.pre("save", function (next) {
  //because we are using pre hook to har baar jaise hi user save karega to save se theek pehle ye password ko change kar dega,aur  next call hoga to password baar baar encrypt(change) hota rahega so for that we will use this if condition , ki agar password mein change ho to tabhi encryption karna hai karke.

  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10)//10 is number of hash rounds.You can give by your own.
  //middleware mein next ko call karna hi padta hai.
  next();
})

//mongoose also allows to create custom methods as well.So for that .method is used over userSchema

//method for password verification using bcrypt.
userSchema.methods.isPasswrodCorrect = async function (password) {
  //bcrypt library can also check the password as well.
  //this.password hai encrypted wala.
  //password hai jo match karna hai .
  return await bcrypt.compare(password,this.password)
}


//Now simply by using methods we created a method to generate Access token and to generate refresh token.
//same wahi hai yaha par jwt provides a sign method which is used to create or generate access token it takes payload(data) and access token secret and access token expiry to generate access token . Neeche generate referesh token function bhi same hi banaya hai humne to create referesh token again sign is used which takes less payload and it takes refresh token secret and expiry as the 2nd argument.
//same wahi hai yaha par jwt provides a sign method which is used to create or generate access token it takes payload(data) and access token secret and access token expiry to generate access token . Neeche generate referesh token function bhi same hi banaya hai humne to create referesh token again sign is used which takes less payload and it takes refresh token secret and expiry as the 2nd argument.

userSchema.methods.generateAccessToken = function () {
  //token ko simply return karwa lo
 return jwt.sign({

   //payload or data
   //here this.email means email will be taken directly from the database.ok saare this are referring to database.
    _id: this._id,
    email: this.email,
    username: this.username,
    fullName:this.fullName
  }),
    process.env.ACCESS_TOKEN_SECRET, {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
}


//refersh token is also same here just payload is small it only takes the unique id from database.
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({
    _id: this._id,
   
  }),
    process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  }
}
export const User = mongoose.model("User", userSchema);

